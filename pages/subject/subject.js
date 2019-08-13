const App = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalHidden: true,
    subjectList: [],
    ifName: false,
    modalHidden: true,
    modalStatusTxt: '',
    modalStatus: 0,
    id: 0,
    name: '',
    description: '',
    currPage: 1,
    pageSize: 10
  },

  /**
   * 添加科目
   */
  openAddWin: function() {
    this.setData({ modalHidden: false, modalStatusTxt: '添加', modalStatus: 1});
  },
  
  /**
   * 添加/更新科目
   */
  confirmChange: function () {
    if ('' == this.data.name) {
      wx.showToast({
        title: '请输入科目名称！',
        icon: 'none',
        duration: 1000
      });
      return ;
    }
    var subData = {
      name: this.data.name,
      description: this.data.description
    }
    // 添加的情况
    if (1 == this.data.modalStatus) {
      wx.request({
        url: 'http://localhost:8080/wx/subject/addSubject',
        data: subData,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          var result = res.data;
          if (1 == result.status) {
            wx.showToast({
              title: "科目添加成功！",
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
        url: 'http://localhost:8080/wx/subject/updateSubject',
        data: subData,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var result = res.data;
          if (1 == result.status) {
            wx.showToast({
              title: "科目更新成功！",
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

  bindDescription: function (el) {
    this.setData({ description: el.detail.value})
  },

  cleanModal: function() {
    this.setData({ name: '', description: ''})
  },

  /**
   * 更新科目
   */
  openUpdateWin: function (el) {
    this.setData({ modalHidden: false, modalStatusTxt: '更新', modalStatus: 2, id: el.currentTarget.dataset.id, name: el.currentTarget.dataset.name, description: el.currentTarget.dataset.description});
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.init();
  },

  /**
   * 初始化加载数据
   */
  init: function() {
    wx.request({
      url: 'http://localhost:8080/wx/subject/getSubjects?currPage=' + that.data.currPage + '&pageSize=' + that.data.pageSize,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var result = res.data;
        if (1 == result.status) {
          that.setData({ subjectList: result.data.list });
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
    let data = App.touch._touchstart(e, this.data.subjectList)
    this.setData({
      subjectList: data
    })
  },

  //滑动事件处理
  touchmove: function (e) {
    let data = App.touch._touchmove(e, this.data.subjectList)
    this.setData({
      subjectList: data
    })
  },

  /**
   * 进入章节
   */
  entry: function(el) {
    wx.navigateTo({
      url: '../chapter/chapter?subjectId=' + el.currentTarget.dataset.id
    })
  },

  /**
   * 删除科目
   */
  del: function(el) {
    wx.showModal({
      title: '提示',
      content: '确认要删除科目信息么？',
      success: function (res) {
        wx.request({
          url: 'http://localhost:8080/wx/subject/delSubject',
          data: { subjectId: el.currentTarget.dataset.id},
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            var result = res.data;
            if (1 == result.status) {
              wx.showToast({
                title: "科目删除成功！",
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
      url: 'http://localhost:8080/wx/subject/getSubjects?currPage=' + page + '&pageSize=' + that.data.pageSize,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var result = res.data;
        if (1 == result.status) {
          arr = arr.concat(result.data.list);
          that.setData({ subjectList: arr, currPage: page });
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
