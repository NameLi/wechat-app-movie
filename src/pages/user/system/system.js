var app = getApp()

Page({
  data: {

  },

  onLoad: function (options) {
    app.setBarColor()
  },
  
  logout() {
    app.http({
      method: 'delete',
      url: 'authorizations/current',
      data: {
        identity_type: 'miniprogram'
      }
    }).then(res => {
      wx.removeStorageSync('jwt')

      var pages = getCurrentPages()
      var prevPage = pages[pages.length - 2]
      prevPage.setData({
        isBind: false
      });

      wx.navigateBack({
        delta: 1
      })
    })
  }
})