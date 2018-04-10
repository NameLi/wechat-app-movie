var app = getApp()
var serchTimer
var timer

Page({
  data: {
    dialogTip: false, //  提示框
    tipText: '',      //  提示框内容

    focus: true,
    loading: false,
    keyword: '',  //  搜索关键字
    histories: [],  //  搜索历史集

    navs: [
      { icon: 'icon-movie', text: '影视' },
      { icon: 'icon-actor', text: '影人' },
      { icon: 'icon-zixun', text: '影评' }
    ],
    navActived: 0,

    movies: [],
    actors: []
  },

  onLoad: function (options) {
    // 将本地存储的搜索记录赋值到 data 中
    wx.getStorage({
      key: 'keywords',
      success: res => {
        this.setData({
          histories: JSON.parse(res.data)
        })
      }
    })
  },

  doActived(e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      navActived: index
    })
  },

  showTip() {
    this._tipFun('暂未开放')
  },

  // 清除当前搜索关键字
  clearKeyword() {
    this.setData({
      focus: true,
      keyword: ''
    })
  },

  // 清空搜索记录，并将 data 中的记录清空
  clearHistory() {
    wx.removeStorage({
      key: 'keywords',
      success: res => {
        this.setData({
          histories: []
        })
        this._tipFun('清空成功')
      }
    })
  },


  //  点击搜索历史，进行搜索
  searchHistory(e) {
    var keyword = e.currentTarget.dataset.keyword
    this.search(keyword)
  },

  //  input 输入变化，进行搜索，函数防抖
  doSearch(e) {
    var keyword = e.detail.value

    clearTimeout(serchTimer)

    serchTimer = setTimeout(() => {
      this.search(keyword)
    }, 100)
  },

  //  将搜索结果标题按关键字拆分成数组(这边有字母大小写问题没解决)
  string2array(keyword, str) {
    var arr = [];
    str = str.replace(new RegExp(keyword, 'gi'), '|' + keyword + '|')
    arr = str.split('|')
    arr = this.delSpaceItem(arr)

    return arr
  },

  //  去掉空格数组元素
  delSpaceItem(arr) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == '') {
        arr.splice(i, 1)
      }
    }
    return arr
  },

  //  发起搜索请求
  search(keyword) {
    if (keyword == '') {
      this.setData({
        keyword: ''
      })
      return;
    }

    this.setData({
      loading: true,
      movies: {},
      actors: {}
    })

    this.setData({
      keyword: keyword
    })


    app.http("search?keyword=" + keyword).then(res => {

      //  将搜索结果查分为数组，使关键字变色
      for (let item of res.movies) {
        item.title = this.string2array(keyword, item.title)
      }

      for (let item of res.actors) {
        item.name = this.string2array(keyword, item.name)
      }

      this.setData({
        movies: res.movies,
        actors: res.actors,
        loading: false
      })
    })
  },

  navigateBack() {
    wx.navigateBack({})
  },

  navigateTo(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },

  //  点击搜索结果跳转
  goPath(ev) {
    var histories = this.data.histories
    var keyword = this.data.keyword

    //  判断关键字是否已存在，存在则踢出存在的关键字
    var i = 0
    for (let val of histories) {
      if (val == keyword) {
        histories.splice(i, 1);
      }
      i++
    }

    histories.unshift(keyword)

    //  搜索记录超过12条，则将最后记录踢出
    if (histories.length > 20) {
      histories.pop()
    }
    //  将关键字存入本地
    wx.setStorage({
      key: "keywords",
      data: JSON.stringify(histories)
    })

    this.setData({
      histories: histories
    })

    var movieId = ev.currentTarget.dataset.movieId;
    var actorId = ev.currentTarget.dataset.actorId;

    var url = '';
    if (movieId) {
      url = '/pages/movie/detail/detail?id=' + movieId
    } else if (actorId) {
      url = '/pages/actor/info/info?id=' + actorId
    }

    wx.navigateTo({
      url: url
    })
  },

  _tipFun(msg) {
    this.setData({
      dialogTip: true,
      tipText: msg
    })

    clearTimeout(timer)

    timer = setTimeout(() => {
      this.setData({
        dialogTip: false
      })
    }, 2000)
  }

})