// pages/classDetail/memberDetail/activityList/activityList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showload: false,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getlist()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  getlist() {
    if (this.data.showload) return false
    this.setData({ showload: true })
    setTimeout(() => {
      this.setData({ list: this.data.list.concat(['', '']) })
      this.setData({ showload: false })
    }, 1500)
  }
})