var app = getApp()

Page({
  data: {
    loading: true,
    directors: [],
    actors: []
  },

  onLoad: function (options) {
    // this.getActors(1292052)
    this.getActors(options.id)
  },

  getActors: function (id) {
    app.http('movies/' + id + '/actors').then(res => {
      this.setData({
        directors: res.directors,
        actors: res.actors
      })

      this.setData({
        loading: false
      })
    })
  },

  navigateToActor(e) {
    wx.navigateTo({
      url: '/pages/actor/info/info?id=' + e.currentTarget.dataset.id
    })
  }
})