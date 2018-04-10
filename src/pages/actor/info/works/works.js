var app = getApp()
var id

Page({
  data: {
    noMoreData: false,
    movies: [],
    page: 1
  },

  onLoad: function (options) {
    id = options.id

    this.getWorks(1)
  },

  getWorks (page) {

    var url = 'casts/' + id + '/works?page=' + page
    app.http(url).then(res => {
      var movies = res.data

      if (movies.length < 20) {
        this.setData({
          noMoreData: true
        })

        if (movies.length === 0) {
          return
        }
      }

      this.setData({
        movies: this.data.movies.concat(movies),
        page: page
      })
    })
  },

  navigateToMovie(e) {
    wx.navigateTo({
      url: '/pages/movie/detail/detail?id=' + e.currentTarget.dataset.id
    })
  },

  onReachBottom: function () {
    if (!this.data.noMoreData) {
      this.getWorks(++this.data.page)
    }
  }
})