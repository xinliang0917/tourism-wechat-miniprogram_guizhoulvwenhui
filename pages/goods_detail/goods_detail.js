//goods_detail.js
Page({
  data: {
    goodsInfo: {},
    showAddToCartModal: false,
    quantityOptions: [1, 2, 3, 4, 5],
    selectedQuantityIndex: 0
  },
  onLoad(options) {
    const goodsId = options.id;
    // 根据商品ID获取商品信息
    const goodsInfo = this.getGoodsInfoById(goodsId);
    this.setData({
      goodsInfo: goodsInfo
    });
    // 动态设置导航栏标题
    wx.setNavigationBarTitle({
      title: goodsInfo.title
    });
  },
  // 显示加入购物车弹窗
  showAddToCartModal() {
    this.setData({
      showAddToCartModal: true
    });
  },
  // 处理数量选择
  handleQuantityChange(e) {
    this.setData({
      selectedQuantityIndex: e.detail.value
    });
  },
  // 增加数量
  increaseQuantity() {
    if (this.data.selectedQuantityIndex < this.data.quantityOptions.length - 1) {
      this.setData({
        selectedQuantityIndex: this.data.selectedQuantityIndex + 1
      });
    }
  },

  // 减少数量
  decreaseQuantity() {
    if (this.data.selectedQuantityIndex > 0) {
      this.setData({
        selectedQuantityIndex: this.data.selectedQuantityIndex - 1
      });
    }
  },

  // 处理加入购物车
  handleAddToCart() {
    const goods = this.data.goodsInfo;
    const quantity = this.data.quantityOptions[this.data.selectedQuantityIndex];
    // 获取购物车数据
    const cart = wx.getStorageSync('cart') || [];
    // 查找是否已存在该商品
    const index = cart.findIndex(item => item.id === goods.id);
    if (index > -1) {
      // 如果存在则更新数量
      cart[index].quantity += quantity;
    } else {
      // 如果不存在则添加新商品
      cart.push({
        id: goods.id,
        name: goods.title,
        price: goods.price,
        quantity: quantity,
        image: goods.image
      });
    }
    // 保存购物车数据
    wx.setStorageSync('cart', cart);
    // 关闭弹窗
    this.setData({
      showAddToCartModal: false
    });
    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    });
  },
  getGoodsInfoById(id) {
    // 模拟商品数据
    const goodsList = [
      {
        id: 1,
        image: '/images/example.jpg',
        title: '两日游',
        desc: '两日游，让游客体验特色景点和美食',
        price: 199
      },
      {
        id: 2,
        image: '/images/example.jpg',
        title: '三日游',
        desc: '三日游，让游客体验特色景点和美食',
        price: 199
      },
     {  id: 3,  image: '/images/example.jpg',
        title: '深度游',
        desc: '深度游，适合时间充足的游客，深度体验当地风土人情。',
        price: 399
      },
      {  id: 4,  image: '/images/example.jpg',
        title: '一日游',
        desc: '一日游，适合时间只有一天的游客快速游览。',
        price: 99
      },
      {
        id: 5,
        image: '/images/goods1.jpg',
        title: '非遗图案丝巾',
        desc: '图案选择非遗传统样式，独具匠心。',
        price: 48
      },
      {
        id: 6,
        image: '/images/goods2.jpg',
        title: '瓷杯盲盒',
        desc: '非遗瑰宝，手工制作',
        price: 68
      }
    ];
    return goodsList.find(item => item.id === Number(id));
  }
})