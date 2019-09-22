var that;
Page({
  data: {
    hidden: true,
    img: '',
    multiArray: [],//二维数组，长度是多少是几列
    multiIndex: [0, 0],
    classMap: {},
    studentMap: {},
    exampapers: [],
    exampaperIndex: 0,
    exampaperMap: [],
    isDown: false,
    percent: 0
  },
  onLoad: function () {
    that = this;
    that.initPicker();
  },

  /**
   * 初始化Picker
   */
  initPicker: function () {
    wx.request({
      url: 'https://www.infuturedu.com/wx/class/getClasses?currPage=1&pageSize=100',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var result = res.data;
        if (1 == result.status) {
          var classList = new Array();
          classList.push({id: 0, name: '未选择'});
          for (var i in result.data.list) {
            classList.push({ id: result.data.list[i].id, name: result.data.list[i].name});
          }
          var multi = [classList, []];
          var i = 0;
          var map = {};
          for (var idx in multi[0]) {
            map[i] = multi[0][idx].id;
            i++;
          }
          that.setData({ multiArray: multi, classMap: map });
        } else {
          wx.showToast({
            title: result.msg,
            icon: 'none',
            duration: 1000
          });
        }
      }
    });

    wx.request({
      url: 'https://www.infuturedu.com/wx/exampaper/getExamPapers?currPage=1&pageSize=100',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var result = res.data;
        if (1 == result.status) {
          var exampaperList = new Array();
          exampaperList.push({ id: 0, name: '未选择' });
          var map = {};
          for (var i in result.data.list) {
            exampaperList.push({ id: result.data.list[i].id, name: result.data.list[i].name });
            map[i] = result.data.list[i].id;
          }
          that.setData({ exampapers: exampaperList, exampaperMap: map });
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

  chooseWxImage: function (type) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
        that.setData({
          // tempFilePath可以作为img标签的src属性显示图片
          img: res.tempFilePaths[0],
          hidden: false
        });
      }
    })
  },

  chooseimage: function () {
    var classId = that.data.multiArray[0][that.data.multiIndex[0]].id;
    var studentId = null;
    var student = that.data.multiArray[1][that.data.multiIndex[1]];
    var exampaperId = that.data.exampapers[that.data.exampaperIndex].id;
    if (undefined != student) {
      studentId = student.id;
    }
    if (0 == classId || null == studentId) {
      wx.showToast({
        title: '请选择学生！',
        icon: 'none',
        duration: 1000
      });
      return ;
    }
    if (0 == exampaperId) {
      wx.showToast({
        title: '请选择试卷！',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    wx.showActionSheet({
      itemList: ['拍照', '从相册中选择'],
      itemColor: "#a3a2a2",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('camera')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('album')
          }
        }
      }
    });
  },

  uploadAnswerSheet: function() {
    wx.uploadFile({
      url: 'https://www.infuturedu.com/wx/exampaper/uploadAnswerSheet',
      filePath: that.data.img,
      name: 'answersheet',
      header: {
        "Content-Type": "multipart/form-data"
      },
      success: function (res) {
        var result = JSON.parse(res.data);
        if (1 == result.status) {
          that.setData({isDown: true, percent: 100});
          // wx.showToast({
          //   title: '答题卡解析完毕！',
          //   icon: 'success',
          //   duration: 2000
          // });
        } else {
          wx.showToast({
            title: result.msg,
            icon: 'none',
            duration: 1000
          });
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '答题卡上传失败！',
          icon: 'none',
          duration: 1000
        });
      }
    });
  },

  bindMultiPickerChange: function (el) {
    var value = el.detail.value;
    this.setData({ multiIndex: [value[0], value[1]] });
  },

  bindMultiPickerColumnChange: function (el) {
    var value = el.detail.value;
    if (0 == el.detail.column) {
      if (0 == value) {
        var multi = that.data.multiArray;
        multi[1] = [];
        that.setData({ multiArray: multi});
        return ;
      }
      wx.request({
        url: 'https://www.infuturedu.com/wx/student/getStudents?classId=' + that.data.classMap[value] + '&currPage=1&pageSize=100',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var result = res.data;
          if (1 == result.status) {
            var multi = that.data.multiArray;
            var list = result.data.list;
            var map = {};
            for (var i in list) {
              map[i] = list[i].id;
            }
            multi[1] = result.data.list;
            that.setData({ multiArray: multi, studentMap: map });
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
  },

  bindExampaperChange: function (el) {
    var value = el.detail.value;
    that.setData({ exampaperIndex: value[0] });
  },

  processComplete: function() {
    wx.navigateTo({
      url: '../answerdetail/answerdetail'
    });
  }
})