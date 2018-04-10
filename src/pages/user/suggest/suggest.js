var app = getApp()
var timer

Page({
  data: {
    dialogTip: false, //  提示框
    msg: '',      //  提示框内容
  },

  onLoad: function (options) {

  },

  submitSuggest(e) {
    var content = e.detail.value.textarea

    if (content.length < 10) {
      this._tipFun('内容字数太少了 (╯‵□′)╯︵┻━┻')
      return
    }

    this._tipFun('提交成功，感谢您的反馈')

    setTimeout(() => {
      wx.navigateBack({
        delta: 1
      })
    }, 2000)

  },


  _tipFun(msg) {
    this.setData({
      dialogTip: true,
      msg: msg
    })

    clearTimeout(timer)
    timer = setTimeout(() => {
      this.setData({
        dialogTip: false
      })
    }, 2000)
  }
})