const App = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subjectId: 0,
    modalHidden: true,
    chapterList: [],
    ifName: false,
    modalHidden: true,
    modalStatusTxt: '',
    modalStatus: 0,
    id: 0,
    sort: 0,
    title: '',
    description: '',
    currPage: 1,
    pageSize: 10
  },

  /**
   * 添加章节
   */
  openAddWin: function() {
    this.setData({ modalHidden: false, modalStatusTxt: '添加', modalStatus: 1});
  },
  
  /**
   * 添加/更新章节
   */
  confirmChange: function () {
    if ('' == this.data.title) {
      wx.showToast({
        title: '请输入章节名称！',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    var subData = {
      subjectId: this.data.subjectId,
      title: this.data.title,
      description: this.data.description
    }
    // 添加的情况
    if (1 == this.data.modalStatus) {
      wx.request({
        url: 'http://localhost:8080/wx/chapter/addChapter',
        data: subData,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var result = res.data;
          if (1 == result.status) {
            wx.showToast({
              title: "科目章节成功！",
              icon: 'success',
              duration: 2000
            });
            that.init();
            that.setData({
              modalHidden: true
            });
          } else {
            wx.showToast({
              title: result.msg,
              icon: 'none',
              duration: 1000
            });
          }
          that.cleanModal();
        }
      });
    } 
    // 更新的情况
    else if (2 == this.data.modalStatus) {
      subData.id = this.data.id;
      wx.request({
        url: 'http://localhost:8080/wx/chapter/updateChapter',
        data: subData,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var result = res.data;
          if (1 == result.status) {
            wx.showToast({
              title: "科目章节成功！",
              icon: 'success',
              duration: 2000
            });
            that.init();
            that.setData({
              modalHidden: true
            });
          } else {
            wx.showToast({
              title: result.msg,
              icon: 'none',
              duration: 1000
            });
          }
          that.cleanModal();
        }
      });
    }
  },

  /**
   * 取消
   */
  cancellChange: function () {
    this.setData({
      modalHidden: true
    });
    this.cleanModal();
  },

  bindTitle: function(el) {
    this.setData({ title: el.detail.value})
  },

  bindDescription: function (el) {
    this.setData({ description: el.detail.value})
  },

  cleanModal: function() {
    this.setData({ title: '', description: ''})
  },

  /**
   * 更新章节
   */
  openUpdateWin: function (el) {
    this.setData({ modalHidden: false, modalStatusTxt: '更新', modalStatus: 2, id: el.currentTarget.dataset.id, sort: el.currentTarget.dataset.sort, title: el.currentTarget.dataset.title, description: el.currentTarget.dataset.description});
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    wx.setNavigationBarTitle({ title: options.subjectName + '的章节' });
    this.setData({ subjectId: options.subjectId }); 
    this.init();
  },

  /**
   * 初始化数据
   */
  init: function() {
    wx.request({
      url: 'http://localhost:8080/wx/chapter/getChapters?subjectId=' + that.data.subjectId + '&currPage=' + that.data.currPage + '&pageSize=' + that.data.pageSize,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var result = res.data;
        if (1 == result.status) {
          that.setData({ chapterList: result.data.list });
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
    let data = App.touch._touchstart(e, this.data.chapterList)
    this.setData({
      chapterList: data
    })
  },

  //滑动事件处理
  touchmove: function (e) {
    let data = App.touch._touchmove(e, this.data.chapterList)
    this.setData({
      chapterList: data
    })
  },

  entry: function(el) {
    wx.navigateTo({
      url: '../outline/outline?chapterId=' + el.currentTarget.dataset.id + '&chapterTitle=' + el.currentTarget.dataset.title
    });
  },

  /**
   * 删除章节
   */
  del: function(el) {
    wx.showModal({
      title: '提示',
      content: '确认要删除章节信息么？',
      success: function (res) {
        wx.request({
          url: 'http://localhost:8080/wx/chapter/delChapter',
          data: { chapterId: el.currentTarget.dataset.id },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            var result = res.data;
            if (1 == result.status) {
              wx.showToast({
                title: "章节删除成功！",
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
    }); 
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
