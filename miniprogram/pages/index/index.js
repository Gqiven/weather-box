//index.js
const app = getApp()

Page({
  data: {
    clickbtn: false
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    //授权弹窗
    var _this = this;
    wx.getSetting({
      success (res){
        console.log(20, res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              console.log(res.userInfo)
              //获取用户信息后先尝试更新用户信息
              _this.updateHandler(res.userInfo);
            }
          })
        }else {
          _this.setData({clickbtn: true});
        }
      }
    })
  },
  bindGetUserInfo (e) {
    this.updateHandler(e.detail.userInfo);
  },
  updateHandler: function(data) {
    data = {
      db_name: 'weatherUser',
      value: data
    }
    wx.cloud.callFunction({
      name: 'w_update_user',
      data: data,
      complete: res => {
        console.log(65, res)
        if(res.result.stats.updated > 0) {
          console.log('update success')
          wx.redirectTo({
            // url: '/pages/changeCity/index'
            url: '/pages/homepage/index'
          })
        }else {
          console.log('update fail')
          //未查找到可更新的数据 就增加数据
          this.addHandler(data)
        }
      }
    })
  },
  addHandler: function(data) {
    data = {
      db_name: 'weatherUser',
      value: data
    }
    wx.cloud.callFunction({
      name: 'w_add_user',
      data: data,
      complete: res => {
        console.log('add-77', res)
        wx.redirectTo({
          // url: '/pages/changeCity/index'
          url: '/pages/homepage/index'
        })
        // if(res.result.stats.updated > 0) {
        //   console.log('update success')
        //   // this.getData()
        // }else {
        //   console.log('update fail')
        //   //未查找到可更新的数据 就增加数据
        //   this.addHandler(data)
        // }
      }
    })
  }
})
