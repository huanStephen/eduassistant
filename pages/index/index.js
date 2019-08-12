//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userList: [],
    imgs: []
  },
  //事件处理函数
  //我要积分页面 跳转 这个要做出判断是否登录 没有登录跳转其他的页面
  bindSubject: function (event){
    var that = this;
    //获得当前的本地登录信息
    var key = wx.getStorageSync('key');

    // if(key === "login:ok") {
    //   wx.switchTab({
    //     url: '../qrcode/qrcode'
    //   })
    // }else {
    //   wx.navigateTo({
    //     url: '../qrcodenull/qrcodenull'
    //   })
    // }

    wx.navigateTo({
      url: '../subject/subject'
    })

  },

  bindClass: function (){
    wx.navigateTo({
      url: '../class/class'
    })
  },
  bindQuestion: function (){
    wx.navigateTo({
      url: '../question/question'
    })
  },
  bindExamPaper: function () {
    wx.navigateTo({
      url: '../exampaper/exampaper'
    })
  },

  bindDemo: function() {
    wx.navigateTo({
      url: '../demo/demo'
    })
  },

  onLoad: function () {
    // console.log('onLoad')
    // var that = this
    // //调用应用实例的方法获取全局数据
    // app.getUserInfo(function(userInfo){
    //   //更新数据
    //   that.setData({
    //     userInfo:userInfo
    //   })
    // })
    var that = this;
    // wx.request({
    //   url:"https://www.easy-mock.com/mock/595f3f139adc231f357b0615/McDonald/list",
    //   method: 'GET',
    //   success: function(res) {
    //     that.setData({
    //       userList: res.data.data,
    //       imgs: res.data.image
    //     })
    //   }
    // });
    this.setData({ imgs: [{ url: '/images/1coupon_one.png' }, { url: '/images/1coupon_two.png' }, { url: '/images/1coupon_three.png' }]})
  }
})
