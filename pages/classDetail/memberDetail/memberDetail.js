// pages/classDetail/memberDetail/memberDetail.js
const app = getApp()
Page({
  data: {
    activeTab: 0,
    showload: false,
    showload2: false,
    noMore: false,
    noData: false,
    noData2: false,
    isSupport: false,
    isFocus: false,
    userID: '',
    userInfo: null,
    dynamicList: [],
    wordList: [],
    impressList: [],
    cardH: 0 // 卡片高度
  },
  onLoad: function (options) {
    // console.log(options)
    this.setData({ userID: options.id })
    // this.getDynamicList()
  },
  onShow () {
    this.getUserInfo()
    this.getImpressList()
    this.getWordList()
  },
  switchTab (e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      activeTab: index,
      showload: false,
      noMore: false,
      noData: false,
      dynamicList: [],
      wordList: [],
      impressList: []
    })
    switch (parseInt(index)) {
      case 2:
        this.getDynamicList()
        break
      case 3:
        this.getImpressList()
        this.getWordList()
    }
  },
  // 添加印象
  goAddImpress() {
    wx.navigateTo({ url: '/pages/center/infomation/edit/edit?title=添加印象&addImpress=true&uid=' + this.data.userID})
  },
  // 添加口碑
  goAddWord () {
    wx.navigateTo({ url: '/pages/center/infomation/edit/edit?title=添加口碑&uid=' + this.data.userID })
  },
  // 获取用户信息
  getUserInfo () {
    const self = this
    app.fn.ajax('POST', { sessionrd: wx.getStorageSync('session3rd'), uid: this.data.userID }, app.api.classes.memberInfo, res => {
      // console.log(res)
      this.setData({
        userInfo: res.data,
        isSupport: res.data.is_point,
        isFocus: res.data.following
      }, () => {
        const query = wx.createSelectorQuery()
        query.select('#card').boundingClientRect((res) => {
          self.setData({ cardH: res.height})
        }).exec()
      })
    })
  },
  // 获取动态列表
  getDynamicList () {
    if (this.data.showload) return false
    this.setData({ showload: true })
    app.fn.ajax('POST', { uid: this.data.userID }, app.api.user.dynamicList, res => {
      this.setData({ showload: false })
      if (res.data.data.length == 0) {
        this.setData({ noMore: true })
        return false
      }
      this.setData({ dynamicList: res.data.data })
    })
  },
  // 获取印象列表
  getImpressList() {
    let postData = {
      sessionrd: wx.getStorageSync('session3rd'),
      uid: this.data.userID
    }
    if (this.data.showload || this.data.moredata) return false
    this.setData({ showload: true })
    app.fn.ajax('POST', postData, app.api.user.impressList, res => {
      this.setData({ showload: false })
      if (!res.data || res.data.length == 0) {
        this.setData({ noMore: true })
        return false
      }
      res.data.map((item, index) => {
        item.multiple = Math.floor(index / 3)
      })
      this.setData({ impressList: res.data || [] })
      this.setData({ showload: false })
    })
  },
  scroll(e) {
    console.log(e.detail.scrollLeft)
  },
  // 获取口碑列表
  getWordList () {
    let postData = {
      sessionrd: wx.getStorageSync('session3rd'),
      uid: this.data.userID
    }
    if (this.data.showload2) {
      return false
    }
    this.setData({ showload2: true, noData2: false })
    app.fn.ajax('POST', postData, app.api.user.wordList, res => {
      this.setData({ showload2: false })
      // console.log(!res.data, 111111)
      if (!res.data || res.data.length == 0) {
        this.setData({ noData2: true })
        return false
      }
      this.setData({ wordList: res.data || [] })
    })
  },
  // 点赞
  support () {
    let postData = {
      sessionrd: wx.getStorageSync('session3rd'),
      uid: this.data.userID
    }
    let api
    if (!this.data.isSupport) {
      api = app.api.user.addSupport
    } else {
      api = app.api.user.delSupport
    }
    app.fn.ajax('POST', postData, api, res => {
      this.setData({ isSupport: !this.data.isSupport })
    })
  },
  // 关注
  focus () {
    let postData = {
      sessionrd: wx.getStorageSync('session3rd'),
      uid: this.data.userID
    }
    let api
    if (!this.data.isFocus) {
      api = app.api.user.focus
    } else {
      api = app.api.user.unfocus
    }
    app.fn.ajax('POST', postData, api, res => {
      this.setData({ isFocus: !this.data.isFocus })
    })
  },
  // 拨号
  call () {
    // console.log(this.data.userInfo.phone)
    wx.makePhoneCall({
      phoneNumber: this.data.userInfo.phone
    })
  }
})