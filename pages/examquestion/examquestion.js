const App = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    answerTxt: ['A', 'B', 'C', 'D', 'E'],
    exampaperId: 0,
    questionList: [],
    ifName: false,
    modalHidden: true,
    id: 0,
    currPage: 1,
    pageSize: 10
  },

  entryExamQuestionChoose: function() {
    wx.navigateTo({
      url: '../examquestionchoose/examquestionchoose?exampaperId=' + that.data.exampaperId
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    wx.setNavigationBarTitle({ title: options.exampaperName + '的试题' });
    this.setData({ exampaperId: options.exampaperId });
  },

  /**
   * 初始化数据
   */
  init: function () {
    wx.request({
      url: 'https://www.infuturedu.com/wx/exampaper/getExamQuestions?exampaperId=' + that.data.exampaperId + '&currPage=' + that.data.currPage + '&pageSize=' + that.data.pageSize,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var result = res.data;
        if (1 == result.status) {
          that.setData({ questionList: result.data.list });
        } else {
          wx.showToast({
            title: result.msg,
            icon: 'none',
            duration: 1000
          });
        }
      }
    });
  },

  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    let data = App.touch._touchstart(e, this.data.questionList)
    this.setData({
      questionList: data
    })
  },

  //滑动事件处理
  touchmove: function (e) {
    let data = App.touch._touchmove(e, this.data.questionList)
    this.setData({
      questionList: data
    })
  },

  /**
   * 删除试题
   */
  del: function (el) {
    wx.showModal({
      title: '提示',
      content: '确认要删除试题信息么？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://www.infuturedu.com/wx/exampaper/delExamQuestion',
            data: { examquestionId: el.currentTarget.dataset.id },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              var result = res.data;
              if (1 == result.status) {
                wx.showToast({
                  title: "试题删除成功！",
                  icon: 'success',
                  duration: 2000
                });
                that.init();
              } else {
                wx.showToast({
                  title: result.msg,
                  icon: 'none',
                  duration: 1000
                });
              }
            }
          });
        }
      }
    });
  },

  //点击最外层列表展开收起
  listTap(e) {
    let idx = e.currentTarget.dataset.index,//获取点击的下标值
      list = this.data.questionList;
    list[idx].show = !list[idx].show;//变换其打开、关闭的状态
    if (list[idx].show) {//如果点击后是展开状态，则让其他已经展开的列表变为收起状态
      this.packUp(list, idx);
    }

    this.setData({questionList: list});
  },

  //让所有的展开项，都变为收起
  packUp(data, index) {
    for (let i = 0, len = data.length; i < len; i++) {//其他最外层列表变为关闭状态
      if (index != i) {
        data[i].show = false;
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.init();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var page = that.data.currPage + 1;
    var arr = that.data.questionList;
    wx.request({
      url: 'https://www.infuturedu.com/wx/exampaper/getExamQuestions?exampaperId=' + that.data.exampaperId + '&currPage=' + page + '&pageSize=' + that.data.pageSize,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var result = res.data;
        if (1 == result.status) {
          arr = arr.concat(result.data.list);
          that.setData({ questionList: arr, currPage: page });
        } else {
          wx.showToast({
            title: result.msg,
            icon: 'none',
            duration: 1000
          });
        }
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
