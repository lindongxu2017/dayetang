// pages/classDetail/memberDetail/dynamicList/dynamicList.js
const app = getApp()
Page({
  data: {
    showload: false,
    list: [],
    userID: '',
    noMore: false,
    moredata: false,
    page: 1
  },
  onLoad: function (options) {
    this.setData({userID: options.id})
    this.getlist()
  },
  getlist() {
    if (this.data.showload || this.data.moredata) return false
    this.setData({ showload: true })
    app.fn.ajax('POST', { uid: this.data.userID }, app.api.user.dynamicList, res => {
      if (res.data.data.length == 0) {
        this.setData({ noMore: true })
      }
      if (res.data.data.length > 0 && this.data.page <= res.data.totalPages) {
        this.setData({ list: this.data.list.concat(res.data.data) })
        this.data.page++
      }
      if (this.data.page > res.data.totalPages) {
        this.setData({ moredata: true })
      }
      this.setData({ showload: false })
    })
  }
})