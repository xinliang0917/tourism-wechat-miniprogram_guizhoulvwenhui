Page({
  data: {
    cameraActive: true,
    scanInterval: null,
    videoUrl: '',
    logMessages: [], // 调试日志
    progress: 0      // 上传进度
  },

  onLoad() {
    this.log('页面初始化')
    this.checkCameraAuth()
  },

  // 权限检查
  checkCameraAuth() {
    this.log('检查摄像头权限')
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.camera']) {
          this.startScanner()
        } else {
          this.requestCameraAuth()
        }
      },
      fail: () => this.showError('权限检查失败')
    })
  },

  // 请求权限
  requestCameraAuth() {
    this.log('请求摄像头授权')
    wx.authorize({
      scope: 'scope.camera',
      success: () => this.startScanner(),
      fail: () => this.showAuthModal()
    })
  },

  // 启动扫描
  startScanner() {
    this.log('启动扫描循环')
    this.setData({ cameraActive: true })
    this.data.scanInterval = setInterval(() => {
      if (!this.data.videoUrl) this.captureFrame()
    }, 5000)
  },

  // 拍照
  captureFrame() {
    this.log('尝试拍照...')
    const ctx = wx.createCameraContext(this)
    ctx.takePhoto({
      quality: 'high',
      success: res => this.processImage(res.tempImagePath),
      fail: err => {
        this.log(`拍照失败: ${err.errMsg}`)
        this.showError('无法启动摄像头')
      }
    })
  },

  // 处理图像
  async processImage(tempPath) {
    try {
      this.log('开始处理图像')
      
      // 上传到云存储
      const uploadRes = await this.uploadImage(tempPath)
      
      // 调用云函数
      const detectRes = await wx.cloud.callFunction({
        name: 'artifactDetector',
        data: { fileID: uploadRes.fileID },
        config: { env: 'wl-5gsisza47141ae2b' } 
      })

      this.log(`云函数返回: ${JSON.stringify(detectRes.result)}`)

      // 处理结果
      if (detectRes.result.code === 0) {
        this.playVideo(detectRes.result.data.videoUrl)
      } else {
        let msg = detectRes.result.msg
        if (detectRes.result.suggest) {
          msg += `\n建议搜索: ${detectRes.result.suggest.join(', ')}`
        }
        this.showError(msg)
      }
    } catch (err) {
      this.log(`处理异常: ${err.errMsg || err.toString()}`)
      this.showError('处理失败，请重试')
    }
  },

  // 上传图片（带进度）
  uploadImage(tempPath) {
    return new Promise((resolve, reject) => {
      this.log('开始上传图片')
      const uploadTask = wx.cloud.uploadFile({
        cloudPath: `scans/${Date.now()}.jpg`,
        filePath: tempPath,
        success: resolve,
        fail: reject
      })

      uploadTask.onProgressUpdate(res => {
        this.setData({ progress: res.progress })
        this.log(`上传进度: ${res.progress}%`)
      })
    })
  },

  // 播放视频
  playVideo(url) {
    this.log(`开始播放视频: ${url}`)
    this.setData({ 
      videoUrl: url,
      cameraActive: false 
    }, () => {
      this.videoContext = this.selectComponent('#videoPlayer')
      this.videoContext.play()
      clearInterval(this.data.scanInterval)
    })
  },

  // 视频结束
  onVideoEnd() {
    this.log('视频播放结束')
    this.setData({ videoUrl: '' }, () => {
      this.startScanner()
    })
  },

    // 关闭视频
    closeVideo() {
      this.log('关闭视频播放')
      this.setData({ videoUrl: '' }, () => {
        this.startScanner()
      })
    },

  // 调试日志
  log(message) {
    const timestamp = new Date().toLocaleTimeString()
    this.setData({
      logMessages: [...this.data.logMessages, `[${timestamp}] ${message}`]
    })
    console.log(message)
  },

  // 显示错误
  showError(msg) {
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 3000
    })
  },

  // 显示授权弹窗
  showAuthModal() {
    wx.showModal({
      title: '需要摄像头权限',
      content: '请允许使用摄像头以扫描文物',
      success: res => {
        if (res.confirm) wx.openSetting()
      }
    })
  },

  onUnload() {
    clearInterval(this.data.scanInterval)
  }
})