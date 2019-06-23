//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'data-4398cf',//云数据库的id
        traceUser: true
      })
    }

    this.globalData = {
      restapiKey: 'xxx'//从高德地图API获取的key
    }
  }
})
