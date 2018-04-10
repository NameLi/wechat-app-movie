var app = getApp()
var newMovies = []

Page({
  data: {
    loading: true,
    noMoreDate: false,
    year: 2017,
    height: 0,
    heights: [],
    movies: [],
    page: 1
  },

  onLoad: function (options) {
    app.setBarColor()
    
    this.getToday(1)
  },


  onReady: function () {
    wx.createSelectorQuery().select('#computedHeight').boundingClientRect((rect) => {
      this.setData({
        height: rect.height
      })
    }).exec()
  },


  onPageScroll(e) {
    var timer = null
    clearTimeout(timer)

    timer = setTimeout(() => {
      var scrollY = e.scrollTop
      var i = 0

      for (let item of this.data.heights) {
        if (scrollY < item) {
          wx.setNavigationBarTitle({
            title: '那年今日 ' + this.data.movies[i].year
          })
          break
        }
        i++
      }
    }, 100)

  },

  getToday: function (page) {
    if (this.data.noMoreData) return

    app.http('today?page=' + page).then(res => {

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

      var data = this.sortData(res.data)

      var heights = []
      var height = -10

      for (let item of data) {
        height += this.data.height * item.count + 40
        heights.push(height)
      }

      this.setData({
        page: res.page,
        movies: data,
        heights: heights
      })
    })
  },

  //  整理电影数据
  sortData(movies) {
    newMovies = this.data.movies;
    var _this = this
    for (let item of movies) {
      if (this.isInYearArr(item.year)) {
        this.insertNewMovies(item)
      } else {
        newMovies.push({ year: item.year, count: 1, movies: [item] })
      }
    }

    return newMovies;
  },

  //  将电影数据插入数组
  insertNewMovies(movie) {
    for (let item of newMovies) {
      if (movie.year == item.year) {
        item.count++
        item.movies.push(movie)
        break;
      }
    }
  },

  //  查看年份是否已在数组中
  isInYearArr(year) {
    for (let item of newMovies) {
      if (year == item.year) {
        return true;
        break;
      }
    }
    return false;
  },

  onReachBottom: function () {
    if (!this.data.noMoreData) {
      this.getToday(++this.data.page)
    }
  },

  navigateToMovie(e) {
    wx.navigateTo({
      url: '/pages/movie/detail/detail?id=' + e.currentTarget.dataset.id
    })
  }
})