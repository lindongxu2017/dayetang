const fn = require('./utils/main.js')
const api = require('./utils/api.js')
//app.js
App({
  code: '',
  onLaunch: function () {
    // 登录
    const self = this
    wx.login({
      success: res => {
        self.code = res.code
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // 获取用户信息
        wx.getSetting({
          success: result => {
            // console.log(result, 222)
            if (result.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: response => {
                  // 可以将 res 发送给后台解码出 unionId
                  // self.globalData.userInfo = response.userInfo
                  self.wxlogin(res.code, response)
                },
                fail: error => {
                  console.log(error)
                }
              })
            } else {
              // 未授权
              wx.redirectTo({ url: '/pages/wxAuth/wxAuth' })
            }
          }
        })
      }
    })
  },

  wxlogin (code, res) {
    const self = this
    wx.request({
      url: 'https://dayetang.qht17.com' + api.wx.login,
      data: {
        code: code,
        rawData: res.rawData,
        signature: res.signature,
        encryptedData: res.encryptedData,
        iv: res.iv
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'POST',
      success: function (result) {
        // 存储session3rd
        wx.setStorageSync('session3rd', result.data.data.session3rd)
        if (result.data.code == 99997) {
          self.isReg = false
        }
        if (result.data.code == 200) {
          self.getUserInfo()
        }
      }
    })
  },
  getUserInfo () {
    fn.ajax('POST', { sessionrd: wx.getStorageSync('session3rd') }, api.user.info, response => {
      this.globalData.userInfo = response.data
      this.isReg = true
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      // console.log('getuserinfo')
      if (this.callback) {
        this.callback(response)
        this.callback = null
      }
    })
  },
  isReg: false,
  globalData: {
    userInfo: null
  },
  // api请求地址、自定义函数
  api, fn
})