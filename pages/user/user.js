Page({
  data: {
    userInfo:{
      avatarUrl: getApp().globalData.avatar || '/images/avatar.png',
      username: getApp().globalData.username || '微信用户'
    },
    currentLang: getApp().globalData.currentLang || 'zh_CN',
    texts: {
      welcome: '',
      orderHistory: '',
      settings: ''
    }
  },
  handleGetUserInfo(e) {
    const rawData = e.detail.rawData;
    wx.setStorageSync('userInfo', rawData); 
    this.setData({
      isShow: false,
      userInfo: JSON.parse(rawData)
    });
  },
  navigateToInfo() {
    wx.navigateTo({
      url: '/pages/info/info'
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    const languageMap = require('../../utils/language.js')._t();
    const lang = wx.getStorageSync('language') || 'zh_CN';
    // 从缓存读取用户信息
    const userInfo = getApp().globalData;
    this.setData({
      texts: {
      '我的订单': languageMap['我的订单'],
      '全部订单': languageMap['全部订单'],
      '待付款': languageMap['待付款'],
      '待出行/发货': languageMap['待出行/发货'],
      '退款/退货': languageMap['退款/退货'],
      '系统设置': languageMap['系统设置'],
      '联系客服': languageMap['联系客服'],
      '意见反馈': languageMap['意见反馈'],
      '关于我们': languageMap['关于我们'],
      '退出登录': languageMap['退出登录']
      }
    })
    if (userInfo) {
      this.setData({ 
        userInfo: {
          avatarUrl: userInfo.avatar || '/images/avatar.png',
          username: userInfo.username || '微信用户'
        }
      }) 
    } else {
      wx.redirectTo({ url: '/pages/login/login' })
    }
    console.log('当前语言映射:', languageMap); // 查看是否包含预期键值
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 从缓存读取最新语言配置
    const lang = wx.getStorageSync('language') || 'zh_CN';
    const languageMap = require('../../utils/language.js')._t();
    this.setData({
      texts: {
        '我的订单': languageMap['我的订单'],
        '全部订单': languageMap['全部订单'],
        '待付款': languageMap['待付款'],
        '待出行/发货': languageMap['待出行/发货'],
        '退款/退货': languageMap['退款/退货'],
        '系统设置': languageMap['系统设置'],
        '联系客服': languageMap['联系客服'],
        '意见反馈': languageMap['意见反馈'],
        '关于我们': languageMap['关于我们'],
        '退出登录': languageMap['退出登录']
      },
      currentLang: lang
    });
  },

  // 切换语言（示例函数，按需保留）
  switchLang() {
    const newLang = this.data.currentLang === 'zh_CN' ? 'en' : 'zh_CN';
    wx.setStorageSync('language', newLang);
    getApp().globalData.currentLang = newLang;
    this.onShow(); // 手动触发更新
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  navigateToOrder() {
    wx.navigateTo({
      url: '/pages/order/order'
    });
  }
})