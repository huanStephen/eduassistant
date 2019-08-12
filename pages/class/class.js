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
    sort: 0,
    name: '',
    description: ''
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

      //       that.onLoad();
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

      //       that.onLoad();
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
   * 更新班级
   */
  openUpdateWin: function (el) {
    this.setData({ modalHidden: false, modalStatusTxt: '更新', modalStatus: 2, id: el.currentTarget.dataset.id, sort: el.currentTarget.dataset.sort, name: el.currentTarget.dataset.name, description: el.currentTarget.dataset.description});
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.setData({ classList: [{ id: 1, name: "1班", sort: 1, description: '' }, { id: 2, name: "2班", sort: 2, description: '' }, { id: 3, name: "3班", sort: 3, description: '' }, { id: 4, name: "4班", sort: 4, description: '' }, { id: 5, name: "5班", sort: 5, description: '' }, { id: 6, name: "6班", sort: 6, description: '' }] });
    // wx.request({
    //   url: '',
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     if (1 == res.result) {
          
    //       that.setData({classList: res.list});
    //     } else {

    //     }
    //   }
    // });
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
        // wx.request({
      //   url: '',
      //   data: subData,
      //   method: 'POST',
      //   header: {
      //     'content-type': 'application/x-www-form-urlencoded'
      //   },
      //   success: function (res) {
      //     if (1 == res.result) {

      //       that.onLoad();
      //     } else {

      //     }
      //   }
      // });
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
