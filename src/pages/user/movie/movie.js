var app = getApp()

Page({
  data: {
    loading: true,
    noMoreData: false,
    movies: [],
    page: 1
  },

  onLoad: function (options) {
    app.setBarColor()
    
    this.getMovies(1)
  },

  getMovies(page) {
    if (this.data.noMoreData) return

    app.http({
      url: 'users/movies?page=' + page,
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
        movies: this.data.movies.concat(res.data)
      })
    })
  },

  onReachBottom: function () {
    if (!this.data.noMoreData) {
      this.getMovies(++this.data.page)
    }
  },

  onPullDownRefresh() {
    this.setData({
      noMoreData: false
    })
    this.getMovies(1)
  },

  navigateToMovie(e) {
    wx.navigateTo({
      url: '/pages/movie/detail/detail?id=' + e.currentTarget.dataset.id
    })
  },
})