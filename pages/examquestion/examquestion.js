const App = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    exampaperId: 0,
    questionList: [],
    modalHidden: true,
    questionList: [],
    ifName: false,
    modalHidden: true,
    id: 0,
    sort: 0,
    name: '',
    description: ''
  },

  /**
   * 添加/更新大纲
   */
  confirmChange: function () {
    var subData = {
      id: this.data.id,
      name: this.data.name,
      description: this.data.description,
      sort: this.data.sort
    }
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

  bindName: function (el) {
    this.setData({ name: el.detail.value })
  },

  bindDescription: function (el) {
    this.setData({ description: el.detail.value })
  },

  cleanModal: function () {
    this.setData({ name: '', description: '' })
  },

  entryExamQuestionChoose: function() {
    wx.navigateTo({
      url: '../examquestionchoose/examquestionchoose'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    wx.setNavigationBarTitle({ title: options.exampaperName + '的试题' });
    this.setData({ exampaperId: options.exampaperId, questionList: [{ id: 1, title: "第一题", answers: [{ item: '第一题答案1' }, { item: '第一题答案2' }, { item: '第一题答案3' }, { item: '第一题答案4' }] }, { id: 2, title: "第二题", answers: [{ item: '第二题答案1' }, { item: '第二题答案2' }, { item: '第二题答案3' }, { item: '第二题答案4' }] }, { id: 3, title: "第三题", answers: [{ item: '第三题答案1' }, { item: '第三题答案2' }, { item: '第三题答案3' }, { item: '第三题答案4' }] }, { id: 4, title: "第四题", answers: [{ item: '第四题答案1' }, { item: '第四题答案2' }, { item: '第四题答案3' }, { item: '第四题答案4' }] }, { id: 5, title: "第五题", answers: [{ item: '第五题答案1' }, { item: '第五题答案2' }, { item: '第五题答案3' }, { item: '第五题答案4' }] }, { id: 6, title: "第六题", answers: [{ item: '第六题答案1' }, { item: '第六题答案2' }, { item: '第六题答案3' }, { item: '第六题答案4' }] }] });
    this.init();
  },

  /**
   * 初始化数据
   */
  init: function () {
    // wx.request({
    //   url: '',
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     if (1 == res.result) {

    //       that.setData({questionList: res.list});
    //     } else {

    //     }
    //   }
    // });
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

  // 选项卡
  filterTab: function (e) {
    var data = [true, true, true], index = e.currentTarget.dataset.index;
    data[index] = !this.data.tab[index];
    this.setData({
      tab: data
    })
  },

  //筛选项点击操作
  filter: function (e) {
    var dataset = e.currentTarget.dataset;
    var self = this, id = e.currentTarget.dataset.id, txt = dataset.txt, tabTxt = this.data.tabTxt;
    switch (dataset.index) {
      case '0':
        tabTxt[0] = txt;
        self.setData({
          tab: [true, true, true],
          tabTxt: tabTxt,
          subject_id: id
        });
        break;
      case '1':
        tabTxt[1] = txt;
        self.setData({
          tab: [true, true, true],
          tabTxt: tabTxt,
          chapter_id: id
        });
        break;
      case '2':
        tabTxt[2] = txt;
        self.setData({
          tab: [true, true, true],
          tabTxt: tabTxt,
          xiaoliang_id: id,
          xiaoliang_txt: txt
        });
        break;
    }
    //数据筛选
    self.getDataList();
  },

  getDataList: function () {

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
