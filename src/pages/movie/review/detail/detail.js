var app = getApp()
var timer
var id

Page({
  data: {
    loading: true,
    dialogTip: false,
    tipText: '',

    dialogInfo: false,
    dialogShadow: false,
    noMoreData: false,
    review: {},
    comments: [],
    page: 1
  },

  onLoad: function (options) {
    app.setBarColor()
    
    id = options.id
    this.getReview()
  },


  getReview() {

    app.http('reviews/' + id).then(res => {
      var review = res

      review.content = res.content.replace(/<br>/g, '\n')
      review.content = review.content.replace(/<p>/g, '')
      review.content = review.content.replace(/<\/p>/g, '\n')
      review.stars = app.starToArray(review.rating)

      this.setData({
        review: review
      })

      setTimeout(() => {
        wx.setNavigationBarTitle({
          title: '影片长评'
        })

        this.setData({
          loading: false
        })

      }, 10)

      this.getComments(1)
    })
  },

  getComments(page) {
    if (this.data.noMoreData) return

    var url = 'reviews/' + id + '/comments?page=' + page

    app.http(url).then(res => {
      var comments = res.data

      if (comments.length < 20) {
        this.setData({
          noMoreData: true
        })
      }

      for (var item of comments) {
        item.create_time = item.create_time.substr(0, 10)
      }

      this.setData({
        comments: this.data.comments.concat(comments),
        page: page
      })

    })
  },

  dofeel(e) {
    var feel = e.currentTarget.dataset.feel
    console.log(feel)
    if(feel == 'upper'){
      this.setData({
        'review.like': ++this.data.review.like
      })
    }else if(feel == 'down'){
      this.setData({
        'review.unlike': ++this.data.review.unlike
      })
    }

    this._tipFun('功能还未完成额')
  },

  onReachBottom: function () {
    if (!this.data.noMoreData) {
      this.getComments(++this.data.page)
    }
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