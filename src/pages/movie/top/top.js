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

  navigateToMovie(e) {
    wx.navigateTo({
      url: '/pages/movie/detail/detail?id=' + e.currentTarget.dataset.id
    })
  },

  /**
   * 获取电影信息
  */
  getMovies: function (page) {

    if (page > 10) {
      this.setData({
        noMoreData: true
      })
    }
    if (this.data.noMoreData) return

    app.http({
      url: 'top',
      data: { page: page}
    }).then(res => {
      this.setData({
        loading: false,
        page: res.page,
        movies: this.data.movies.concat(res.data)
      })
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.noMoreData) {
      this.getMovies(++this.data.page)
    }
  }
})