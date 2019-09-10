const app = getApp()
Page({
  data: {
    showload: false,
    list: [],
    activeIndex: '',
    showInputBar: false,
    inputValue: '',
    inputType: 1, // 1 回复该动态 2 回复别人的评论
    reply_name: '', // inputType == 2
    toFeedId: 0,
    toUserId: 0,
    placeholderStr: '写评论',
    userInfo: null,
    page: 1,
    noMore: false,
    moredata: false
  },
  onLoad: function (options) {
    this.setData({ userInfo: app.globalData.userInfo })
    this.getlist()
  },
  onShow: function () {
    if (wx.getStorageSync('update')) {
      this.setData({
        showload: false,
        noMore: false,
        moredata: false,
        page: 1,
        list: [],
      }, () => {
        this.getlist()
      })
    }
  },
  // 显示隐藏点赞、评论区域
  showOperation (e) {
    // console.log(e.currentTarget.dataset.index)
    let index = e.currentTarget.dataset.index
    let list = this.data.list.slice(0)
    list.map((item, _index) => {
      if (index != _index || !item.show) {
        item.show = false
      }
    })
    list[index].show = !list[index].show
    this.setData({ list })
  },
  // 预览动态图片
  previewImg (e) {
    const self = this
    let index = e.currentTarget.dataset.index
    let order = e.currentTarget.dataset.order
    // console.log(e.currentTarget.dataset.index, e.currentTarget.dataset.order)
    // console.log(self.data.list[index].attach[order].attach_url)
    let arr = []
    self.data.list[index].attach.map((item, index) => {
      arr.push(item.attach_url)
    })
    wx.previewImage({
      current: self.data.list[index].attach[order].attach_url,
      urls: arr
    })
  },
  // 获取动态列表
  getlist() {
    let postData = {
      sessionrd: wx.getStorageSync('session3rd'),
      uid: this.data.userInfo.uid,
      page: this.data.page,
      pagenum: 10
    }
    // console.log(this.data.moredata)
    if (this.data.showload || this.data.moredata) return false
    this.setData({ showload: true })
    app.fn.ajax('POST', postData, app.api.user.dynamicList, res => {
      // console.log(res)
      if (wx.getStorageSync('update')) {
        wx.removeStorageSync('update')
      }
      if (res.data.data.length == 0) {
        this.setData({ noMore: true })
      }
      if (res.data.data.length > 0 && this.data.page <= res.data.totalPages) {
        res.data.data.map((item, index) => { item.show = false })
        this.setData({ list: this.data.list.concat(res.data.data) })
        this.data.page++
      }
      if (this.data.page > res.data.totalPages) {
        this.setData({ moredata: true })
      }
      this.setData({ showload: false })
    })
  },
  // input输入
  inputPrint (e) {
    // console.log(e.detail.value)
    this.setData({ inputValue: e.detail.value})
  },
  // input key.13
  inputConfirm () {
    let arr = JSON.parse(JSON.stringify(this.data.list))
    let content = this.data.inputValue
    let index = this.data.activeIndex
    if (content == '') return false
    let data = {
      // type: this.data.inputType,
      user_info: {
        uname: this.data.userInfo.uname,
      },
      touser_info: {},
      content: content
    }
    if (this.data.inputType == 2) {
      data.touser_info.uname = this.data.reply_name
    }
    // console.log(content, index)
    console.log(data)
    arr[index].comment.push(data)
    app.fn.ajax('POST', {
      sessionrd: wx.getStorageSync('session3rd'),
      feed_id: this.data.list[this.data.activeIndex].feed_id,
      content: this.data.inputValue,
      to_comment_id: this.data.inputType == 2 ? this.data.toFeedId : '0',
      to_uid: this.data.inputType == 2 ? this.data.toUserId : '0'
    }, app.api.dynamic.addComment, res => {
      this.setData({
        list: arr,
        inputValue: '',
        reply_name: '',
        toFeedId: '0',
        toUserId: '0',
        placeholderStr: '写评论'
      })
    })
    // console.log(arr, this.data.list)
  },
  // input blur
  inputBlur () {
    let list = this.data.list.slice(0)
    list.map((item, index) => { item.show = false })
    this.setData({
      showInputBar: false,
      list: list
    })
  },
  // 阻止冒泡
  stopPropagation () {
    // todo
  },
  // 点赞
  support (e) {
    let arr = JSON.parse(JSON.stringify(this.data.list))
    let url = this.data.userInfo.avatar_middle
    let index = e.currentTarget.dataset.index
    // 需要做组件继续点赞、取消点赞
    // arr[index].support_list.push({ imgUrl: url })
    console.log(arr[index])
    let postData = {
      sessionrd: wx.getStorageSync('session3rd'),
      feed_id: arr[index].feed_id
    }
    let api = app.api.dynamic.support
    if (arr[index].is_digg) {
      api = app.api.dynamic.opposition
      arr[index].is_digg = 0
      // let delIndex
      // arr[index].diggs
      arr.map((item, index) => {
        item.diggs.map((obj, _index) => {
          if (obj.user.uid == this.data.userInfo.uid) {
            arr[index].diggs.splice(_index, 1)
          }
        })
      })
    } else {
      arr[index].is_digg = 1
      arr[index].diggs.push({ user: { avatar_middle: url, uid: this.data.userInfo.uid } })
    }
    arr[index].show = false
    this.setData({ list: arr })
    app.fn.ajax('POST', postData, api, res => {})
  },
  // 评论
  comment (e) {
    // console.log(e.currentTarget.dataset.index)
    let options = e.currentTarget.dataset
    let arr = JSON.parse(JSON.stringify(this.data.list))
    arr[options.index].show = false
    if (options.name == this.data.userInfo.uname) {
      wx.showModal({
        title: '提示',
        content: '不能评论自己的评论',
        showCancel: false
      })
      return false
    }
    this.setData({
      activeIndex: options.index,
      showInputBar: true,
      reply_name: options.name || '',
      inputType: options.types,
      placeholderStr: !options.name ? '写评论' : '回复' + options.name + ':',
      toFeedId: options.feedid || '0',
      toUserId: options.touid || '0',
      list: arr
    })
  }
})