var app = getApp()
var id

Page({
  data: {
    loading: true,
    noMoreData: false,
    reviews: [],
    page: 1
  },

  onLoad: function (options) {
    app.setBarColor()
    
    id = options.id
    // id = 1292052
    this.getReview(1)
  },

  getReview(page) {
    if (this.data.noMoreData) return

    var url = 'movies/' + id + '/reviews?page=' + page
    app.http(url).then(res => {

      if (this.data.loading) {
        setTimeout(_ => {
          this.setData({
            loading: false
          })
        }, 20)
      }

      var reviews = res.data

      if (reviews.length < 20) {
        this.setData({
          noMoreData: true
        })
      }

      for (var item of reviews) {
        item.create_time = item.create_time.substr(0, 10)
        item.stars = app.starToArray(item.rating)
      }

      this.setData({
        reviews: this.data.reviews.concat(reviews),
        page: page
      })

    })
  },

  onReachBottom: function () {
    if (!this.data.noMoreData) {
      this.getReview(++this.data.page)
    }
  },

  toReviewDetail(e) {
    wx.navigateTo({
      url: '/pages/movie/review/detail/detail?id=' + e.currentTarget.dataset.id
    })
  },
})