//index.js
//获取应用实例
const app = getApp()

// 引用百度地图微信小程序JSAPI模块 
var bmap = require('../../libs/bmap-wx.js');


Page({
  data: {
    greetingWords: "",
    cugImg: "/Assets/Icon/cug.jpg",
    tiebaImg: "/Assets/Icon/tieba.jpg",
    backgroudImg: "/Assets/newspaper.jpg",
    mapImg: "/Assets/Icon/map.jpg",
    imgUrls: [],
    swiperUrls: [],
    weatherTitle: "",
    weatherTemp: ""
  },

  onLoad: function() {
    wx.setNavigationBarTitle({
      title: "地大知了"
    });
    this.greeting();
    this.getSwiper();
    this.getWeather();
  },

  greeting: function() {
    var greetingwords = "";
    var time = new Date().getHours();
    if (time >= 6 && time < 9) {
      greetingwords = ", 早上好。";
    } else if (time >= 9 && time < 11) {
      greetingwords = ", 上午好。";
    } else if (time >= 11 && time < 15) {
      greetingwords = ", 午安。";
    } else if (time >= 15 && time < 18) {
      greetingwords = ", 下午好。";
    } else if (time >= 18 && time < 20) {
      greetingwords = ", 晚上好。";
    } else if (time >= 20 && time < 23) {
      greetingwords = ", 晚安。";
    } else {
      greetingwords = ", 凌晨好。";
    }
    console.log(greetingwords);
    this.setData({
      greetingWords: greetingwords
    })
  },

  getWeather: function() {
    var that = this;
    // 新建百度地图对象
    var BMap = new bmap.BMapWX({
      ak: 'ZpCfbwW6bzH9xnrBWML9CBMFXUro4THY'
    });
    // 回调函数声明
    var fail = function(data) {
      console.log(data)
    };
    var success = function(data) {
      var weatherData = data.currentWeather[0];
      console.log(weatherData);

      that.setData({
        weatherTitle: weatherData.weatherDesc,
        weatherTemp: weatherData.temperature
      })
    }
    // 发起weather请求 
    BMap.weather({
      fail: fail,
      success: success
    });
  },

  seeLog: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  // 地大之声
  readCug: function() {
    wx.navigateTo({
      url: '../news/news',
    })
  },

  // 地大地图
  readMap: function() {
    wx.navigateTo({
      url: '../map/map',
    })
  },

  // 地大贴吧
  readTieba: function() {
    wx.navigateTo({
      url: '../tieba/tieba',
    })
  },

  getSwiper: function() {
    wx.request({
      url: 'https://voice.cug.edu.cn/',
      method: 'GET',
      success: res => {
        // console.log(res.data);
        var slideImgs = [];
        var slideHrefs = [];
        var slideReg = /<a class="tu" href="([\s\S]*?)" title[\s\S]*?img src="([\s\S]*?)" alt/g;
        var slide = slideReg.exec(res.data);
        while (slide !== null && typeof(slide) != "undefined" && slide != 0) {
          slideImgs.push("https://voice.cug.edu.cn" + slide[2]);
          slideHrefs.push("https://voice.cug.edu.cn/" + slide[1].replace("http://voice.cug.edu.cn/", ""));
          slide = slideReg.exec(res.data);
        }

        this.data.imgUrls = slideImgs;
        this.data.swiperUrls = slideHrefs;
        this.setData({
          imgUrls: this.data.imgUrls,
          swiperUrls: this.data.swiperUrls
        })
      }
    })
  },

  clickSwiper: function(e) {
    var index = e.currentTarget.id;
    console.log(index);
    console.log(this.data.swiperUrls[index]);
    var link = "../reading/reading?link=" + this.data.swiperUrls[index];
    wx.navigateTo({
      url: link,
    })
  }
})