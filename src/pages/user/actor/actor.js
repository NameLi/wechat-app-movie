var app = getApp()

Page({
  data: {
    loading: true,
    noMoreData: false,
    actors: [],
    page: 1
  },

  onLoad: function () {
    app.setBarColor()

    this.getActors(1)
  },

  navigateToActor(e) {
    wx.navigateTo({
      url: '/pages/actor/info/info?id=' + e.currentTarget.dataset.id
    })
  },

  /**获取电影信息*/
  getActors: function (page) {
    if (this.data.noMoreData) return

    app.http({
      url: 'users/actors?page=' + page,
      token: true
    }).then(res => {

      if (this.data.loading) {
        setTimeout(_ => {
          this.setData({
            loading: false
          })
        }, 20)
      }

      if (page == 1) {
        wx.stopPullDownRefresh()
      }

      if (res.data.length < 20) {
        this.setData({
          noMoreData: true
        })
      }

      this.setData({
        actors: this.data.actors.concat(res.data)
      })
    })
  },

  onReachBottom: function () {
    if (!this.data.noMoreData) {
      this.getActors(++this.data.page)
    }
  },
  onPullDownRefresh() {
    this.setData({
      noMoreData: false
    })
    this.getActors(1)
  }
})