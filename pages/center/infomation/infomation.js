// pages/center/infomation/infomation.js
const app = getApp()
Page({
  data: {
    info: {}
  },
  onLoad: function (options) {
    console.log(222)
    this.setData({ info: app.globalData.userInfo })
  },
  onShow: function () {
    console.log(1112)
    console.log(this.data.info)
  },
  // 修改头像
  modifyAvatar () {
    const self = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        let sessionrd = wx.getStorageSync('session3rd')
        // let formData = {
        //   sessionrd: sessionrd
        // }
        // console.log(tempFilePaths, wx.getStorageSync('session3rd'))
        self.setData({ 'info.avatar_middle': tempFilePaths[0] })
        wx.uploadFile({
          url: 'https://dayetang.qht17.com' + app.api.wx.upload,
          filePath: tempFilePaths[0],
          header: { "content-type": 'multipart/form-data' },
          name: 'attach',
          // formData: formData,
          success: function (response) {
            var data = JSON.parse(response.data)
            app.fn.ajax('POST', { sessionrd: sessionrd, image: data.data.src }, app.api.user.changeAvatar, res => {
              app.globalData.userInfo.avatar_middle = data.data.src
            })
          }
        })
      }
    })
  },
  // 添加、修改其他信息
  modifyInfo (e) {
    // console.log(e.currentTarget.dataset)
    let options = e.currentTarget.dataset
    wx.navigateTo({
      url: './edit/edit?key=' + options.key + '&value=' + options.value + '&title=' + options.title
    })
  },
  // 领域
  changeField (e) {
    let options = e.currentTarget.dataset
    console.log(options)
    wx.navigateTo({
      url: './field/field?key=' + options.key + '&value=' + options.value,
    })
  }
})