const App = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    exampaperId: 0,
    tabTxt: ['科目', '章节', '大纲'],//分类
    tab: [true, true, true],
    questionList: [],
    subjectList: [],
    chapterList: [],
    outlineList: [],
    modalHidden: true,
    questionList: [],
    ifName: false,
    modalHidden: true,
    selectedQuestions: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.setData({ questionList: [{ id: 1, title: "第一题", answers: [{ item: '第一题答案1' }, { item: '第一题答案2' }, { item: '第一题答案3' }, { item: '第一题答案4' }] }, { id: 2, title: "第二题", answers: [{ item: '第二题答案1' }, { item: '第二题答案2' }, { item: '第二题答案3' }, { item: '第二题答案4' }] }, { id: 3, title: "第三题", answers: [{ item: '第三题答案1' }, { item: '第三题答案2' }, { item: '第三题答案3' }, { item: '第三题答案4' }] }, { id: 4, title: "第四题", answers: [{ item: '第四题答案1' }, { item: '第四题答案2' }, { item: '第四题答案3' }, { item: '第四题答案4' }] }, { id: 5, title: "第五题", answers: [{ item: '第五题答案1' }, { item: '第五题答案2' }, { item: '第五题答案3' }, { item: '第五题答案4' }] }, { id: 6, title: "第六题", answers: [{ item: '第六题答案1' }, { item: '第六题答案2' }, { item: '第六题答案3' }, { item: '第六题答案4' }] }], subjectList: [{ 'id': '1', 'title': '七年级英语' }, { 'id': '2', 'title': '八年级英语' }, { 'id': '3', 'title': '九年级英语' }, { 'id': '4', 'title': '高一英语' }, { 'id': '5', 'title': '高二英语' }, { 'id': '6', 'title': '高三英语' }], chapterList: [{ 'id': '1', 'title': '第一章' }, { 'id': '2', 'title': '第二章' }, { 'id': '3', 'title': '第三章' }, { 'id': '4', 'title': '第四章' }, { 'id': '5', 'title': '第五章' }, { 'id': '6', 'title': '第六章' }], outlineList: [{ 'id': '1', 'title': '第一节' }, { 'id': '2', 'title': '第二节' }, { 'id': '3', 'title': '第三节' }, { 'id': '4', 'title': '第四节' }, { 'id': '5', 'title': '第五节' }, { 'id': '6', 'title': '第六节' }] });
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

  checkboxChange: function(el) {
    this.setData({ selectedQuestions: el.detail.value});
  },

  add: function(el) {
    var checkeds = this.data.selectedQuestions;
    for (var idx in checkeds) {
      console.log(checkeds[idx]);
    }
    wx.showToast({
      title: '添加试题成功',
      icon: 'success',
      duration: 2000,
      success: function() {
        setTimeout(function() {
          wx.navigateBack({
            delta: -1
          });
        }, 1800);
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
