var app = getApp()
Page({
	data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
	},
	onLoad(option) {
    // console.log(this.data.canIUse)
	},
  bindGetUserInfo (res) {
    // console.log(res, 1111)
    app.wxlogin(app.code, res.detail)
    if (res.detail.errMsg == 'getUserInfo:ok') {
      wx.switchTab({
        url: '../index/index',
      })
    } else {
      wx.showToast({
        title: '授权失败！',
        icon: 'none',
        duration: 2000
      })
    }
  }
})