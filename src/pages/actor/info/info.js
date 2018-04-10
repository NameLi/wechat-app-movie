var app = getApp()
var timer

Page({
  data: {
    dialogTip: false,
    tipText: '',
    
    actor: {}
  },

  onLoad: function (options) {
    var id = options.id
    // id = 1000009

    this.getActor(id)
    this.getActorSave(id)
  },

  getActor(id) {

    app.http("casts/" + id).then(res => {
      var actor = res
      actor.summary = actor.summary.replace(/<br\/>/g, '')

      wx.setNavigationBarTitle({
        title: actor.name
      })

      this.setData({
        actor: actor
      })

      if (actor.bg_color != null && actor.bg_color.length == 6) {
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: '#' + actor.bg_color
        })
      }
    })
  },

  getActorSave(id) {
    app.http({
      url: 'casts/' + id + '/save',
      token: true
    }).then(res => {
      this.setData({
        saved: res.saved
      })
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
  },

  navigateTo(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },

  navigateToMovie(e) {
    wx.navigateTo({
      url: '/pages/movie/detail/detail?id=' + e.currentTarget.dataset.id
    })
  }

})