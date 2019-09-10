// pages/center/impress/impress.js
const app = getApp()
Page({
  data: {
    list: [],
    showload: false,
    noMore: false
  },
  onLoad: function (options) {
    // this.getlist()
  },
  onShow: function () {
    this.getlist()
  },
  getlist() {
    let postData = {
      sessionrd: wx.getStorageSync('session3rd'),
      uid: app.globalData.userInfo.uid
    }
    if (this.data.showload || this.data.moredata) return false
    this.setData({ showload: true })
    app.fn.ajax('POST', postData, app.api.user.impressList, res => {
      this.setData({ showload: false })
      if (!res.data || res.data.length == 0) {
        this.setData({ noMore: true })
        return false
      }
      res.data.map((item, index) => {
        item.multiple = Math.floor(index / 3)
      })
      this.setData({ list: res.data || [] })
      this.setData({ showload: false })
    })
  },
  scroll (e) {
    console.log(e.detail.scrollLeft)
  }
})