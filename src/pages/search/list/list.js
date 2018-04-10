var app = getApp()
var keyword

Page({
  data: {
    loading: true,
    noMoreData: false,
    type: '',
    list: [],
    total: 0,
    page: 1
  },

  onLoad: function (options) {

    keyword = options.keyword

    this.setData({
      type: options.type
    })

    app.setBarColor()

    this.getMovies(1)
  },

  getMovies(page) {
    if (this.data.noMoreData) return

    var url = 'search?keyword=' + keyword + '&type=' + this.data.type + '&page=' + page

    app.http(url).then(res => {
      if (this.data.loading) {
        setTimeout(_ => {
          this.setData({
            loading: false
          })
        }, 20)
      }

      if (res.data.length < 20) {
        this.setData({
          noMoreData: true
        })
      }

      if(this.data.total == 0) {
        wx.setNavigationBarTitle({
          title: '"' + keyword + '" 的搜索结果共 ' + res.total + ' 条'
        })
        this.setData({
          total: res.total
        })
      }

      this.setData({
        list: this.data.list.concat(res.data)
      })
    })
  },

  onReachBottom: function () {
    if (!this.data.noMoreData) {
      this.getMovies(++this.data.page)
    }
  },

  navigateToMovie(e) {
    wx.navigateTo({
      url: '/pages/movie/detail/detail?id=' + e.currentTarget.dataset.id
    })
  },

  navigateToActor(e) {
    wx.navigateTo({
      url: '/pages/actor/info/info?id=' + e.currentTarget.dataset.id
    })
  }
  
})