// pages/center/infomation/edit/edit.js
const app = getApp()
Page({
  data: {
    inputValue: '',
    options: null
  },
  onLoad: function (options) {
    // console.log(options)
    this.setData({ inputValue: options.value || '', options })
    // console.log(options)
    wx.setNavigationBarTitle({ title: options.title }) // 设置页面标题
  },
  inputPrint (e) {
    // console.log(e.detail.value)
    this.setData({ inputValue: e.detail.value})
  },
  submit () {
    if (this.data.options.uid) {
      let postData = {
        sessionrd: wx.getStorageSync('session3rd'),
        uid: this.data.options.uid,
        praise_name: this.data.inputValue
      }
      let api = app.api.user.addWord
      if (this.data.options.addImpress) {
        api = app.api.user.addImpress
        postData.impress_name = this.data.inputValue
      }
      app.fn.ajax('POST', postData, api, res => {
        wx.navigateBack()
      })
    } else {
      let postData = {
        sessionrd: wx.getStorageSync('session3rd'),
        [this.data.options.key]: this.data.inputValue
      }
      app.fn.ajax('POST', postData, app.api.user.edit, res => {
        // console.log(res)
        app.fn.ajax('POST', { sessionrd: wx.getStorageSync('session3rd') }, app.api.user.info, response => {
          // console.log(response)
          app.globalData.userInfo = response.data
          wx.navigateBack()
        })
      })
    }
  }
})