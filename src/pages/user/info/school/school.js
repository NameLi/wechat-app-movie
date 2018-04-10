var app = getApp()
var inputTimer
var timer

Page({
  data: {
    dialogTip: false,
    msg: '',

    nodata: false,
    focus: false,
    keyword: '',
    schools: []
  },

  onLoad: function() {

    wx.getStorage({
      key: 'user',
      success: res => {
        this.setData({
          user: JSON.parse(res.data)
        })
      }
    })
  },

  getSchools(keyword) {
    app.http('schools/search?keyword=' + keyword).then(res => {
      var nodata = res.length > 0 ? false : true

      this.setData({
        schools: res,
        nodata: nodata
      })
    })
  },

  doSearch(e) {
    var keyword = e.detail.value

    if (keyword.length == 0) return

    this.setData({
      keyword: keyword
    })

    clearTimeout(inputTimer)
    inputTimer = setTimeout(() => {
      this.getSchools(keyword)
    }, 200)
  },

  // 清除当前搜索关键字
  clearKeyword() {
    this.setData({
      focus: true,
      keyword: '',
      schools: []
    })
  },

  //  选择学校
  chosenSchool(e) {
    var school_id = e.currentTarget.dataset.id

    for (let item of this.data.schools) {
      if (item.id == school_id) {
        this.setData({
          keyword: item.name,
          schools: []
        })

        //  将选择学校保存到用户表中
        this.saveUserSchool(item.name)

        break
      }
    }
  },

  //  将选择学校保存到用户表中
  saveUserSchool(school_name) {
    this.setData({
      'user.school': school_name
    })

    wx.setStorage({
      key: "user",
      data: JSON.stringify(this.data.user)
    })

    this._tipFun('修改成功,即将跳转')

    //  返回上一页
    setTimeout(() => {
      var pages = getCurrentPages()
      var prevPage = pages[pages.length - 2]
      prevPage.setData({
        'user.school': name
      });

      wx.navigateBack({
        delta: 1
      })
    }, 2000)

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
  }
})