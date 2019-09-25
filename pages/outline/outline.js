const App = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subjectId: 0,
    chapterId: 0,
    modalHidden: true,
    outlineList: [],
    ifName: false,
    modalHidden: true,
    modalStatusTxt: '',
    modalStatus: 0,
    id: 0,
    sort: 0,
    title: '',
    description: '',
    currPage: 1,
    pageSize: 20
  },

  /**
   * 添加大纲
   */
  openAddWin: function() {
    this.setData({ modalHidden: false, modalStatusTxt: '添加', modalStatus: 1});
  },
  
  /**
   * 添加/更新大纲
   */
  confirmChange: function () {
    if ('' == this.data.title) {
      wx.showToast({
        title: '请输入大纲名称！',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    var subData = {
      subjectId: this.data.subjectId,
      chapterId: this.data.chapterId,
      title: this.data.title,
      description: this.data.description
    }
    // 添加的情况
    if (1 == this.data.modalStatus) {
      wx.request({
        url: 'https://www.infuturedu.com/wx/outline/addOutline',
        data: subData,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var result = res.data;
          if (1 == result.status) {
            wx.showToast({
              title: "大纲添加成功！",
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
        url: 'https://www.infuturedu.com/wx/outline/updateOutline',
        data: subData,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var result = res.data;
          if (1 == result.status) {
            wx.showToast({
              title: "大纲更新成功！",
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
   * 更新大纲
   */
  openUpdateWin: function (el) {
    this.setData({ modalHidden: false, modalStatusTxt: '更新', modalStatus: 2, id: el.currentTarget.dataset.id, sort: el.currentTarget.dataset.sort, title: el.currentTarget.dataset.title, description: el.currentTarget.dataset.description});
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    wx.setNavigationBarTitle({ title: options.chapterTitle + '的大纲'});
    this.setData({ subjectId: options.subjectId, chapterId: options.chapterId }); 
    this.init();
  },

  /**
   * 初始化数据
   */
  init: function() {
    wx.request({
      url: 'https://www.infuturedu.com/wx/outline/getOutlines?chapterId=' + that.data.chapterId + '&currPage=' + that.data.currPage + '&pageSize=' + that.data.pageSize,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var result = res.data;
        if (1 == result.status) {
          that.setData({ outlineList: result.data.list });
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
    let data = App.touch._touchstart(e, this.data.outlineList)
    this.setData({
      outlineList: data
    })
  },

  //滑动事件处理
  touchmove: function (e) {
    let data = App.touch._touchmove(e, this.data.outlineList)
    this.setData({
      outlineList: data
    })
  },

  /**
   * 删除章节
   */
  del: function(el) {
    wx.showModal({
      title: '提示',
      content: '确认要删除大纲信息么？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://www.infuturedu.com/wx/outline/delOutline',
            data: { outlineId: el.currentTarget.dataset.id },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              var result = res.data;
              if (1 == result.status) {
                wx.showToast({
                  title: "大纲删除成功！",
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
    var page = this.data.currPage + 1;
    var arr = this.data.outlineList;
    wx.request({
      url: 'https://www.infuturedu.com/wx/outline/getOutlines?chapterId=' + that.data.chapterId + '&currPage=' + page + '&pageSize=' + that.data.pageSize,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var result = res.data;
        if (1 == result.status) {
          arr = arr.concat(result.data.list);
          that.setData({ outlineList: arr, currPage: page });
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
