//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    imgUrls: [],
    list: [],
    myClassInfo: null,
    showload: false,
    isReg: false,
    noMore: false,
    index: 0, // 默认选择班级类型
    arealist: [],
    areaName: '',
    cate_id: 0
  },
  onLoad () {
    this.getbannerlist()
    // this.getlist()
    this.getClassArea()
  },
  onShow () {
    var self = this
    this.setData({ list: [] })
    if (app.isReg) {
      self.setData({ isReg: app.isReg })
      self.getMyClass()
    } else {
      app.callback = res => {
        // console.log('callback')
        self.setData({ isReg: res })
        self.getMyClass()
      }
    }
    if (this.data.cate_id != 0) {
      this.getlist()
    }
  },
  getClassArea() {
    app.fn.ajax('POST', {}, app.api.classes.types, res => {
      // console.log(this.data.array)
      this.setData({ arealist: res.data, cate_id: res.data[0].id })
      // this.setData({ areaName})
      if (wx.getStorageSync('cate_index')) {
        this.setData({
          index: wx.getStorageSync('cate_index'),
          cate_id: res.data[wx.getStorageSync('cate_index')].id
        })
      }
      this.getlist()
    })
  },
  bindPickerChange (e) {
    // console.log(e.detail)
    this.setData({ showload: false, noMore: false, list: [] })
    this.setData({ index: e.detail.value, cate_id: this.data.arealist[e.detail.value].id })
    wx.setStorageSync('cate_index', e.detail.value)
    this.getlist()
  },
  getbannerlist () {
    app.fn.ajax('POST', {}, app.api.banner.list, res => {
      this.setData({imgUrls: res.data.slide})
    })
  },
  getMyClass () {
    app.fn.ajax('POST', { sessionrd: wx.getStorageSync('session3rd')}, app.api.classes.my, res => {
      this.setData({ myClassInfo: res.data})
    })
  },
  getlist () {
    if (this.data.showload) return false
    this.setData({ showload: true })
    app.fn.ajax('POST', { cateid: this.data.cate_id }, app.api.classes.list, res => {
      if (res.data.length == 0) {
        this.setData({ noMore: true})
      }
      this.setData({
        list: this.data.list.concat(res.data),
        showload: false
      })
    })
  },
  void () {
    // todo
  },
  goClassDetail (e) {
    let index = e.currentTarget.dataset.index
    // console.log(index)
    wx.navigateTo({
      url: '/pages/classDetail/classDetail?info='+ JSON.stringify(this.data.list[index])
    })
  },
  goMyClass () {
    wx.navigateTo({
      url: '/pages/classDetail/classDetail?info=' + JSON.stringify(this.data.myClassInfo)
    })
  },
  onShareAppMessage () {
      return {
          title: '大业堂',
          path: '/pages/index/index', // 这里的 path 是页面 url，而不是小程序路由
      }
  }
})
