// pages/reading/reading.js
const app = getApp();
var WxParse = require("../../wxParse/wxParse.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    link: "",
    arti_title: "",
    arti_text: "",
    loading: true,
    likeicon: "/Assets/Icon/like_icon.png",
    isLiked: false,
    liketext: "收藏文章"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var liked = this.checkLiked(options.link);
    console.log(liked);
    this.setData({
      isLiked: liked,
      link: options.link
    })
    this.switchLiked();
    this.getCugArticle(options.link);
    wx.setNavigationBarTitle({
      title: "地大之声"
    });
  },

  /**
   * 去数据存储检查是否已经收藏过
   */
  checkLiked: function(urlLink) {
    var keys = wx.getStorageSync('favKey') || [];
    var values = wx.getStorageSync('favValue') || [];
    return keys.includes(urlLink);
  },

  /**
   * 切换收藏状态
   */
  switchLiked: function() {
    if (this.data.isLiked) {
      this.setData({
        likeicon: "/Assets/Icon/liked_icon.png",
        isLiked: true,
        liketext: "取消收藏"
      })
    } else {
      this.setData({
        likeicon: "/Assets/Icon/like_icon.png",
        isLiked: false,
        liketext: "收藏文章"
      })
    }
  },

  /**
   * 根据链接获取文章内容
   */
  getCugArticle: function(link) {
    var that = this;
    wx.request({
      url: link,
      method: 'GET',
      success: res => {
        var articleTitleReg = /arti_title[\s\S]*?>([\s\S]*?)<\/h1/g;
        var arti_title = articleTitleReg.exec(res.data);
        arti_title = arti_title[1];

        var articleTextReg = /(<div id=.vsb_content.[\s\S]*?)<div id=.div_vote/g;
        var arti_text = articleTextReg.exec(res.data);
        arti_text = arti_text[1];

        this.setData({
          arti_title: arti_title,
          loading: false
        })

        WxParse.wxParse("article", "html", arti_text, that, 16);
      }
    })
  },

  /**
   * 收藏文章或者取消收藏
   */
  likeNews: function(urlLink) {
    var that = this;

    this.setData({
      isLiked: !that.data.isLiked
    })
    this.switchLiked();

    var k = that.data.link;
    if (this.data.isLiked) {
      // 收藏
      var keys = wx.getStorageSync('favKey') || [];
      var values = wx.getStorageSync('favValue') || [];
      keys.push(k);
      values.push(that.data.arti_title);
      wx.setStorageSync('favKey', keys);
      wx.setStorageSync('favValue', values);
    } else {
      // 取消收藏
      var keys = wx.getStorageSync('favKey') || [];
      var values = wx.getStorageSync('favValue') || [];
      var deleteIndex = keys.indexOf(k);
      keys.splice(deleteIndex, 1);
      values.splice(deleteIndex, 1);
      wx.setStorageSync('favKey', keys);
      wx.setStorageSync('favValue', values);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let that = this;
    console.log(this.data.link);
    return {
      title: '嗨~看看这篇新闻',
      path: '/pages/reading/reading?link=' + this.data.link,
      success: (res) => {
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: (res) => {
            that.setData({
              isShow: true
            })
          },
          fail: function(res) {
            wx.showModal({
              title: '失败',
              content: '不知为何，没能获取到分享的内容...'
            })
          }
        })
      },
      fail: (res) => {
        // 分享失败
        wx.showModal({
          title: '失败',
          content: '不知为何，分享失败了...'
        })
      }
    }
  }
})