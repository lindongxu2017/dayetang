// pages/mailList/mailList.js
const app = getApp()
Page({
    data: {
        showload: false,
        moredata: false,
        noMore: false,
        page: 1,
        list: [],
        arealist: [],
        areaName: '所有区域',
        cate_id: 0,
        inputValue: ''
    },
    onLoad: function(options) {
        this.getClassArea()
    },
    onShow: function() {
        this.getlist()
    },
    inputPrint(e) {
        // console.log(e.detail.value)
        this.setData({
            inputValue: e.detail.value
        })
    },
    clear() {
        this.setData({
            inputValue: ''
        })
    },
    query () {
        this.setData({
            showload: false,
            moredata: false,
            noMore: false,
            page: 1,
            list: []
        })
        this.getlist()
    },
    // screen 附近的人
    screen() {
        this.setData({
            showload: false,
            moredata: false,
            list: [],
            page: 1
        })
        this.getlist()
    },
    // 获取地区
    getClassArea() {
        app.fn.ajax('POST', {}, app.api.classes.types, res => {
            // console.log(this.data.array)
            res.data.unshift({
                id: 0,
                cate_name: '所有区域'
            })
            this.setData({
                arealist: res.data
            })
        })
    },
    // 地区改变
    bindPickerChange(e) {
        // console.log(e.detail)
        this.setData({
            showload: false,
            moredata: false,
            list: [],
            index: e.detail.value,
            cate_id: this.data.arealist[e.detail.value].id,
            areaName: this.data.arealist[e.detail.value].cate_name,
            page: 1
        })
        this.getlist()
    },
    getlist() {
        let postData = {
            sessionrd: wx.getStorageSync('session3rd'),
            page: this.data.page,
            pagenum: 10,
            uname: this.data.inputValue
        }
        let api = app.api.user.mailList
        if (this.data.showload || this.data.moredata) return false
        this.setData({
            showload: true
        })
        app.fn.ajax('POST', postData, api, res => {
            // console.log(res)
            if (res.data.data.length == 0) {
                this.setData({
                    noMore: true
                })
            }
            if (res.data.data.length > 0 && this.data.page <= res.data.totalPages) {
                this.setData({
                    list: this.data.list.concat(res.data.data)
                })
                this.data.page++
            }
            if (this.data.page > res.data.totalPages) {
                this.setData({
                    moredata: true
                })
            }
            this.setData({
                showload: false
            })
        })
    }
})