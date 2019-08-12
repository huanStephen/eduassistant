const App = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionId: 0,
    modalHidden: true,
    title: '',
    answers: [],
    mappingList: [],
    multiArray: [[{ id: 1, name: '七年级英语' }, { id: 2, name: '八年级英语' }, { id: 3, name: '九年级英语' }, { id: 4, name: '高一英语' }, { id: 5, name: '高二英语' }, { id: 6, name: '高三英语' }], [{ id: 1, name: '第一章' }, { id: 2, name: '第二章' }, { id: 3, name: '第三章' }, { id: 4, name: '第四章' }, { id: 5, name: '第五章' }, { id: 6, name: '第六章' }], [{ id: 1, name: '第一节132321' }, { id: 2, name: '第二节' }, { id: 3, name: '第三节' }, { id: 4, name: '第四节' }, { id: 5, name: '第五节' }, { id: 6, name: '第六节' }]],//二维数组，长度是多少是几列
    multiIndex: [0, 1, 0],
    max: 10,
    weight: 0,
    ifName: false,
    modalHidden: true,
    modalStatusTxt: '',
    modalStatus: 0
  },

  /**
   * 添加章节
   */
  openAddWin: function() {
    this.setData({ modalHidden: false, modalStatusTxt: '添加', modalStatus: 1});
  },
  
  /**
   * 添加/更新映射
   */
  confirmChange: function () {
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
   * 更新映射
   */
  openUpdateWin: function (el) {
    this.setData({ modalHidden: false, modalStatusTxt: '更新', modalStatus: 2, id: el.currentTarget.dataset.id, weight: el.currentTarget.dataset.weight});
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.setData({ questionId: options.questionId, title: "第一题", answers: [{ item: '第一题答案1' }, { item: '第一题答案2' }, { item: '第一题答案3' }, { item: '第一题答案4' }], mappingList: [{ id: 1, subjectId: 1, subjectName: "七年级英语", chapterId: 1, chapterName: '第一章', outlineId: 1, outlineName: '第一节', weight: 6 }, { id: 2, subjectId: 2, subjectName: "七年级英语", chapterId: 2, chapterName: '第三章', outlineId: 2, outlineName: '第六节', weight: 4 }] }); 
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

    //       that.setData({mappingList: res.list});
    //     } else {

    //     }
    //   }
    // });
  },

  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    let data = App.touch._touchstart(e, this.data.mappingList)
    this.setData({
      mappingList: data
    })
  },

  //滑动事件处理
  touchmove: function (e) {
    let data = App.touch._touchmove(e, this.data.mappingList)
    this.setData({
      mappingList: data
    })
  },

  /**
   * 删除映射
   */
  del: function(el) {
    wx.showModal({
      title: '提示',
      content: '确认要删除映射信息么？',
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

  bindMultiPickerChange: function(el) {
    var value = el.detail.value;
    this.setData({ multiIndex: [value[0], value[1], value[2]]});
  },

  bindMultiPickerColumnChange: function(el) {
    var value = el.detail.value;
    // var provinces = this.data.provinces
    // var citys = this.data.citys
    // var areas = this.data.areas
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
