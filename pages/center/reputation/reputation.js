// pages/center/reputation/reputation.js
const app = getApp()
Page({
  data: {
    userID: [],
    impressList: [],
    wordList: [],
    showload: false,
    showload2: false,
    noMore: false,
    noData2: false
  },
  onLoad: function (options) {
    this.setData({ userID: app.globalData.userInfo.uid })
    this.getWordList()
    this.getImpressList()
  },
  onShow: function () {
  },
  // 获取印象列表
  getImpressList() {
    let postData = {
      sessionrd: wx.getStorageSync('session3rd'),
      uid: this.data.userID
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
      this.setData({ impressList: res.data || [] })
      this.setData({ showload: false })
    })
  },
  scroll(e) {
    console.log(e.detail.scrollLeft)
  },
  // 获取口碑列表
  getWordList() {
    let postData = {
      sessionrd: wx.getStorageSync('session3rd'),
      uid: this.data.userID
    }
    if (this.data.showload2) {
      return false
    }
    this.setData({ showload2: true, noData2: false })
    app.fn.ajax('POST', postData, app.api.user.wordList, res => {
      this.setData({ showload2: false })
      // console.log(!res.data, 111111)
      if (!res.data || res.data.length == 0) {
        this.setData({ noData2: true })
        return false
      }
      this.setData({ wordList: res.data || [] })
    })
  }
})