function http(params) {
  wx.showNavigationBarLoading()

  let baseUrl = 'https://api.ixook.com/'  //  接口基础

  let url = typeof params === 'string' ? baseUrl + params : baseUrl + params.url  //  如果只传一个字符串则该字符串为 URL

  let method = params.method !== undefined ? params.method : 'get'
  let data = params.data !== undefined ? params.data : null
  let header = {}


  // get参数拼接  
  if (method == "get" && data !== null) {

    for (let key in data) {
      if (data[key].toString() !== '') {
        url += "&" + key + "=" + data[key];
      }
    }

    url = url.replace('&', '?')  //  替换第一个&为？
    data = '';
  }

  //返回Promise对象  
  return new Promise((resolve, reject) => {

    wx.request({
      method: method,
      url: url,
      data: data,
      header: header,
      success: res => {
        wx.hideNavigationBarLoading()
        let statusCode = res.statusCode

        switch (statusCode) {
          case 200:
            resolve(res.data)
            break
          case 201:
            resolve(res.data)
            break
          case 204:
            resolve(res.data)
            break
          case 401:
            wx.showToast({
              title: '授权过期，请重新登录',
              icon: 'none',
              duration: 2000
            })
            wx.removeStorageSync('jwt')
            resolve(res.data)
            break

          case 403:
            resolve(res.data)
            break
          default:
            wx.showToast({
              title: '未知错误',
              icon: 'none',
              duration: 2000
            })
        }
        resolve(res);
      },
      fail: function (res) {
        wx.showToast({
          title: '请检查网络',
          icon: 'none',
          duration: 2000
        })
      },
      complete: function (res) {
        // console.log(res)
      }
    })
  }
  )
}

function starToArray(val) {
  if (val == 0) return null
  var stars = []
  for (let i = 1; i < 6; i++) {
    i <= val ? stars.push(1) : stars.push(0)
  }
  return stars
}

//  格式化时间 将秒数转为 00:00 格式
function formatTime(sec) {
  var min = 0;
  min = Math.floor(sec / 60);		//	分
  min < 10 && (min = '0' + min);	//	补零
  sec = Math.floor(sec % 60);		//	秒
  sec < 10 && (sec = '0' + sec);	//	补零

  return min + ":" + sec;
}

module.exports = {
  http: http,
  starToArray: starToArray
}