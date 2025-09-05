Page({
  data: {
    cartList: [
      {
        id: 1,
        name: "丝巾",
        price: 48,
        quantity: 1,
        image: "/images/goods1.jpg",
        checked: false
      },
      {
        id: 2,
        name: "瓷杯",
        price: 68,
        quantity: 2,
        image: "/images/goods2.jpg",
        checked: false
      }
    ],
    totalPrice: 0,
    selectedCount: 0
  },
  onShow: function() {
    // 每次页面显示时刷新购物车数据
    this.refreshCartData();
  },

  onLoad: function(options) {
    // 初始化时也保持刷新
    this.refreshCartData();
  },
  // Add this new method
  refreshCartData: function() {
    const cartList = wx.getStorageSync('cart') || this.data.cartList;
    this.setData({ cartList }, () => {
      this.calculateTotal();
    });
  },
  toggleCheck: function(e) {
    const index = e.currentTarget.dataset.index;
    const cartList = this.data.cartList;
    cartList[index].checked = !cartList[index].checked;
    this.setData({ cartList }, () => {
      wx.setStorageSync('cart', cartList);
      this.calculateTotal();
    });
    this.calculateTotal();
  },
  increaseQuantity: function(e) {
    const id = e.currentTarget.dataset.id;
    const cartList = this.data.cartList;
    const item = cartList.find(item => item.id === id);
    if (item && item.quantity < 99) {
      item.quantity++;
      this.setData({ cartList }, () => {
        wx.setStorageSync('cart', cartList);
      this.calculateTotal();
    });
      this.calculateTotal();
    }
  },
  decreaseQuantity: function(e) {
    const id = e.currentTarget.dataset.id;
    const cartList = this.data.cartList;
    const item = cartList.find(item => item.id === id);
    if (item && item.quantity > 1) {
      item.quantity--;
      this.setData({ cartList }, () => {
        wx.setStorageSync('cart', cartList);
      this.calculateTotal();
    });
      this.calculateTotal();
    }
  },
  calculateTotal: function() {
    const cartList = this.data.cartList;
    let totalPrice = 0;
    let selectedCount = 0;
    cartList.forEach(item => {
      if (item.checked) {
        totalPrice += item.price * item.quantity;
        selectedCount++;
      }
    });
    this.setData({ totalPrice, selectedCount });
  },
  handleBuy: function() {
    // 处理购买逻辑
    wx.showToast({
      title: '购买成功',
      icon: 'success'
    });
  },
  deleteItem(e) {
    const index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '确定要删除这个商品吗？',
      success: (res) => {
        if (res.confirm) {
          const cartList = this.data.cartList.filter((item, i) => i !== index);
          this.setData({ cartList }, () => {
      this.calculateTotal();
    });
          wx.setStorageSync('cart', cartList);
          this.calculateTotal();
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  },
  // 立即购买并删除商品
  buyNow: function() {
    console.log('开始执行buyNow方法');
    console.log('当前购物车数据:', JSON.stringify(this.data.cartList));
    
    // 获取所有选中的商品
    const selectedItems = this.data.cartList
      .filter(item => item.checked)
      .map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      }));
    
    console.log('选中的商品:', JSON.stringify(selectedItems));
    
    if (selectedItems.length === 0) {
      console.warn('没有选中任何商品');
      wx.showToast({
        title: '请先选择商品',
        icon: 'none'
      });
      return;
    }
  
    try {
      console.log('开始生成订单数据');
      const address = wx.getStorageSync('address');
      console.log('获取到的收货地址:', JSON.stringify(address));
      
      // 生成更完整的订单数据
      const order = {
        id: 'ORD-' + Date.now(),
        createTime: new Date().toISOString(),
        status: '待发货',
        items: selectedItems,
        totalPrice: this.data.totalPrice,
        paymentStatus: '已支付',
        address: address || {}
      };
  
      console.log('生成的订单数据:', JSON.stringify(order));
      
      // 保存订单到本地存储
      const orders = wx.getStorageSync('orders') || [];
      console.log('原有订单数据:', JSON.stringify(orders));
      
      orders.unshift(order);
      wx.setStorageSync('orders', orders);
      console.log('更新后的订单数据:', JSON.stringify(orders));
  
      // 从购物车中删除已购买的商品
      const newCartList = this.data.cartList.filter(item => !item.checked);
      this.setData({ cartList: newCartList });
      wx.setStorageSync('cart', newCartList);
      console.log('更新后的购物车数据:', JSON.stringify(newCartList));
  
      // 显示购买成功提示并跳转
      wx.showToast({
        title: '购买成功',
        icon: 'success',
        success: () => {
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/orders/orders'
            });
          }, 1500);
        }
      });
  
      this.calculateTotal();
    } catch (error) {
      console.error('生成订单失败:', error);
      console.error('错误堆栈:', error.stack);
      wx.showToast({
        title: '订单生成失败: ' + error.message,
        icon: 'error',
        duration: 3000
      });
    }
  },
});