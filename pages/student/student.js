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
    sort: 0,
    name: '',
    description: ''
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
      id: null,
      name: this.data.name,
      description: this.data.description,
      sort: null
    }
    // 添加的情况
    if (1 == this.data.modalStatus) {
      // wx.request({
      //   url: '',
      //   data: subData,
      //   method: 'POST',
      //   header: {
      //     'content-type': 'application/x-www-form-urlencoded'
      //   },
      //   success: function(res) {
      //     if (1 == res.result) {

      //       that.init();
      //     } else {

      //     }
      //   }
      // });
    } 
    // 更新的情况
    else if (2 == this.data.modalStatus) {
      subData.id = this.data.id;
      subData.sort = this.data.sort;
      // wx.request({
      //   url: '',
      //   data: subData,
      //   method: 'POST',
      //   header: {
      //     'content-type': 'application/x-www-form-urlencoded'
      //   },
      //   success: function (res) {
      //     if (1 == res.result) {

      //       that.init();
      //     } else {

      //     }
      //   }
      // });
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

  bindDescription: function (el) {
    this.setData({ description: el.detail.value})
  },

  cleanModal: function() {
    this.setData({ name: '', description: ''})
  },

  /**
   * 更新学生
   */
  openUpdateWin: function (el) {
    this.setData({ modalHidden: false, modalStatusTxt: '更新', modalStatus: 2, id: el.currentTarget.dataset.id, sort: el.currentTarget.dataset.sort, name: el.currentTarget.dataset.name, description: el.currentTarget.dataset.description});
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    wx.setNavigationBarTitle({ title: options.className + '的学生' });
    this.setData({ classId: options.classId, studentList: [{ id: 1, name: "张三", sort: 1, description: '' }, { id: 2, name: "李四", sort: 2, description: '' }, { id: 3, name: "王五", sort: 3, description: '' }, { id: 4, name: "赵六", sort: 4, description: '' }, { id: 5, name: "刘奇", sort: 5, description: '' }, { id: 6, name: "孙八", sort: 6, description: '' }] }); 
    this.init();
  },

  /**
   * 初始化数据
   */
  init: function() {
    // wx.request({
    //   url: '',
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     if (1 == res.result) {

    //       that.setData({studentList: res.list});
    //     } else {

    //     }
    //   }
    // });
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
        console.log(el.currentTarget.dataset.id);
        // wx.request({
      //   url: '',
      //   data: subData,
      //   method: 'POST',
      //   header: {
      //     'content-type': 'application/x-www-form-urlencoded'
      //   },
      //   success: function (res) {
      //     if (1 == res.result) {

      //       that.init();
      //     } else {

      //     }
      //   }
      // });
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
