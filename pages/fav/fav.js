// pages/fav/fav.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    empty_img: "/Assets/empty.png",
    screen_height: 0,
    favoritesTitle: [],
    favoritesUrl: [],
    hasFavorite: false
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(options) {
    var that = this;
    // 获取系统信息
    wx.getSystemInfo({
      success: function(res) {
        // console.log(res);
        // 可使用窗口宽度、高度
        // console.log('height=' + res.windowHeight);
        // console.log('width=' + res.windowWidth);
        // 计算主体部分高度,单位为px
        that.setData({
          screen_height: res.windowHeight - 32
        })
      }
    })

    var urls = wx.getStorageSync('favKey') || [];
    var titles = wx.getStorageSync('favValue') || [];

    if (urls.length > 0) {
      that.setData({
        hasFavorite: true
      })
    } else {
      that.setData({
        hasFavorite: false
      })
    }
    console.log(urls);
    that.data.favoritesTitle = titles;
    that.data.favoritesUrl = urls;
    that.setData({
      favoritesTitle: that.data.favoritesTitle,
      favoritesUrl: that.data.favoritesUrl
    })
  },

  readNewsDetail: function(e) {
    var index = e.currentTarget.id;
    var link = "../reading/reading?link=" + this.data.favoritesUrl[index];
    console.log(link);
    wx.navigateTo({
      url: link,
    })
  }
})