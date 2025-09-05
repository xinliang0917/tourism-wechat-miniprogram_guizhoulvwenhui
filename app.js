App({
  globalData: {
    avatar: '/images/avatar.png',
    username: '微信用户'
  },
  onLaunch: function () {
    wx.cloud.init({
      env: 'wl-5gsisza47141ae2b',
      traceUser: true,
    })
    if (wx.requirePrivacyAuthorize) {
      wx.requirePrivacyAuthorize({
        success: () => console.log('隐私协议已同意'),
        fail: () => wx.exitMiniProgram()
      })
    }
  },
})