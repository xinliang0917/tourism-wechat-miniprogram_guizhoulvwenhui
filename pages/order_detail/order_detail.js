Page({
  data: {
    order: {}
  },
  onLoad: function(options) {
    const orderId = options.id;
    // 这里可以根据orderId获取订单详情数据
    this.setData({
      order: {
        id: orderId,
        status: '待付款',
        total: 100.00
      }
    });
  }
})