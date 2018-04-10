var app = getApp()
var timer

Page({
  data: {
    dialogTip: false,
    tipText: '',
    user: {
      nickName: '微信用户',
      avatarUrl: '/images/user_normal.jpg'
    }
  },
  onLoad: function () {
    this.getAuth()
  },

  onShow: function() {
    wx.getStorage({
      key: 'user',
      success: res => {
        this.setData({
          user: JSON.parse(res.data)
        })
      }
    })
  },

  getAuth() {
    wx.getUserInfo({
      success: (res) => {
        var userInfo = res.userInfo

        this.setData({
          'user.nickName': userInfo.nickName,
          'user.avatarUrl': userInfo.avatarUrl,
          'user.gender': userInfo.gender
        })

        wx.setStorage({
          key: "user",
          data: JSON.stringify(userInfo)
        })

        // 同步用户信息到数据库
        // 代码略

      }, fail: (res) => {
        console.log(res)
      }
    })
  },

  navigateTo(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },

  forbid() {
    this._tipFun('暂未开放')
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
