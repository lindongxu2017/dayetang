// pages/register/register.js
const app = getApp()
Page({
  data: {
    username: '',
    phone: '',
    province_name: '',
    city_name: '',
    arealist: [],
    area_name: '',
    class_name: '',
    class_type_id: '',
    province_list: [],
    city_list: [],
    area_list: [],
    array: [],
    register_info: {
        sessionrd: '', // 登录凭证
        pid: '', // 上级id(没有可以不传或传0)
        phone: '', // 电话号码
        province: '', // 省份id
        city: '', // 市id
        area: '', // 区域id
        arealist: [],
        location: '', // 地区字符串 例: 广东省惠州市惠城区
        cid: '' // 班级id
    }
  },
  onLoad: function (options) {
    this.setData({ 'register_info.sessionrd': wx.getStorageSync('session3rd') })
    this.getClassArea()
    wx.setStorageSync('unRegister', 1)
    // this.getClasses()
    // this.getProvince()
  },
  getClassArea () {
    app.fn.ajax('POST', {}, app.api.classes.types, res => {
      // console.log(this.data.array)
      this.setData({ arealist: res.data })
    })
  },
  getClasses () {
    app.fn.ajax('POST', { cateid: this.data.class_type_id }, app.api.classes.list, res => {
      // console.log(this.data.array)
      this.setData({array: res.data})
    })
  },
  // input 输入
  inputPrint (e) {
    // console.log(e)
    this.setData({ [e.currentTarget.dataset.name]: e.detail.value })
  },
  // 选地区
  bindRegionChange (e) {
    // console.log(e.detail.value)
    let value = e.detail.value
    this.setData({ area: value[0] + ' ' + value[1] + ' ' + value[2]})
  },
  // 获取省份列表
  getProvince () {
    app.fn.ajax('POST', { area_id: 0}, app.api.wx.area, res => {
      // console.log(res.data)
      this.setData({ province_list: res.data })
    })
  },
  // 获取城市列表
  getCity () {
    app.fn.ajax('POST', { area_id: this.data.register_info.province }, app.api.wx.area, res => {
      // console.log(res.data)
      this.setData({ city_list: res.data })
    })
  },
  // 获取区域列表
  getArea () {
    app.fn.ajax('POST', { area_id: this.data.register_info.city }, app.api.wx.area, res => {
      // console.log(res.data)
      this.setData({ area_list: res.data })
    })
  },
  // 选择确认省份
  selectProvince (e) {
    let value = e.detail.value
    this.setData({
      province_name: this.data.province_list[value].title,
      'register_info.province': this.data.province_list[value].area_id
    })
    this.getCity()
  },
  // 选择确认城市
  selectCity(e) {
    let value = e.detail.value
    this.setData({
      city_name: this.data.city_list[value].cate_name
    })
    this.getArea()
  },
  // 选择确认区域
  selectArea (e) {
    console.log(e)
    let value = e.detail.value
    this.setData({
      area_name: this.data.arealist[value].cate_name,
      class_type_id: this.data.arealist[value].id
    })
    this.getClasses()
  },
  // 选班级
  bindPickerChange (e) {
    this.setData({
      class_name: this.data.array[e.detail.value].class_name,
      'register_info.cid': this.data.array[e.detail.value].id
    })
  },
  submit () {
    this.data.register_info.phone = this.data.phone
    this.data.register_info.username = this.data.username
    this.data.register_info.location = this.data.province_name + this.data.city_name + this.data.area_name 
    app.fn.ajax('POST', this.data.register_info, app.api.user.register, res => {
      // console.log(res.data)
      wx.removeStorageSync('unRegister')
      app.getUserInfo()
    })
  }
})