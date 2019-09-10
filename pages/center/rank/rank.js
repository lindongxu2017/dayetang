const app = getApp()
Page({
  data: {
    list: [],
    page: 1,
    noMore: false,
    moredata: false,
    showload: false,
    first: true
  },
  onLoad: function (options) {
    this.getlist()
  },
  getlist() {
    let postData = {
      sessionrd: wx.getStorageSync('session3rd'),
      page: this.data.page,
      pagenum: 10
    }
    if (this.data.showload || this.data.moredata) return false
    this.setData({ showload: true })
    app.fn.ajax('POST', postData, app.api.user.rankList, res => {
      // console.log(res)
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
      this.setData({ showload: false, first:false })
    })
  }
})