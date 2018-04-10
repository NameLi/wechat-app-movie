var app = getApp()
var timer

Page({
  data: {
    dialogTip: false,
    tipText: '',

    info: {}
  },

  onLoad: function (options) {
    app.setBarColor()

    this.getAboutus()
  },

  getAboutus() {
    app.http('aboutus?type=miniprogram').then(res => {
      this.setData({
        info: res
      })
    })
  },

  getClipboard(e) {
    var content = e.currentTarget.dataset.content
    
    wx.setClipboardData({
      data: content,
      success: res=> {
        this._tipFun('复制成功')
      }
    })
  },

  _tipFun(msg) {
    this.setData({
      dialogTip: true,
      tipText: msg
    })

    clearTimeout(timer)
    timer = setTimeout(() => {
      this.setData({
        dialogTip: false
      })
    }, 2000)
  }
})