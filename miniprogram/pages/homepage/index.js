//index.js
const app = getApp()
let globalData = getApp().globalData;
//获取地区代码
const iconData = require('../../data/iconData.js')

Page({
  data: {
    liveData: null,
    forecastsData: null,
    province: '',
    city: '',
    district: '',
    iconData: iconData,
    //swiper
    indicatorDots: false,
    currentIndex: 0,//当前active index
    adcode: '',//查询地区代码,
  },
  onLoad: function() {
    var _this = this;
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        _this.getCityCode(`${longitude},${latitude}`);
      }
    })
  },
  onShow: function() {
    if(this.data.adcode) {
      this.getWeatherData(this.data.adcode)
    }
  },
  getCityCode(location) {
    wx.request({
      url: `https://restapi.amap.com/v3/geocode/regeo?location=${location}&key=${globalData.restapiKey}&radius=1000&extensions=all`,
      success: (res) => {
        let address = res.data.regeocode.addressComponent;
        if(address.city.length > 0) {//省市县
          this.setData({
            province: address.province,
            city: address.city
          })
        }else {//直辖市
          this.setData({
            province: address.province,
            district: address.district
          })
        }
        this.getWeatherData(address.adcode);
      },
      fail: () => {
        wx.showToast({
          title: '查询失败',
          icon: 'none',
        })
      }
    })
  },
  getWeatherData (code) {
    //实时天气
    wx.request({
      url: `https://restapi.amap.com/v3/weather/weatherInfo`,
      data: {
        key: globalData.restapiKey,
        city: code,
        extensions: 'base'
      },
      success: (res) => {
        this.setData({
          liveData: res.data.lives[0]
        })
      },
      fail: () => {
        wx.showToast({
          title: '查询失败',
          icon: 'none',
        })
      },
    })
    //未来三天天气
    wx.request({
      url: `https://restapi.amap.com/v3/weather/weatherInfo`,
      data: {
        key: 'cfdcbc35231a434dba9d8dbcb1c181c3',
        city: code,
        extensions: 'all',//base all
      },
      success: (res) => {
        this.setData({
          forecastsData: res.data.forecasts[0].casts
        })
        this.drawCanvas();
      },
      fail: () => {
        wx.showToast({
          title: '查询失败',
          icon: 'none',
        })
      },
    })
  },
  swiperChange(e) {
    this.setData({
      currentIndex: e.detail.current
    })
  },
  drawCanvas() {
    let {baseline, dateList, daytempList, nighttempList} = this.formatData(this.data.forecastsData);
    console.log(baseline, daytempList, nighttempList)
    // 使用wx.createContext 获取绘图上下文 context
    var context = wx.createCanvasContext('firstCanvas');
    // 坐标原点是左上角，画布大小(300, 200)
    
    // 转换坐标原点
    context.translate(10, 100);
    context.beginPath();
    // 绘制日期坐标点
    context.setFillStyle('#333');
    context.setFontSize(10);
    context.fillText(dateList[0], 30, 80);
    context.fillText(dateList[1], 100, 80);
    context.fillText(dateList[2], 170, 80);
    context.fillText(dateList[3], 240, 80);
    // 绘制图例
    context.setFillStyle('#fdcb6e');
    context.fillText("日间气温 ——", 0, -80);
    context.closePath();
    context.beginPath();
    context.setFillStyle('#2d3436');
    context.fillText("夜间气温 ——", 0, -60);
    context.closePath();

    // 绘制日间天气折线图
    context.beginPath();
    context.setStrokeStyle("#fdcb6e");
    context.moveTo(40, -(daytempList[0] - baseline) * 10);
    context.lineTo(110, -(daytempList[1] - baseline) * 10);
    context.lineTo(180, -(daytempList[2] - baseline) * 10);
    context.lineTo(250, -(daytempList[3] - baseline) * 10);
    context.stroke();
    context.closePath();

    // 绘制夜间天气折线图
    context.beginPath();
    context.setStrokeStyle("#2d3436");
    context.moveTo(40, -(nighttempList[1] - baseline) * 10);
    context.lineTo(110, -(nighttempList[1] - baseline) * 10);
    context.lineTo(180, -(nighttempList[2] - baseline) * 10);
    context.lineTo(250, -(nighttempList[3] - baseline) * 10);
    context.stroke();

    context.draw()
  },
  formatData(data) {
    //日期列表 日间气温 夜间气温
    let dateList = [], daytempList = [], nighttempList = [];
    data.forEach(item => {
      dateList.push(item.date.split('-').slice(1).join('-'));//保留MM-DD
      daytempList.push(item.daytemp);
      nighttempList.push(item.nighttemp);
    })
    let mix = daytempList.concat(nighttempList);
    
    let max = Math.max.apply(null, mix);
    let min = Math.min.apply(null, mix);
    let baseline = (max + min) / 2;
    return {
      baseline: baseline,// canvas 气温的基准
      dateList: dateList,
      daytempList: daytempList,
      nighttempList: nighttempList
    }
  },
  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg)
  },
})

