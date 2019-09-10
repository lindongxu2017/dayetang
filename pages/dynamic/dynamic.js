// pages/dynamic/dynamic.js
const app = getApp()
Page({
    data: {
        showload: false,
        list: [],
        activeTab: 0,
        tablist: [],
        searchValue: '',
        page: 1,
        noMore: false,
        moredata: false,
        isFocus: false,
        userinfo: {}
    },
    onLoad: function(options) {
        this.getClassify()
        console.log(app.isReg)
        if (app.isReg) {
            this.setData({
                userinfo: app.globalData.userInfo
            })
        } else {
            app.getUserInfo()
            app.callback = res => {
                this.setData({
                    userInfo: res.data
                })
            }
        }
    },
    onShow() {
        // todo
    },
    del (e) {
        let {index, item} = e.currentTarget.dataset
        const self = this
        wx.showModal({
            title: '提示',
            content: '是否删除该动态？',
            success(res) {
                if (res.confirm) {
                    app.fn.ajax('POST', {   
                        feed_id: item.feed_id,
                        sessionrd: wx.getStorageSync('session3rd')
                    }, '/api.php?mod=Activate&act=delFeed', res => {
                        let arr = self.data.list.slice(0)
                        arr.splice(index, 1)
                        self.setData({
                            list: arr
                        })
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    // 输入框聚焦
    inputFocus() {
        this.setData({
            isFocus: true
        })
    },
    // 输入框失焦
    inputBlur() {
        this.setData({
            isFocus: false
        })
    },
    // search框输入
    inputPrint(e) {
        this.setData({
            searchValue: e.detail.value
        })
    },
    // search框搜索
    inputSearch() {
        this.setData({
            list: [],
            page: 1,
            showload: false,
            moredata: false,
            noMore: false
        })
        console.log(this.data.searchValue)
        this.getlist()
    },
    // 切换tab
    switchTab(e) {
        this.setData({
            list: [],
            activeTab: e.currentTarget.dataset.index,
            page: 1,
            noMore: false,
            moredata: false,
            showload: false,
            searchValue: ''
        })
        this.getlist()
    },
    getClassify() {
        app.fn.ajax('POST', {}, app.api.dynamic.classifyList, res => {
            // console.log(res)
            res.data.unshift({
                id: 0,
                type_name: '最新活动'
            })
            this.setData({
                tablist: res.data
            })
            this.getlist()
        })
    },
    getlist() {
        let postData = {
            typeid: this.data.tablist[this.data.activeTab].id,
            key: this.data.searchValue,
            page: this.data.page,
            pagenum: 10
        }
        let api = app.api.dynamic.activetyList
        if (this.data.activeTab != 0) {
            api = app.api.dynamic.list
        }
        console.log(this.data.moredata)
        if (this.data.showload || this.data.moredata) return false
        this.setData({
            showload: true
        })
        app.fn.ajax('POST', postData, api, res => {
            // console.log(res)
            if (res.data.data.length == 0 || res.data.length == 0) {
                this.setData({
                    noMore: true
                })
            }
            if (res.data.data && res.data.data.length > 0 && this.data.page <= res.data.totalPages) {
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