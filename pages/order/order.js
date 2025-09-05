// pages/order/order.js
Page({
  data: {
    loading: false,
    error: null,
    currentType: 'all',
    filteredOrders: [],
    orderList: [],
    // 定义选项卡类型与实际状态的映射关系
    statusMap: {
      'all': '全部',
      'unpaid': '待付款',
      'shipped': '待发货',
      'received': '待收货',
      'completed': '已完成'
    }
  },

  onLoad() {
    this.loadOrders();
  },

  onShow() {
    // 每次页面显示时也刷新订单数据
    this.loadOrders();
  },

  loadOrders() {
    this.setData({ loading: true, error: null });
    
    try {
      // 从本地存储获取订单数据
      const orders = wx.getStorageSync('orders') || [];
      
      // 转换订单数据格式以兼容原有结构
      const formattedOrders = orders.map(order => {
        // 取第一个商品作为代表（或可以根据需要显示多个商品）
        const firstItem = order.items && order.items.length > 0 ? order.items[0] : {};
        
        return {
          id: order.id || 'ORD-' + Date.now(),
          name: firstItem.name || '多件商品',
          status: order.status || '待发货',
          date: order.createTime ? new Date(order.createTime).toLocaleDateString() : new Date().toLocaleDateString(),
          total: order.totalPrice || 0,
          quantity: order.items ? order.items.reduce((sum, item) => sum + item.quantity, 0) : 1,
          image: firstItem.image || '/images/default-goods.jpg',
          // 保留完整订单数据
          fullOrder: order
        };
      });
      
      this.setData({ 
        orderList: formattedOrders,
        filteredOrders: this.filterOrdersByType(this.data.currentType, formattedOrders),
        loading: false 
      });
    } catch (error) {
      console.error('加载订单失败:', error);
      this.handleError('加载订单失败');
    }
  },

  handleError(msg) {
    this.setData({
      error: msg,
      loading: false
    });
    wx.showToast({
      title: msg,
      icon: 'none'
    });
  },

  switchType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      currentType: type,
      filteredOrders: this.filterOrdersByType(type, this.data.orderList)
    });
  },

  filterOrdersByType(type, orders) {
    if (type === 'all') {
      return orders;
    }
    
    const targetStatus = this.data.statusMap[type];
    return orders.filter(order => order.status === targetStatus);
  },

  // 查看订单详情
  viewOrderDetail(e) {
    const index = e.currentTarget.dataset.index;
    const order = this.data.filteredOrders[index];
    
    if (order && order.fullOrder) {
      wx.navigateTo({
        url: `/pages/orderDetail/orderDetail?order=${encodeURIComponent(JSON.stringify(order.fullOrder))}`
      });
    }
  }
});