var app = getApp()
var timer

Page({
  data: {
    loading: true,
    dialogTip: false, //  提示框
    msg: '',      //  提示框内容

    dialogInfo: false,
    dialogShadow: false,

    movie: {},
    saved: false,
    comments: {},
    reviews: {}
  },

  onLoad: function (options) {
    var id = options.id
    // id = 1292052
    this.getMovie(id)
    this.getMovieSave(id)
    this.getComments(id)
    this.getReviews(id)
  },

  dolove() {
    this.setData({
      islove: true
    })

    setTimeout(() => {
      this.setData({
        islove: false
      })
    }, 1200)
  },

  toClose(e) {
    this.setData({
      dialogInfo: false
    })
  },

  dialogInfo() {
    this.setData({
      dialogInfo: true
    })
  },

  // 获取影视信息
  getMovie(id) {

    app.http('movies/' + id).then(res => {
      var movie = res

      movie.stars = this._movieStar(movie.rating)

      if (movie.summary) {  // 替换所有 <br /> 标签为 \n
        movie.summary = movie.summary.replace(/<br \/>/g, '\n')
      }

      wx.setNavigationBarTitle({
        title: movie.title
      })

      this.setData({
        movie: movie,
        loading: false
      })

      if (movie.bg_color != null && movie.bg_color.length == 6) {
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: '#' + movie.bg_color,
          animation: {
            duration: 80,
            timingFunc: 'easeInOut'
          }
        })
      } else {
        this.setData({
          'movie.bg_color': '776973'
        })
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: '#776973',
          animation: {
            duration: 80,
            timingFunc: 'easeInOut'
          }
        })
      }

    })
  },

  getMovieSave(id) {
    app.http({
      url: 'movies/' + id + '/save',
      token: true
    }).then(res => {
      if(res.code == 401) {
        return
      }
      this.setData({
        saved: res.saved
      })
    })
  },


  // 获取短评
  getComments(id) {
    app.http('movies/' + id + '/comments').then(res => {
      var comments = res
      if (res.data.length > 5) {
        comments.data.length = 5
      }
      for (var item of comments.data) {
        item.create_time = item.create_time.substr(0, 10)
        item.stars = app.starToArray(item.rating)
      }

      this.setData({
        comments: comments
      })
    })
  },

  // 获取影评
  getReviews(id) {
    app.http('movies/' + id + '/reviews').then(res => {
      var reviews = res

      if (res.data.length > 5) {
        reviews.data.length = 5
      }

      for (var item of reviews.data) {
        item.create_time = item.create_time.substr(0, 10)
        item.stars = app.starToArray(item.rating)
      }

      this.setData({
        reviews: reviews
      })
    })
  },


  //  影视评分方法
  _movieStar(val) {
    if (val == 0) return null

    var rating = Math.round(val)
    var stars = []

    for (let i = 0; i < 5; i++) {
      var n = rating - i * 2
      if (n > 1) {
        stars.push(2)
      } else if (n == 1) {
        stars.push(1)
      } else {
        stars.push(0)
      }
    }

    return stars
  },


  _tipFun(msg) {
    this.setData({
      dialogTip: true,
      msg: msg
    })

    clearTimeout(timer)
    timer = setTimeout(() => {
      this.setData({
        dialogTip: false
      })
    }, 2000)
  },

  navigateTo(e) {
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    })
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
  },

  toReviewDetail(e) {
    wx.navigateTo({
      url: '/pages/movie/review/detail/detail?id=' + e.currentTarget.dataset.id
    })
  }

})