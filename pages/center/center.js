// pages/center/center.js
const app = getApp()
Page({
  data: {
    userInfo: null,
    cardH: 0
  },
  onLoad: function (options) {
    
  },
  onShow: function () {
    if (app.isReg) {
      console.log(app.globalData.userInfo)
      console.log(app.globalData.userInfo.avatar_middle)
      this.setData({ userInfo: app.globalData.userInfo }, res => { this.getCardH() })
    } else {
      app.getUserInfo()
      app.callback = res => {
        this.setData({ userInfo: res.data }, res => { this.getCardH() })
      }
    }
  },
  getCardH () {
    const self = this
    const query = wx.createSelectorQuery()
    query.select('#card').boundingClientRect((res) => {
      self.setData({ cardH: res.height })
    }).exec()
  },
  // 签到
  sign () {
    let info = JSON.parse(JSON.stringify(this.data.userInfo))
    if (info.ischeck) return false
    info.ischeck = 1
    this.setData({ userInfo: info })
    app.globalData.userInfo.ischeck = 1
    app.fn.ajax('POST', { sessionrd: wx.getStorageSync('session3rd') }, app.api.user.sign, res => {})
  },
  goModify () {
    wx.navigateTo({ url: './infomation/infomation'})
  }
})