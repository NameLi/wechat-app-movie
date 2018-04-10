var app = getApp()
var i = 0

Page({
  data: {
    str: '怕什么真理无穷，进一寸有一寸的欢喜。',
    newstr: '',

    loading: true,
    loadingDistory: true,  // 这里有两个隐藏，为了隐藏时有个过渡动画，没找到更好解决办法

    cover: {},
    today: {},
    theater: {},
    coming: {},
    swipers: [],
    swiper: {
      autoplay: true,
      interval: 4000,
      duration: 200,
      currentDot: 0
    },
    searchAlpha: 0
  },

  getSwiperIndex(e) {
    this.setData({
      'swiper.currentDot': e.detail.current
    })
  },

  //  页面滚动控制搜索框样式
  onPageScroll(e) {
    var alpha = (e.scrollTop / 120).toFixed(2)
    this.setData({
      searchAlpha: alpha > 1 ? 1 : alpha
    })
  },

  onShow() {

    // 小程序上级activity修改标题时返回，会修改本activity标题，bug？
    setTimeout(_ => {
      wx.setNavigationBarTitle({
        title: '冰橙电影'
      })
    }, 100)
  },

  // wx页面加载完成
  onLoad: function () {

    setTimeout(_ => {
      wx.setNavigationBarTitle({
        title: ''
      })
    }, 160)

    // 隐藏底部导航栏，使加载页面全屏
    if (wx.hideTabBar) {
      wx.hideTabBar()
    }

    setTimeout(_ => {
      this.setStr()
    }, 300)

    this.getCover()

    this.getSwiper()
    this.getToday()
    this.getTheater()
    this.getComing()
    this.getNotice()
  },

  // 获取电影封面
  getCover() {
    app.http("cover")
      .then(res => {
        this.setData({
          cover: res
        })

        // 异步可能 loading 结束了才修改标题颜色
        if (this.data.loading) {
          wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#' + res.bg_color
          })
        }
      })
  },

  //  加载动画中的底部文字打字效果
  setStr() {

    if (this.data.str == this.data.newstr) {
      // 文字显示结束后 .5S 内关闭加载动画
      setTimeout(_ => {
        this.setData({
          loading: false
        })

        wx.setNavigationBarTitle({
          title: '冰橙电影'
        })
        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: '#ffffff',
          animation: {
            duration: 500,
            timingFunc: 'easeInOut'
          }
        })

        // 延时删除加载时的封面，原因：css 动画不支持 display ，所以先让它渐变透明，结束后再删除
        setTimeout(_ => {
          this.setData({
            loadingDistory: false
          })

          if (wx.showTabBar) {
            wx.showTabBar()
          }

          return
        }, 500)

      }, 500)

      return

    } else {

      // 遇到 , 暂停 .4s
      if (this.data.str[i - 1] !== '，') {
        var sec = parseInt(Math.random() * (120 - 30 + 1) + 30, 10)
      } else {
        var sec = 400
      }

      setTimeout(() => {
        this.setData({
          newstr: this.data.newstr + this.data.str[i]
        })

        i++
        this.setStr()

      }, sec)
    }
  },

  getSwiper() {
    app.http("swiper?type=miniprogram").then(res => {
      this.setData({
        swipers: res
      })
    })
  },

  getNotice() {
    app.http("notice?type=miniprogram").then(res => {
      this.setData({
        notice: res
      })
    })
  },

  //  获取那年今日电影信息
  getToday() {
    app.http("hometoday").then(res => {
      this.setData({
        today: res
      })
    })
  },

  //  获取正在热映
  getTheater() {
    app.http("movie/theater?per_page=8").then(res => {
      this.setData({
        theater: res
      })
    })
  },

  //  获取即将上映
  getComing() {
    app.http("movie/coming?per_page=8").then(res => {
      this.setData({
        coming: res
      })
    })
  },

  //  url跳转
  navigateTo(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },

  //  影视详情页 组件中的方法
  navigateToMovie(e) {
    wx.navigateTo({
      url: '/pages/movie/detail/detail?id=' + e.currentTarget.dataset.id
    })
  }
})