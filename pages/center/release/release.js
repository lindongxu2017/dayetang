// pages/center/release/release.js
const app = getApp()
Page({
  data: {
    textareaValue: '',
    previewImage: [],
    imgID: [],
    uploadList: [],
    typeArray: [{ id: 1, type_name: '最新动态' }, { id: 2, type_name: '会员动态' }, { id: 3, type_name: '老P动态'}],
    typeTextValue:'',
    typeIdValue: ''
  },
  onLoad: function (options) {
  
  },
  onShow: function () {
  
  },
  inputPrint (e) {
    this.setData({ textareaValue: e.detail.value })
  },
  uploadImg () {
    const self = this
    wx.chooseImage({
      count: 9,  //最多可以选择的图片总数  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        // console.log(tempFilePaths)
        self.setData({ previewImage: self.data.previewImage.concat(tempFilePaths) })
        console.log(tempFilePaths)
        self.upload(tempFilePaths)
      }
    })
  },
  upload (arr) {
    console.log(arr, 111)
    var newArr = arr
    var self = this
    wx.uploadFile({
      url: 'https://dayetang.qht17.com' + app.api.wx.upload,
      filePath: newArr[0],
      name: 'attach',
      header: { "Content-Type": "multipart/form-data" },
      success: function (response) {
        var imgArr = []
        imgArr = imgArr.concat(newArr)
        imgArr.splice(0, 1)
        if (imgArr.length > 0) {
          self.upload(imgArr)
        }
        var data = JSON.parse(response.data)
        var arr = self.data.imgID
        arr.push(data.data.attach_id)
        self.setData({ imgID: arr })
      }
    })
  },
  // 选择类型
  bindPickerChange (e) {
    // console.log(e.detail.value)
    this.setData({
      typeTextValue: this.data.typeArray[e.detail.value].type_name,
      typeIdValue: this.data.typeArray[e.detail.value].id
    })
  },
  // 预览图片
  previewImg (e) {
    // console.log(e.currentTarget.dataset.index)
    const self = this
    let currentURL = self.data.previewImage[e.currentTarget.dataset.index]
    console.log(currentURL)
    wx.previewImage({
      current: currentURL,
      urls: self.data.previewImage
    })
  },
  // 删除图片
  deleteImg (e) {
    let index = e.currentTarget.dataset.index
    console.log(index)
    let imgArr = this.data.previewImage.slice(0)
    let imgID = this.data.imgID.slice(0)
    imgArr.splice(index, 1)
    imgID.splice(index, 1)
    this.setData({ previewImage: imgArr, imgID})
  },
  // 提交
  submit () {
    let postData = {
      sessionrd: wx.getStorageSync('session3rd'),
      typeid: this.data.typeIdValue,
      body: this.data.textareaValue,
      attach_id: this.data.imgID.join(',')
    }
    app.fn.ajax('POST', postData, app.api.dynamic.release, res => {
      console.log(res)
      wx.showToast({
        title: '成功',
        icon: 'success'
      })
      setTimeout(() => {
        wx.setStorageSync('update', 1)
        wx.navigateBack()
      }, 1500)
    })
  }
})