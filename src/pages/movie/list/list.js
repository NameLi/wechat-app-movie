var app = getApp()
var query // 查询参数
var page = 1

Page({
  data: {
    nodata: false,
    loading: true,
    
    categoryIdx: 0,
    genreIdx: 0,
    countryIdx: 0,
    yearIdx: 0,

    categories: ['全部', '电影', '动画', '短片', '纪录片', '电视剧', '综艺'],
    genres: ['全部', '爱情', '科幻', '动画', '战争', '恐怖', '喜剧', '动作', '灾难', '剧情', '悬疑', '犯罪', '冒险', '传记', '情色', '音乐', '家庭'],
    countries: ['全部', '大陆', '美国', '英国', '法国', '香港', '日本', '德国', '韩国', '意大利', '加拿大', '台湾', '西班牙', '印度'],
    years: ['全部', 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, '2010-2005', '2004-2000', '90年代', '80年代', '更早'],

    movies: []
  },

  onLoad: function () {
    this.getMovies()
  },

  getMovies(params) {
    params = params === undefined ? '' : params

    this.setData({
      loading: true
    })

    app.http('movies' + "?page=" + page + params).then(res => {
      // 未找到该分类下数据
      if (res.data.length < 30 && page === 1) {
        this.setData({
          loading: false
        })

        if(res.data.length == 0) {
          this.setData({
            nodata: true
          })

          return
        }
      }

      this.setData({
        movies: this.data.movies.concat(res.data),
        page: ++page
      })
    })
  },

  // 分类
  ontapCategoryIdx(e) {
    this.setData({
      categoryIdx: e.currentTarget.dataset.idx
    })

    this.getTags(true);
  },

  // 类型
  ontapGenreIdx(e) {
    this.setData({
      genreIdx: e.currentTarget.dataset.idx
    })

    this.getTags(true);
  },

  // 国家
  ontapCountryIdx(e) {
    this.setData({
      countryIdx: e.currentTarget.dataset.idx
    })

    this.getTags(true);
  },

  // 年代
  ontapYearIdx(e) {
    this.setData({
      yearIdx: e.currentTarget.dataset.idx
    })

    this.getTags(true);
  },

  // 拼接查询参数
  getTags(bool) {

    // bool true 时重置数据
    if (bool) {
      this.setData({
        nodata: false,
        movies: []
      })
      page = 1
      query = ''
      query += this.data.categoryIdx == 0 ? "" : '&category=' + this.data.categoryIdx
      query += this.data.genreIdx == 0 ? "" : '&genre=' + this.data.genres[this.data.genreIdx]
      query += this.data.countryIdx == 0 ? "" : '&country=' + this.data.countries[this.data.countryIdx]
      query += this.data.yearIdx == 0 ? "" : '&year=' + this.data.years[this.data.yearIdx]
    }

    this.getMovies(query);
  },

  // 下拉刷新，重置所有参数
  onPullDownRefresh: function () {
    this.getTags(true)
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 0)
  },

  // 上拉加载更多
  onReachBottom: function () {
    this.getTags(false)
  },

  navigateToMovie(e) {
    wx.navigateTo({
      url: '/pages/movie/detail/detail?id=' + e.currentTarget.dataset.id
    })
  },
})