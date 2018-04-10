var app = getApp()
var timer

Page({
  data: {
    dialogTip: false, //  提示框
    tipText: '',      //  提示框内容
    user: {
      nickName: '微信用户',
      avatarUrl: '/images/user_normal.jpg'
    },
    grades: [2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002]
  },

  onShow: function () {
    this.getUser()
  },

  getUser() {
    wx.getStorage({
      key: 'user',
      success: res => {
        this.setData({
          user: JSON.parse(res.data)
        })
      }
    })

  },

  handelBirthday: function (e) {
    var date = e.detail.value

    this.setData({
      'user.birthday': date
    })

    setTimeout(() => {
      this.submitInfo()
    }, 0)
  },

  handelGrade: function (e) {
    var grade = this.data.grades[parseInt(e.detail.value)]

    this.setData({
      'user.grade': grade
    })

    setTimeout(() => {
      this.submitInfo()
    }, 0)
  },

  submitInfo() {

    wx.setStorage({
      key: "user",
      data: JSON.stringify(this.data.user)
    })
  
    this._tipFun('更新成功')

  },

  navigateTo(e) {
    var url = e.currentTarget.dataset.url;
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
  },
})