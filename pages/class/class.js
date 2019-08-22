const App = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalHidden: true,
    classList: [],
    ifName: false,
    modalHidden: true,
    modalStatusTxt: '',
    modalStatus: 0,
    id: 0,
    name: '',
    currPage: 1,
    pageSize: 10
  },

  /**
   * 添加班级
   */
  openAddWin: function() {
    this.setData({ modalHidden: false, modalStatusTxt: '添加', modalStatus: 1});
  },
  
  /**
   * 添加/更新班级
   */
  confirmChange: function () {
    if ('' == this.data.name) {
      wx.showToast({
        title: '请输入班级名称！',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    var subData = {
      name: this.data.name
    }
    // 添加的情况
    if (1 == this.data.modalStatus) {
      wx.request({
        url: 'https://www.infuturedu.com/wx/class/addClass',
        data: subData,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var result = res.data;
          if (1 == result.status) {
            wx.showToast({
              title: "班级添加成功！",
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
        url: 'https://www.infuturedu.com/wx/class/updateClass',
        data: subData,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var result = res.data;
          if (1 == result.status) {
            wx.showToast({
              title: "班级更新成功！",
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

    wx.showToast({
      title: '添加/更新成功',
      icon: 'success',
      duration: 2000
    });

    this.setData({
      modalHidden: true
    });
    this.cleanModal();
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

  bindName: function(el) {
    this.setData({ name: el.detail.value})
  },

  cleanModal: function() {
    this.setData({ name: ''})
  },

  /**
   * 更新班级
   */
  openUpdateWin: function (el) {
    this.setData({ modalHidden: false, modalStatusTxt: '更新', modalStatus: 2, id: el.currentTarget.dataset.id, name: el.currentTarget.dataset.name});
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.init();
  },

  init: function() {
    wx.request({
      url: 'https://www.infuturedu.com/wx/class/getClasses?currPage=' + that.data.currPage + '&pageSize=' + that.data.pageSize,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var result = res.data;
        if (1 == result.status) {
          that.setData({ classList: result.data.list });
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
    let data = App.touch._touchstart(e, this.data.classList)
    this.setData({
      classList: data
    })
  },

  //滑动事件处理
  touchmove: function (e) {
    let data = App.touch._touchmove(e, this.data.classList)
    this.setData({
      classList: data
    })
  },

  /**
   * 进入学生列表
   */
  entry: function(el) {
    wx.navigateTo({
      url: '../student/student?classId=' + el.currentTarget.dataset.id + '&className=' + el.currentTarget.dataset.name
    })
  },

  /**
   * 删除学生
   */
  del: function(el) {
    wx.showModal({
      title: '提示',
      content: '确认要删除班级信息么？',
      success: function (res) {
        wx.request({
          url: 'https://www.infuturedu.com/wx/class/delClass',
          data: { classId: el.currentTarget.dataset.id },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            var result = res.data;
            if (1 == result.status) {
              wx.showToast({
                title: "班级删除成功！",
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
    var page = this.data.currPage + 1;
    var arr = this.data.subjectList;
    wx.request({
      url: 'https://www.infuturedu.com/wx/class/getClasses?currPage=' + that.data.currPage + '&pageSize=' + that.data.pageSize,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var result = res.data;
        if (1 == result.status) {
          arr = arr.concat(result.data.list);
          that.setData({ classList: arr, currPage: page });
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
