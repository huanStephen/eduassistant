const App = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classId: 0,
    modalHidden: true,
    studentList: [],
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
   * 添加学生
   */
  openAddWin: function() {
    this.setData({ modalHidden: false, modalStatusTxt: '添加', modalStatus: 1});
  },
  
  /**
   * 添加/更新学生
   */
  confirmChange: function () {
    if ('' == this.data.name) {
      wx.showToast({
        title: '请输入学生名称！',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    var subData = {
      classId: this.data.classId,
      name: this.data.name
    }
    // 添加的情况
    if (1 == this.data.modalStatus) {
      wx.request({
        url: 'http://localhost:8080/wx/student/addStudent',
        data: subData,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var result = res.data;
          if (1 == result.status) {
            wx.showToast({
              title: "学生添加成功！",
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
        url: 'http://localhost:8080/wx/student/updateStudent',
        data: subData,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var result = res.data;
          if (1 == result.status) {
            wx.showToast({
              title: "学生更新成功！",
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

  bindName: function(el) {
    this.setData({ name: el.detail.value})
  },

  cleanModal: function() {
    this.setData({ name: ''})
  },

  /**
   * 更新学生
   */
  openUpdateWin: function (el) {
    this.setData({ modalHidden: false, modalStatusTxt: '更新', modalStatus: 2, id: el.currentTarget.dataset.id, name: el.currentTarget.dataset.name});
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    wx.setNavigationBarTitle({ title: options.className + '的学生' });
    this.setData({ classId: options.classId }); 
    this.init();
  },

  /**
   * 初始化数据
   */
  init: function() {
    wx.request({
      url: 'http://localhost:8080/wx/student/getStudents?classId=' + that.data.classId + '&currPage=' + that.data.currPage + '&pageSize=' + that.data.pageSize,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var result = res.data;
        if (1 == result.status) {
          that.setData({ studentList: result.data.list });
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
    let data = App.touch._touchstart(e, this.data.studentList)
    this.setData({
      studentList: data
    })
  },

  //滑动事件处理
  touchmove: function (e) {
    let data = App.touch._touchmove(e, this.data.studentList)
    this.setData({
      studentList: data
    })
  },

  /**
   * 删除学生
   */
  del: function(el) {
    wx.showModal({
      title: '提示',
      content: '确认要删除学生信息么？',
      success: function (res) {
        wx.request({
          url: 'http://localhost:8080/wx/student/delStudent',
          data: { studentId: el.currentTarget.dataset.id },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            var result = res.data;
            if (1 == result.status) {
              wx.showToast({
                title: "学生删除成功！",
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

  entry: function(el) {
    wx.navigateTo({
      url: '../studentdetail/studentdetail?studentId=' + el.currentTarget.dataset.id + '&studentName=' + el.currentTarget.dataset.name
    })
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
