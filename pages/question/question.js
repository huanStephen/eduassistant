const App = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabTxt: ['科目', '章节', '大纲'],//分类
    answerTxt: ['A', 'B', 'C', 'D', 'E'],
    tab: [true, true, true],
    questionList: [],
    subjectList: [],
    chapterList: [],
    outlineList: [],
    modalHidden: true,
    questionList: [],
    ifName: false,
    modalHidden: true,
    id: 0,
    sort: 0,
    name: '',
    description: '',
    currPage: 1,
    pageSize: 10,
    subject_id: 0,
    chapter_id: 0,
    outline_id: 0
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

  /**
   * 更新试题
   */
  openUpdateWin: function (el) {
    this.setData({ modalHidden: false, id: el.currentTarget.dataset.id, sort: el.currentTarget.dataset.sort, name: el.currentTarget.dataset.name, description: el.currentTarget.dataset.description });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.init();
  },

  /**
   * 初始化数据
   */
  init: function () {
    wx.request({
      url: 'http://localhost:8080/wx/subject/getSubjects?currPage=1&pageSize=100',
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
        tabTxt[1] = '章节';
        tabTxt[2] = '大纲';
        wx.request({
          url: 'http://localhost:8080/wx/chapter/getChapters?subjectId=' + id + '&currPage=1&pageSize=100',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            var result = res.data;
            if (1 == result.status) {
              self.setData({
                tab: [true, true, true],
                tabTxt: tabTxt,
                subject_id: id,
                chapter_id: 0,
                outline_id: 0,
                chapterList: result.data.list,
                outlineList: []
              });
              that.getDataList();
            } else {
              wx.showToast({
                title: result.msg,
                icon: 'none',
                duration: 1000
              });
            }
          }
        });
        break;
      case '1':
        tabTxt[1] = txt;
        tabTxt[2] = '大纲';
        wx.request({
          url: 'http://localhost:8080/wx/outline/getOutlines?chapterId=' + id + '&currPage=1&pageSize=100',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            var result = res.data;
            if (1 == result.status) {
              self.setData({
                tab: [true, true, true],
                tabTxt: tabTxt,
                chapter_id: id,
                outline_id: 0,
                outlineList: result.data.list
              });
              that.getDataList();
            } else {
              wx.showToast({
                title: result.msg,
                icon: 'none',
                duration: 1000
              });
            }
          }
        });
        break;
      case '2':
        tabTxt[2] = txt;
        self.setData({
          tab: [true, true, true],
          tabTxt: tabTxt,
          outline_id: id
        });
        that.getDataList();
        break;
    }
  },

  getDataList: function () {
    wx.request({
      url: 'http://localhost:8080/wx/question/getChoiceQuestions?subjectId=' + that.data.subject_id + '&chapterId=' + that.data.chapter_id + '&outlineId=' + that.data.outline_id + '&currPage=' + that.data.currPage + '&pageSize=' + that.data.pageSize,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var result = res.data;
        if (1 == result.status) {
          var list = result.data.list;
          if (null == list) {
            list = [];
          }
          that.setData({
            questionList: list
          });
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
   * 进入试题映射
   */
  entry: function(el) {
    wx.navigateTo({
      url: '../questionmapping/questionmapping?questionId=' + el.currentTarget.dataset.id
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
    var page = this.data.currPage + 1;
    var arr = this.data.questionList;
    wx.request({
      url: 'http://localhost:8080/wx/question/getChoiceQuestions?subjectId=' + that.data.subject_id + '&chapterId=' + that.data.chapter_id + '&outlineId=' + that.data.outline_id + '&currPage=' + that.data.currPage + '&pageSize=' + that.data.pageSize,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var result = res.data;
        if (1 == result.status) {
          arr = arr.concat(result.data.list);
          that.setData({ questionList: arr, currPage: page });
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
