// pages/search/search.js
const app = getApp()
Page({
  data: {
    loglist: [],
    list: [],
    inputValue: '',
    showload: false,
    isAddLog: true
  },
  onLoad: function (options) {
    
  },
  onShow: function () {
    if (wx.getStorageSync('searchLog')) {
      this.setData({ loglist: JSON.parse(wx.getStorageSync('searchLog'))})
    }
  },
  clear () {
    this.setData({ list: [], inputValue: '' })
  },
  clearLog () {
    this.setData({ loglist: [] })
    wx.removeStorageSync('searchLog')
  },
  inputPrint (e) {
    // console.log(e.detail.value)
    this.setData({ inputValue: e.detail.value })
  },
  soonQuery (e) {
    let index = e.currentTarget.dataset.index
    this.setData({ inputValue: this.data.loglist[index], isAddLog: false })
    this.query()
  },
  query () {
    let arr = JSON.parse(JSON.stringify(this.data.loglist))
    let keyText = this.data.inputValue
    if (!keyText) {
      this.setData({ list: [] })
      return false
    }
    if (arr.indexOf(keyText) > -1) {
      this.setData({ isAddLog: false })
    }
    if (this.data.isAddLog) {
      arr.push(keyText)
      this.setData({ loglist: arr })
    }
    wx.setStorageSync('searchLog', JSON.stringify(this.data.loglist))
    if (this.data.showload) return false
    this.setData({ showload: true })
    app.fn.ajax('POST', { key: keyText }, app.api.classes.list, res => {
      this.setData({
        list: res.data,
        showload: false,
        isAddLog: true
      })
    })
  },
  goClassDetail (e) {
    let index = e.currentTarget.dataset.index
    // console.log(index)
    wx.navigateTo({
      url: '/pages/classDetail/classDetail?info=' + JSON.stringify(this.data.list[index])
    })
  }
})