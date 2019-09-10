// pages/classDetail/memberDetail/dynamicList/detail/detail.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    comment_list: [],
    showload: false,
    moredata: false,
    page: 1,
    id: '',
    detailInfo: null,
    isSupport: false,
    inputType: 1, // 1 评论该条动态 2 评论别人的评论 3 评论别人的回复
    inputValue: '',
    inputFocus: false,
    activeIndex: '',
    reply_name: '',
    feedID: 0,
    touid: 0,
    placeholderStr: '写评论',
    userInfo: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.setData({
      id: options.id,
      userInfo: app.globalData.userInfo
    })
    this.getDetail()
    this.getComment()
    console.log(this.data.userInfo)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  // 获取详情
  getDetail () {
    app.fn.ajax('POST', {
      feed_id: this.data.id,
      sessionrd: wx.getStorageSync('session3rd')
    }, app.api.dynamic.detail, res => {
      // console.log(res.data)
      this.setData({
        detailInfo: res.data,
        isSupport: res.data.is_digg
      })
    })
  },
  // 获取评论列表
  getComment () {
    let postData = {
      feed_id: this.data.id,
      page: this.data.page,
      pagenum: 10
    }
    if (this.data.showload || this.data.moredata) return false
    app.fn.ajax('POST', postData, app.api.dynamic.commentList, res => {
      // console.log(res.data)
      if (res.data.data.length > 0 && this.data.page <= res.data.totalPages) {
        this.setData({ comment_list: this.data.comment_list.concat(res.data.data) })
        this.data.page++
      }
      if (this.data.page > res.data.totalPages) {
        this.setData({ moredata: true })
      }
      this.setData({ showload: false })
    })
  },
  // 点赞
  support () {
    let api = app.api.dynamic.support
    if (this.data.detailInfo.is_digg) {
      api = app.api.dynamic.opposition
    }
    app.fn.ajax('POST', { sessionrd: wx.getStorageSync('session3rd'), feed_id: this.data.id }, api, res => {
      this.data.detailInfo.is_digg = !this.data.detailInfo.is_digg
      this.setData({ isSupport: this.data.detailInfo.is_digg })
    })
  },
  // comment 评论
  comment (e) {
    if (!this.data.userInfo) {
      wx.showModal({
        title: '提示',
        content: '未注册',
        showCancel: false,
        success: function () {
          wx.navigateTo({
            url: '/pages/register/register'
          })
        }
      })
    }
    let options = e.currentTarget.dataset
    console.log(options)
    if (options.touid == this.data.userInfo.uid) {
      wx.showModal({
        title: '提示',
        content: '不能评论自己的留言！',
        showCancel: false
      })
      return false
    }
    this.setData({
      inputType: options.type,
      activeIndex: options.index,
      feedID: options.tocommentid,
      touid: options.touid,
      inputFocus: true
    })
    if (options.type != 1) {
      this.setData({
        reply_name: options.toname,
        placeholderStr: '回复：' + options.toname
      })
    }
  },
  // input 输入
  inputPrint (e) {
    this.setData({ inputValue: e.detail.value })
  },
  // input key.13
  inputConfirm () {
    if (this.data.inputValue == '') {
      this.reset()
      return false
    }
    // console.log()
    // 添加到comment_list的数据
    let pushData = {
      uid: this.data.userInfo.uid,
      user_info: {
        uid: this.data.userInfo.uid,
        uname: this.data.userInfo.uname,
        avatar_middle: this.data.userInfo.avatar_middle
      },
      content: this.data.inputValue,
      ctime: app.fn.getCurrentTime()
    }
    // 添加到reply_list
    let replyData = null
    let postData = {
      sessionrd: wx.getStorageSync('session3rd'),
      feed_id: this.data.id,
      content: this.data.inputValue
    }
    if (this.data.inputType != 1) {
      postData.to_uid = this.data.touid
      postData.to_comment_id = this.data.feedID
      // 添加到reply_list
      replyData = {
        uid: this.data.userInfo.uid,
        user_info: {
          uid: this.data.userInfo.uid,
          uname: this.data.userInfo.uname,
          avatar_middle: this.data.userInfo.avatar_middle
        },
        to_comment_id: this.data.feedID,
        to_uid: this.data.touid,
        touser_info: false,
        content: this.data.inputValue
      }
      if (this.data.inputType == 3) {
        replyData.touser_info = {
          uname: this.data.reply_name
        }
      }
    }
    app.fn.ajax('POST', postData, app.api.dynamic.addComment, res => {
      let jsonObj = JSON.parse(JSON.stringify(this.data.comment_list))
      console.log(this.data.activeIndex)
      if (this.data.inputType == 1) {
        jsonObj.unshift(pushData)
      } else {
        jsonObj[this.data.activeIndex].replylist.push(replyData)
      }
      this.setData({ comment_list: jsonObj })
      // if (this.data.inputType == 1) {
      //   滚动到底部
      // }
      this.reset()
      // console.log(this.data.comment_list)
    })
  },
  reset () {
    this.setData({
      inputType: 1, // 1 评论该条动态 2 评论别人的评论 3 评论别人的回复
      inputValue: '',
      inputFocus: false,
      reply_name: '',
      placeholderStr: '写评论',
      activeIndex: '',
      feedID: 0,
      touid: 0,
    })
  },
  // 预览图片
  preViewImg (e) {
    let imgArr = JSON.parse(JSON.stringify(this.data.detailInfo.attachInfo))
    let imgUrl = []
    imgArr.map((item, index) => {
      imgUrl.push(item.attach_url)
    })
    wx.previewImage({
      current: imgUrl[e.currentTarget.dataset.index],
      urls: imgUrl
    })
  }
})