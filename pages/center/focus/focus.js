// pages/center/focus/focus.js
const app = getApp()
Page({
  data: {
    list: [],
    showload: false,
    listType: 1,
    moredata: false,
    noMore: false,
    page: 1
  },
  onLoad: function (options) {
    let title = ''
    options.type == 1 ? title = '关注' : title = '粉丝'
    this.setData({ listType: options.type})
    wx.setNavigationBarTitle({ title })
  },
  onShow: function () {
    this.getlist()
  },
  // 取消关注
  unFocus (e) {
    let index = e.currentTarget.dataset.index
    let postData = {
      sessionrd: wx.getStorageSync('session3rd'),
      uid: this.data.list[index].uid
    }
    let arr = JSON.parse(JSON.stringify(this.data.list))
    arr.splice(index, 1)
    app.fn.ajax('POST', postData, app.api.user.unfocus, res => {
      this.setData({ list: arr })
      app.fn.ajax('POST', { sessionrd: wx.getStorageSync('session3rd') }, app.api.user.info, response => {
        // console.log(response)
        app.globalData.userInfo = response.data
      })
      if (this.data.list.length == 0) { this.setData({ noMore:  true}) }
    })
  },
  // 关注
  focus (e) {
    let index = e.currentTarget.dataset.index
    let postData = {
      sessionrd: wx.getStorageSync('session3rd'),
      uid: this.data.list[index].uid
    }
    let arr = JSON.parse(JSON.stringify(this.data.list))
    arr[index].following = 1
    app.fn.ajax('POST', postData, app.api.user.focus, res => {
      this.setData({ list: arr })
    })
  },
  // 获取列表数据
  getlist() {
    let postData = {
      sessionrd: wx.getStorageSync('session3rd'),
      page: this.data.page,
      pagenum: 10
    }
    let api
    if (this.data.listType == 1) {
      api = app.api.user.followList
    } else {
      api = app.api.user.fansList
    }
    // console.log(this.data.moredata)
    if (this.data.showload || this.data.moredata) return false
    this.setData({ showload: true })
    app.fn.ajax('POST', postData, api, res => {
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
      this.setData({ showload: false })
    })
  }
})