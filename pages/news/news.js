// pages/news/news.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsList: [],
    pageIndex: null,
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "地大之声"
    });
    this.initCugNews();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.loadMoreCugNews();
  },

  /**
   * 初始化获取各个学校的第一页新闻
   */
  initCugNews: function() {
    console.log("Getting CUG news...");
    wx.request({
      url: 'https://voice.cug.edu.cn/xwjj.htm',
      method: 'GET',
      success: res => {
        // 从第一页获取新闻列表
        var onePageList = this.getCugNews(res.data);

        // 获取新闻的总页数，作为增量加载的 URL 参数
        var pageReg = /id=.fanye[\s\S]*?\/([\s\S]*?)&/g;
        var pages = pageReg.exec(res.data);
        this.setData({
          pageIndex: pages[1]
        })

        // 将新增页的内容合并到新闻列表中
        this.data.newsList = this.data.newsList.concat(onePageList);
        this.setData({
          newsList: this.data.newsList,
          loading: false
        });
      }
    })
  },

  /**
   * 加载更多新闻
   */
  loadMoreCugNews: function() {
    console.log("Getting more CUG news...");
    this.data.pageIndex--;
    if (this.data.pageIndex <= 0) {
      return;
    }
    var newUrl = "https://voice.cug.edu.cn/xwjj/" + this.data.pageIndex + ".htm";
    wx.request({
      url: newUrl,
      method: 'GET',
      success: res => {
        var onePageList = this.getCugNews(res.data);
        this.data.newsList = this.data.newsList.concat(onePageList);
        this.setData({
          newsList: this.data.newsList
        });
      }
    })
  },

  /**
   * 使用正则表达式提取新闻内容
   */
  getCugNews: function(res) {
    var yrReg = /<span class=.yr.>([\s\S]*?)<\/span>/g;
    var nReg = /<span class=.n.>([\s\S]*?)<\/span>/g;
    var btReg = /class=.bt.>([\s\S]*?)<\/a>/g;
    var jjReg = /class=.jj.>([\s\S]*?)<\/a>/g;
    var hrefReg = /<div class=.btjj.>([\s\S]*?) class=.bt.>/g;
    var data = res;
    var onePageList = [];

    for (var i = 0; i < 10; i++) {
      var yrMatch = yrReg.exec(data);
      var nMatch = nReg.exec(data);
      var btMatch = btReg.exec(data);
      var jjMatch = jjReg.exec(data);
      var hrefMatch = hrefReg.exec(data);
      onePageList.push({
        yr: yrMatch[1],
        n: nMatch[1],
        bt: btMatch[1].trim(),
        jj: jjMatch[1].trim(),
        href: "https://voice.cug.edu.cn/" + hrefMatch[1].trim().replace("<a href=\"", "").replace("\"", "")
      })
    }
    return onePageList;
  },

  /**
   * 读取跳转详细新闻页
   */
  readNewsDetail: function(e) {
    var index = e.currentTarget.id;
    var link = "../reading/reading?link=" + this.data.newsList[index].href;
    console.log(link);
    wx.navigateTo({
      url: link,
    })
  }

})