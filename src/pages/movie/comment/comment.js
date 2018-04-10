var app = getApp()
var timer
var id

Page({
  data: {
    loading: true,
    skeleton: [1,1,1,1,1],

    dialogInfo: false,
    dialogShadow: false,
    dialogTip: false,
    tipText: '',

    noMoreData: false,
    comments: [],
    page: 1
  },

  onLoad: function (options) {
    app.setBarColor()
    
    id = options.id
    this.getComments(1)
  },

  getComments(page) {
    if (this.data.noMoreData) return

    var url = 'movies/' + id + '/comments?page=' + page;
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

      var comments = res.data

      for (var item of comments) {
        item.create_time = item.create_time.substr(0, 10)
        item.stars = app.starToArray(item.rating)
      }

      this.setData({
        comments: this.data.comments.concat(comments),
        page: page
      })

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
  },

  lowerComment() {
    this.setData({
      dialogShadow: false
    })
    this._tipFun('踩成功')
  },

  reportComment() {
    this.setData({
      dialogShadow: false
    })
    this._tipFun('感谢您的反馈')
  },

  showTool() {
    this.setData({
      dialogShadow: true
    })
  },

  closeShade() {
    this.setData({
      dialogShadow: false
    })
  },

  onReachBottom: function () {
    if (!this.data.noMoreData) {
      this.getComments(++this.data.page)
    }
  }

})