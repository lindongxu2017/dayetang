// pages/classDetail/classDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTab: 0,
    list: [],
    showload: false,
    page: 1,
    info: null,
    noMore: false,
    moredata: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.setData({ info: JSON.parse(options.info) })
    wx.setNavigationBarTitle({ title: options.name || '大业堂' })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.getClassInfo() // 获取详情
    this.getlist() // 获取列表
  },
  switchTab (e) {
    this.setData({ 
      activeTab: e.currentTarget.dataset.index,
      page: 1,
      list: [],
      noMore: false,
      moredata: false,
      showload: false
    })
    this.getlist()
  },
  getlist() {
    let postData = {
      cid: this.data.info.id,
      page: this.data.page,
      pagenum: 10
    }
    let api = app.api.classes.styleList
    if (this.data.activeTab == 1) {
      api = app.api.classes.memberList
    }
    if (this.data.showload || this.data.moredata) return false
    this.setData({ showload: true })
    app.fn.ajax('POST', postData, api, res => {
      // console.log(res)
      if (res.data.data && res.data.data.length > 0 && this.data.page <= res.data.totalPages) {
        this.setData({ list: this.data.list.concat(res.data.data) })
        this.data.page++
      }
      if (res.data.length == 0 || !res.data.data || res.data.data.length == 0) {
        this.setData({ noMore: true })
      }
      if (this.data.page > res.data.totalPages) {
        this.setData({ moredata:true })
      }
      this.setData({ showload: false })
    })
  }
})