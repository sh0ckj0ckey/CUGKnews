// pages/tiezi/tiezi.js
var WxParse = require("../../wxParse/wxParse.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    link: "",
    title: "",
    tiezi: [],
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    this.setData({
      link: options.link,
      title: options.title
    })
    wx.setNavigationBarTitle({
      title: that.data.title
    });

    var tz_content;

    wx.request({
      url: that.data.link,
      method: 'GET',
      success: res => {
        //console.log(res.data);
        var tzReg = /<div id="main"([\s\S]*?)class="fixed_bar/g;
        tz_content = tzReg.exec(res.data);
        tz_content = tz_content[1]; // 过滤，提取需要的 HTML 部分

        var contentReg = /<div class="content[\s\S]*?lz[\s\S]*?">([\s\S]*?)<\/div/g;
        var nameReg = /list_item_top_name[\s\S]*?&tj=[\d]*?" class="user_name">([\s\S]*?)</g;

        // 过滤广告
        var adsReg = /<li clas[\s\S]*?<\/li>/g;
        var ads = adsReg.exec(tz_content);
        tz_content = tz_content.replace(/<li clas[\s\S]*?<\/li>/g, "");
        var contentOne = contentReg.exec(tz_content);
        var nameOne = nameReg.exec(tz_content);

        var tieziList = [];

        while (true) {
          console.log(contentOne[1]);
          console.log(nameOne[1]);
          var cntt = contentOne[1];
          cntt = cntt.replace(/<br\/>/g, "\n").replace(/<img src[\s\S]*?"\/>/g, "[图片]").replace(/<\/a>/g, "").replace(/<a[\s\S]*?>/g, "").replace(/<[\s\S]*?jpg'>/g, "[图片]").replace(/<[\s\S]*?png'>/g, "[图片]");
          tieziList.push({
            reply: cntt,
            name: nameOne[1]
          })
          contentOne = contentReg.exec(tz_content);
          nameOne = nameReg.exec(tz_content);
          if (contentOne === null || contentOne === undefined || nameOne === null || nameOne === undefined) {
            break;
          }
        }
        that.data.tiezi = tieziList;
        that.setData({
          tiezi: that.data.tiezi,
          loading: false
        })

      }
    })
  },
})