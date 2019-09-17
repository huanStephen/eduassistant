const App = getApp();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    answerPrefix: ['A', 'B', 'C', 'D', 'E'],
    questionId: 0,
    modalHidden: true,
    title: '',
    answerMap: {},
    answerIndex: 0,
    mappingList: [],
    multiArray: [],//二维数组，长度是多少是几列
    multiIndex: [0, 0, 0],
    subjectMap: {},
    chapterMap: {},
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
  openAddWin: function(el) {
    var mutli = that.data.multiArray;
    mutli[1] = [];
    mutli[2] = [];
    this.setData({ modalHidden: false, modalStatusTxt: '添加', modalStatus: 1, multiArray: mutli, multiIndex: [0, 0, 0]});
  },
  
  /**
   * 添加/更新映射
   */
  confirmChange: function () {
    var subData = {
      subjectId: this.data.multiArray[0][this.data.multiIndex[0]].id,
      chapterId: this.data.multiArray[1][this.data.multiIndex[1]].id,
      outlineId: this.data.multiArray[2][this.data.multiIndex[2]].id,
      questionType: 1,
      questionId: this.data.questionId,
      weight: this.data.weight
    }
    // 添加的情况
    if (1 == this.data.modalStatus) {
      wx.request({
        url: 'https://www.infuturedu.com/wx/question/addChoiceQuestionMapping',
        data: subData,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var result = res.data;
          if (1 == result.status) {
            wx.showToast({
              title: "试题映射添加成功！",
              icon: 'success',
              duration: 2000
            });
            that.initMappings();
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
        url: 'https://www.infuturedu.com/wx/question/updateChoiceQuestionMapping',
        data: subData,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var result = res.data;
          if (1 == result.status) {
            wx.showToast({
              title: "试题映射更新成功！",
              icon: 'success',
              duration: 2000
            });
            that.initMappings();
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

  bingWeight: function (el) {
    this.setData({ weight: el.detail.value})
  },

  cleanModal: function() {
    this.setData({weight: 0})
  },

  /**
   * 更新映射
   */
  openUpdateWin: function (el) {
    that.updatePicker(el.currentTarget.dataset.subject, el.currentTarget.dataset.chapter, el.currentTarget.dataset.outline);
    that.setData({ modalHidden: false, modalStatusTxt: '更新', modalStatus: 2, id: el.currentTarget.dataset.id, weight: el.currentTarget.dataset.weight});
  },

  updatePicker: function (subjectElId, chapterElId, outlineElId) {
    var subjectIdx = -1, chapterIdx = -1, outlineIdx = -1;
    var subjectList = that.data.multiArray[0];
    var index = that.data.multiIndex;
    for (var i in subjectList) {
      if (subjectElId == subjectList[i].id) {
        subjectIdx = i;
        wx.request({
          url: 'https://www.infuturedu.com/wx/chapter/getChapters?subjectId=' + subjectElId + '&currPage=1&pageSize=100',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            var result = res.data;
            if (1 == result.status) {
              var multi = that.data.multiArray;
              var chapters = new Array();
              var list = result.data.list;
              for (var j in list) {
                chapters.push({ id: list[j].id, name: list[j].title });
                if (chapterElId = list[j].id) {
                  chapterIdx = j
                }
              }
              multi[1] = chapters;
              multi[2] = [];
              index[1] = chapterIdx;
              that.setData({ multiArray: multi, multiIndex: index});
              if (-1 != chapterIdx) {
                wx.request({
                  url: 'https://www.infuturedu.com/wx/outline/getOutlines?chapterId=' + chapterElId + '&currPage=1&pageSize=100',
                  header: {
                    'content-type': 'application/json'
                  },
                  success: function (res) {
                    var result = res.data;
                    if (1 == result.status) {
                      multi = that.data.multiArray;
                      var outlines = new Array();
                      var list = result.data.list;
                      for (var k in list) {
                        outlines.push({ id: list[k].id, name: list[k].title });
                        if (outlineIdx = list[k].id) {
                          outlineIdx = k
                        }
                      }
                      multi[2] = outlines;
                      index[2] = outlineIdx;
                      that.setData({ multiArray: multi, multiIndex: index });
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
      }
    }
    index[0] = subjectIdx;
    this.setData({ multiIndex: index });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.setData({ questionId: options.questionId }); 
    this.initQuestion();
    this.initMappings();
    this.initPicker();
  },

  /**
   * 初始化试题数据
   */
  initQuestion: function() {
    wx.request({
      url: 'https://www.infuturedu.com/wx/question/getChoiceQuestion?questionId=' + that.data.questionId,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var result = res.data;
        if (1 == result.status) {
          var answer = [{ id: 0, name: '未选择'}];
          var idx = 0;
          var val = 0;
          var txt = '未选择';
          var map = {0: 0};
          for (var i in result.data.options) {
            answer.push({ id: result.data.options[i].id, name: that.data.answerPrefix[idx] + '. ' + result.data.options[i].answer})
            map[result.data.options[i].id] = idx + 1;
            if (result.data.answer == result.data.options[i].id) {
              val = result.data.answer;
              txt = that.data.answerPrefix[idx] + '. ' + result.data.options[i].answer;
            }
            idx ++;
          }
          that.setData({ title: result.data.title, options: result.data.options, answers: answer, answerIndex: map[val], answerTxt: txt, answerMap: map});
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

  bindAnswerChange: function(el) {
    var value = el.detail.value;
    wx.request({
      url: 'http://localhost:8001/wx/question/updateQuestionAnswer',
      data: { questionId: that.data.questionId, answer: that.data.answers[value[0]].id },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var result = res.data;
        if (1 == result.status) {
          wx.showToast({
            title: "答案修改成功！",
            icon: 'success',
            duration: 2000
          });
          that.setData({ answerIndex: value[0] });
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
   * 初始化映射
   */
  initMappings: function() {
    wx.request({
      url: 'https://www.infuturedu.com/wx/question/getChoiceQuestionMappings?questionId=' + that.data.questionId,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var result = res.data;
        if (1 == result.status) {
          var list = result.data;
          for (var i in list) {
            if (null == list[i].subjectName) {
              list[i].subjectName = '未分类';
            }
            if (null == list[i].chapterName) {
              list[i].chapterName = '未分类';
            }
            if (null == list[i].outlineName) {
              list[i].outlineName = '未分类';
            }
          }
          that.setData({ mappingList: list });
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
   * 初始化Picker
   */
  initPicker: function() {
    wx.request({
      url: 'https://www.infuturedu.com/wx/subject/getSubjects?currPage=1&pageSize=100',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var result = res.data;
        if (1 == result.status) {
          var multi = [[{id: 0, name: '未分类'}], [], []];
          multi[0] = multi[0].concat(result.data.list);
          var i = 0;
          var map = {};
          for (var idx in multi[0]) {
            map[i] = multi[0][idx].id;
            i ++;
          }
          that.setData({ multiArray: multi, subjectMap: map });
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
        if (res.confirm) {
          wx.request({
            url: 'https://www.infuturedu.com/wx/question/delChoiceQuestionMapping',
            data: { mappingId: el.currentTarget.dataset.id },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              var result = res.data;
              if (1 == result.status) {
                wx.showToast({
                  title: "映射删除成功！",
                  icon: 'success',
                  duration: 2000
                });
                that.initMappings();
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
      }
    }); 
  },

  bindMultiPickerChange: function(el) {
    var value = el.detail.value;
    this.setData({ multiIndex: [value[0], value[1], value[2]]});
  },

  bindMultiPickerColumnChange: function(el) {
    var value = el.detail.value;
    switch (el.detail.column) {
      case 0:
        wx.request({
          url: 'https://www.infuturedu.com/wx/chapter/getChapters?subjectId=' + that.data.subjectMap[value] + '&currPage=1&pageSize=100',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            var result = res.data;
            if (1 == result.status) {
              var multi = that.data.multiArray;
              var chapters = new Array();
              var list = result.data.list;
              var map = {};
              for (var i in list) {
                chapters.push({id: list[i].id, name: list[i].title});
                map[i] = list[i].id;
              }
              multi[1] = chapters;
              multi[2] = [];
              that.setData({ multiArray: multi, chapterMap: map});
              if (0 != list.length) {
                wx.request({
                  url: 'https://www.infuturedu.com/wx/outline/getOutlines?chapterId=' + list[0].id + '&currPage=1&pageSize=100',
                  header: {
                    'content-type': 'application/json'
                  },
                  success: function (res) {
                    var result = res.data;
                    if (1 == result.status) {
                      multi = that.data.multiArray;
                      var outlines = new Array();
                      var list = result.data.list;
                      for (var i in list) {
                        outlines.push({ id: list[i].id, name: list[i].title });
                      }
                      multi[2] = outlines;
                      that.setData({ multiArray: multi });
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
      case 1:
        if ('{}' != JSON.stringify(that.data.chapterMap)) {
          wx.request({
            url: 'https://www.infuturedu.com/wx/outline/getOutlines?chapterId=' + that.data.chapterMap[value] + '&currPage=1&pageSize=100',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              var result = res.data;
              if (1 == result.status) {
                var multi = that.data.multiArray;
                var outlines = new Array();
                var list = result.data.list;
                for (var i in list) {
                  outlines.push({ id: list[i].id, name: list[i].title });
                }
                multi[2] = outlines;
                that.setData({ multiArray: multi });
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
        break;
      default:
        break;
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
