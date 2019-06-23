let globalData = getApp().globalData;

let adCode = require('../../data/adcode.js')
let citycode = require('../../data/citycode.js')
let provincecode = require('../../data/provincecode.js')

Page({

  data: {
    province: '',
    city: '',
    district: '',
    hotCity: [
      {
        city: '北京市',
        adcode: '110000'
      },
      {
        city: '上海市',
        adcode: '310000'
      },
      {
        city: '广州市',
        adcode: '440100'
      },
      {
        city: '杭州市',
        adcode: '330100'
      },
      {
        city: '武汉市',
        adcode: '420100'
      },
      {
        city: '南京市',
        adcode: '320100'
      },
      {
        city: '深圳市',
        adcode: '440300'
      }
    ],
    searchValue: '',
    resultData: [],
    showList: false, //是否显示搜索列表
    nullMsg: ''
  },

  onLoad: function (options) {
    // console.log(9, globalData)
    // this.searchData();
  },
  updateValue(e) {
    this.setData({
      searchValue: e.detail.value
    })
  },
  clearValue(e) {
    this.setData({
      nullMsg: '',
      searchValue: ''
    })
  },
  searchData(name) {
    console.log(37, this.data.searchValue)
    let _search = this.data.searchValue;
    let _result = [];//存放所有包含关键字的结果集
    adCode.forEach(item => {
      if(item[0].indexOf(_search) > -1) {
        _result.push(item);
      }
    })
    // console.log(_result);//
    let _resultData = [];
    _result.forEach(item => {
      if(item[2]) {//有第二参数值 非省级关键字
        let _obj = {
          province: provincecode[item[3]],
          city: citycode[item[2]],
          district: item[0],
          adcode: `${item[1]}`
        };
        if(item[3]) {//非直辖市
          _obj.text = `${item[0]}, ${provincecode[item[3]]}`;
          
        }else {
          _obj.text = `${item[0]}`;
        }
        _resultData.push(_obj)
      }else {//是省份
        this.setData({
          nullMsg: '请输入具体城市/区县名称'
        })
      }
    })
    if(_resultData.length < 1) {
      if(this.data.nullMsg) {
        this.setData({
          showList: true
        })
      }else {
        this.setData({
          nullMsg: '未匹配到数据，请确认区域名称后重新输入',
          showList: true
        })
      }
    }else {
      this.setData({
        resultData: _resultData,
        showList: true
      })
    }
  },
  selectCode(e) {
    console.log(83, e)
    let pages = getCurrentPages();
    console.log('pages', pages)
    // var currPage = pages[pages.length - 1];   //当前页面
    let prevPage = pages[pages.length - 2];  //上一个页面
    
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    let data = e.target.dataset;
    prevPage.setData({
      province: data.province,
      city: data.city,
      district: data.district,
      adcode: data.adcode
    })
    wx.navigateBack({
      delta: 1
    })
  },
  selectCity(e) {
    this.setData({
      searchValue: e.target.dataset.city
    })
    e.target.dataset = {
      province: '',
      city: e.target.dataset.city,
      district: '',
      adcode: e.target.dataset.adcode
    }
    console.log(114, e)
    this.selectCode(e);
  }
})