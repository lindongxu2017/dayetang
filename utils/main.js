const myFn = {
  ajax: (method, data, api, fn) => {
    let self = this
    wx.request({
      url: 'https://dayetang.qht17.com' + api,
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: method,
      success: function (res) {
        // console.log(res)
        myFn.state(res, fn)
      }
    })
  },
  state (res, fn) {
    // console.log(res)
    switch (parseInt(res.data.code)) {
      // 成功
      case 200:
        fn(res.data)
        break
      // 注册成功
      case 99994:
        wx.showModal({
          title: '提示',
          content: '您的注册资料已提交，请等待审核！',
          showCancel: false,
          success: function () {
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        })
        break
      // 未注册
      case 99997:
        // wx.showModal({
        //   title: '提示',
        //   content: res.data.msg,
        //   showCancel: false,
        //   success: function () {
        //     let pageInfo = getCurrentPages()
        //     wx.redirectTo({
        //       url: '/pages/register/register',
        //     })
        //   }
        // })
        let pageInfo = getCurrentPages()
        console.log(pageInfo)
        if (pageInfo[0].route == 'pages/center/center') {
          if (wx.getStorageSync('unRegister')) {
            wx.switchTab({
              url: '/pages/index/index'
            })
            wx.removeStorageSync('unRegister')
          } else {
            wx.navigateTo({
              url: '/pages/register/register'
            })
          }
        } else {
          wx.redirectTo({
            url: '/pages/register/register'
          })
        }
        break
      default :
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: false
        })
    }
  },
  getCurrentTime () {
    let nowDate = new Date()
    let year = nowDate.getFullYear()
    let month = nowDate.getMonth() + 1
    let day = nowDate.getDate()
    let hours = nowDate.getHours()
    let minutes = nowDate.getMinutes()
    let seconds = nowDate.getSeconds()
    return year + '/' + month + '/' + day + ' ' + hours + ':' + minutes + ':' + seconds
  }
}
module.exports = myFn