// pages/classDetail/memberDetail/activityList/detail/detail.js
const app = getApp()
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
    // console.log(options)
    this.setData({id: options.id})
    this.getdetail()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  onShareAppMessage: function (res) {
    return {
      title: '大业堂',
      path: '/pages/classDetail/memberDetail/activityList/detail/detail?id=' + this.data.id
    }
  },
  getdetail () {
    app.fn.ajax('POST', {id: this.data.id}, app.api.dynamic.activetyDetail, res => {
      console.log(res)
      this.setData({info: res.data})
    })
  },
  onShareAppMessage () {
    return {
      title: this.data.topic_name,
      path: '/pages/classDetail/memberDetail/activityList/detail/detail?id=' + this.data.id
    }
  }
})