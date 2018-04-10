var app = getApp()
var newMovies = []
var timer

Page({
  data: {
    loading: true,
    noMoreData: false,
    date: '',
    height: 0,
    heights: [],
    movies: [],
    page: 1
  },

 
  onLoad: function (options) {
    app.setBarColor()
    
    this.getComing(1)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.createSelectorQuery().select('#computedHeight').boundingClientRect((rect) => {
      this.setData({
        height: rect.height
      })
    }).exec()
  },


  onPageScroll(e) {
    
    clearTimeout(timer)

    timer = setTimeout(() => {
     
      var scrollY = e.scrollTop
      var i = 0
  
      for (let item of this.data.heights) {
        if (scrollY < item) {

          wx.setNavigationBarTitle({
            title: '即将上映 ' + this.data.movies[i].date
          })

          break;
        }
        i++
      }
    }, 50)

  },

  getComing: function (page) {

    app.http("movie/coming?page=" + page).then(res => {

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
        movies: data,
        heights: heights
      })
    })
  },

  //  整理电影数据
  sortData(movies) {
    newMovies = this.data.movies

    for (let item of movies) {
      if (this._inArray(item.coming_date)) {
        this.insertNewMovies(item)
      } else {
        newMovies.push({ date: item.coming_date, count: 1, movies: [item] })
      }
    }

    return newMovies;
  },

  //  将电影数据插入数组
  insertNewMovies(movie) {
    for (let item of newMovies) {
      if (movie.coming_date == item.date) {
        item.count++
        item.movies.push(movie)
        break;
      }
    }
  },

  //  查看年份是否已在数组中
  _inArray(date) {
    for (let item of newMovies) {
      if (date == item.date) {
        return true;
        break;
      }
    }
    return false;
  },


  onReachBottom: function () {
    if (!this.data.noMoreData) {
      this.getComing(++this.data.page)
    }
  },

  navigateToMovie(e) {
    wx.navigateTo({
      url: '/pages/movie/detail/detail?id=' + e.currentTarget.dataset.id
    })
  },
})