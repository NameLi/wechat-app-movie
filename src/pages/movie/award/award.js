var app = getApp()
var timer

Page({
  data: {
    loading: true,
    noMoreData: false,
    dialogTip: false,
    tipText: '提示',
    movies: [],
    terms: [],
    index: 0
  },

  onLoad: function () {
    app.setBarColor()
    
    var terms = []
    for(var i = 1; i < 91; i++) {
      terms.push('第'+i+'届')
    }

    this.setData({
      terms: terms,
      index: 89
    })

    this.getMovies(90)
  },

  getMovies: function (term) {

    wx.setNavigationBarTitle({
      title: '第'+ term +'届 奥斯卡金像奖'
    })

    app.http('awards/oscar/' + term).then(res => {

      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      })

      this.setData({
        movies: res,
        index: --term
      })

      if (this.data.loading) {
        setTimeout(_ => {
          this.setData({
            loading: false
          })
        }, 10)
      }

    })
  },

  bindPickerChange(e) {
    var term = parseInt(e.detail.value) + 1
    this.getMovies(term)
  },

  _tipFun(msg) {

    this.setData({
      dialogTip: true,
      tipText: msg
    })
    
    clearTimeout(timer)
    timer = setTimeout(()=>{
      this.setData({
        dialogTip: false
      })
    },2000)
  },

  changeTerm(e) {
    var type = e.currentTarget.dataset.type

    if(type == 'before') {
      if (this.data.index + 2 > 90) {
        this._tipFun('没有更多了')
        return
      }

      this.getMovies(this.data.index+2)
    }else{
      if (this.data.index < 1) {
        this._tipFun('没有更多了')
        return
      }
      this.getMovies(this.data.index)
    }

  },

  navigateToMovie(e) {
    wx.navigateTo({
      url: '/pages/movie/detail/detail?id=' + e.currentTarget.dataset.id
    })
  },

})