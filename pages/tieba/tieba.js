//var WxParse = require("../../wxParse/wxParse.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tiebaList: [],
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "中国地质大学 百度贴吧"
    });

    var that = this;
    //进行请求,一般外层都有一个封装,然后放在公共类里边 
    wx.request({
      url: 'https://tieba.baidu.com/f?kw=中国地质大学&ie=utf-8&tab=good',
      method: 'GET',
      success: res => {
        //console.log(res.data);

        var list = [];
        var feedsReg = /href="(\/p\/[\s\S]*?)?lp=[\s\S]*?<span>([\s\S]*?)<\/span/g;
        var replyNumReg = /"reply_num":([\s\S]*?),/g;
        for (var i = 0; i < 50; i++) {
          var feeds = feedsReg.exec(res.data);
          var replys = replyNumReg.exec(res.data);

          var feedLink = "https://tieba.baidu.com" + feeds[1].replace("?", "");
          var feedTitle = feeds[2];
          if (feedTitle.length >= 34) {
            feedTitle = feedTitle.substring(0, 32) + "...";
          }
          var feedReply = "共 " + replys[1] + " 条回贴";

          list.push({
            title: feedTitle,
            link: feedLink,
            replyNum: feedReply
          })
          console.log(feedLink);
          console.log(feedTitle);
          console.log("Reply: " + feedReply);
        }

        that.data.tiebaList = list;
        that.setData({
          tiebaList: that.data.tiebaList,
          loading: false
        })

        //WxParse.wxParse("article", "html", feeds, that, 16);
      }
    })
  },

  readTiebaDetail: function(e) {
    var index = e.currentTarget.id;
    var link = "../tiezi/tiezi?link=" + this.data.tiebaList[index].link + "&title=" + this.data.tiebaList[index].title;
    console.log(link);
    wx.navigateTo({
      url: link,
    })
  }
})