var {http, starToArray } = require('./utils/util.js')
var colors = ['#f8a52d', '#ff9902', '#a570f3', '#479eff', '#9ACD32', '#912CEE', '#EE7942']
var week = new Date().getDay()

App({
  starToArray: starToArray,
  http: http,
  setBarColor: () => {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: colors[week]
    })
  },

  onLaunch: () => {
    wx.login({
      success: res => {
        // 微信登录，后端使用该用户 openid 换取自有账号系统 token

      }
    })
  }

})

