// pages/center/infomation/field/field.js
const app = getApp()
Page({
  data: {
    list: [],
    selectList: []
  },
  onLoad: function (options) {
    // console.log(options.value)
    this.setData({ selectList: options.value == 'null' ? [] : options.value.split(',') })
    this.getlist()
  },
  getlist () {
    app.fn.ajax('POST', { sessionrd: wx.getStorageSync('session3rd')}, app.api.user.labelList, res => {
      // console.log(res.data)
      this.setData({ list: res.data })
      this.signTarget()
    })
  },
  select (e) {
    let options = e.currentTarget.dataset
    // console.log(options)
    let arr = this.data.selectList
    if (arr.indexOf(options.name) > -1) {
      let index = arr.indexOf(options.name)
      console.log(index)
      arr.splice(index, 1)
    } else {
      arr.push(options.name)
    }
    this.setData({ selectList: arr })
    this.signTarget()
  },
  signTarget () {
    let arr = JSON.parse(JSON.stringify(this.data.list))
    arr.map((item, index) => {
      item.child.map((obj, _index) => {
        obj.active = false
        this.data.selectList.map((target, order) => {
          // console.log(obj.title, target)
          if (obj.title == target) {
            obj.active = true
            console.log(obj)
          }
        })
      })
    })
    this.setData({ list: arr })
    console.log(this.data.list)
  },
  confirm () {
    let postData = {
      sessionrd: wx.getStorageSync('session3rd'),
      tagname: this.data.selectList.join(',')
    }
    app.fn.ajax('POST', postData, app.api.user.addLabel, res => {
      // console.log(res)
      app.fn.ajax('POST', { sessionrd: wx.getStorageSync('session3rd') }, app.api.user.info, response => {
        // console.log(response)
        app.globalData.userInfo = response.data
        wx.navigateBack()
      })
    })
  }
})