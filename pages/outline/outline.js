const App = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chapterId: 0,
    modalHidden: true,
    outlineList: [],
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
   * 添加大纲
   */
  openAddWin: function() {
    this.setData({ modalHidden: false, modalStatusTxt: '添加', modalStatus: 1});
  },
  
  /**
   * 添加/更新大纲
   */
  confirmChange: function () {
    if ('' == this.data.name) {
      wx.showToast({
        title: '请输入大纲名称！',
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
   * 更新大纲
   */
  openUpdateWin: function (el) {
    this.setData({ modalHidden: false, modalStatusTxt: '更新', modalStatus: 2, id: el.currentTarget.dataset.id, sort: el.currentTarget.dataset.sort, name: el.currentTarget.dataset.name, description: el.currentTarget.dataset.description});
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    wx.setNavigationBarTitle({ title: options.chapterTitle + '的大纲'});
    this.setData({ chapterId: options.chapterId, outlineList: [{ id: 1, name: "第一节这一个超级长", sort: 1, description: 'Flex所支持的样式比Flash要丰富，样式定义的方法也很多。这也是Flex比Flash要强大、适合网页开发的地方之一。' }, { id: 2, name: "第二节", sort: 2, description: 'Flex会调用全局样式表global.css，该全局样式表由flex-config.xml定义' }, { id: 3, name: "第三节", sort: 3, description: '系统默认的样式表文件global.css文件其实没有任何样式定义，我们可以手动添加全局样式，也可以更改默认的全局样式文件路径。' }, { id: 4, name: "第四节", sort: 4, description: '在这里顺便提一点，定义外部css文件的时候，颜色样式有四种定义方式' }, { id: 5, name: "第五节", sort: 5, description: '下面的例子定义了myFontStyle子类样式，要使用对应的样式可以在组件中使用styleName属性来应用样式。' }, { id: 6, name: "第六节", sort: 6, description: '下面的样式则定义了所有Button组件的样式，使用该方式定义的样式在使用的时候不需要指定样式名。' }] }); 
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

    //       that.setData({outlineList: res.list});
    //     } else {

    //     }
    //   }
    // });
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
