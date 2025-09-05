Page({
  data: {
    languageList: ['中文', 'English', 'ไทย', 'Tiếng Việt'],
    avatar: '/images/avatar.png',
    username: '微信用户',
    address: '广西壮族自治区桂林市七星区桂州路1号',
    receiver: '张先生',
    phone: '13800138000',
    lang: '中文',
    selectedLang: '中文',
    isEditingUsername: false,
    isEditingAddress: false,
    isEditingReceiver: false,
    isEditingPhone: false
  },
  editUsername: function() {
    this.setData({
      isEditingUsername: true
    });
  },
  editAddress: function() {
    this.setData({
      isEditingAddress: true
    });
  },
  editReceiver: function() {
    this.setData({
      isEditingReceiver: true
    });
  },
  editPhone: function() {
    this.setData({
      isEditingPhone: true
    });
  },
  chooseAvatar: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          avatar: res.tempFilePaths[0]
        })
      }
    })
  },
  saveInfo: function(e) {
    const { username, address, receiver, phone } = e.detail.value;
    wx.setStorageSync('username', username);
    wx.setStorageSync('address', address);
    wx.setStorageSync('receiver', receiver);
    wx.setStorageSync('phone', phone);
    const app = getApp();
    app.globalData.username = username;
    app.globalData.avatar = this.data.avatar;
    wx.showToast({
      title: '保存成功',
      icon: 'success'
    });
    this.setData({
      username,
      address,
      receiver,
      phone
    });
    wx.navigateBack();
  },
  saveAvatarAndUsername: function() {
    const avatar = getApp().globalData.avatar;
    const username = getApp().globalData.username;
    wx.setStorageSync('avatar', avatar);
    wx.setStorageSync('username', username);
    wx.showToast({
      title: '保存成功',
      icon: 'success'
    });
    wx.navigateBack();
  },
  // 初始化页面时，将存储的语言代码转换为显示名称
  onLoad: function() {
    // 初始化：将存储的语言代码转换为显示名称
    const langCode = wx.getStorageSync('language') || 'zh_CN';
    const reverseLangCodeMap = {
      'zh_CN': '中文',
      'en': 'English',
      'th_TH': 'ไทย',
      'vi_VN': 'Tiếng Việt'
    };
    const displayLang = reverseLangCodeMap[langCode] || '中文';
    this.setData({
      lang: displayLang,
      selectedLang: displayLang  // 初始选中项与当前语言一致
    });
  },

  bindPickerChange: function(e) {
    // 仅更新临时选中的语言名称，不生效
    const selectedIndex = e.detail.value;
    const displayLang = this.data.languageList[selectedIndex];
    this.setData({ selectedLang: displayLang });
  },

  saveInfo: function(e) {
    // 1. 保存用户信息（用户名、地址等）
    const { username, address, receiver, phone } = e.detail.value;
    wx.setStorageSync('username', username);
    wx.setStorageSync('address', address);
    wx.setStorageSync('receiver', receiver);
    wx.setStorageSync('phone', phone);
    const app = getApp();
    app.globalData.username = username;
    app.globalData.avatar = this.data.avatar;

    // 2. 保存语言（仅在点击保存时生效）
    const langCodeMap = {
      '中文': 'zh_CN',
      'English': 'en',
      'ไทย': 'th_TH',
      'Tiếng Việt': 'vi_VN'
    };
    const langCode = langCodeMap[this.data.selectedLang] || 'zh_CN';
    wx.setStorageSync('language', langCode);
    getApp().globalData.currentLang = langCode;

    // 3. 更新页面数据并返回
    this.setData({
      lang: this.data.selectedLang, // 更新生效的语言名称
      username,
      address,
      receiver,
      phone
    });
    wx.showToast({ title: '保存成功', icon: 'success', duration: 800});
    setTimeout(() => {
      wx.navigateBack();
    }, 800);
  }
})