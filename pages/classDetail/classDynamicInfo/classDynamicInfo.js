// pages/classDetail/classDynamicInfo/classDynamicInfo.js
const app = getApp()
const WxParse = require('../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    info: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ id:options.id })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getClassInfo()
  },
  getClassInfo () {
    const self = this
    app.fn.ajax('POST', {id: this.data.id}, app.api.classes.styleDetail, res => {
      // console.log(res)
      this.setData({ info: res.data })
      WxParse.wxParse('article', 'html', res.data.content, self, 5);
    })
  }
})