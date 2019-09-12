Page({
  data: {
    hidden: true,
    img: ''
  },
  onLoad: function () { },

  chooseWxImage: function (type) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
        that.setData({
          // tempFilePath可以作为img标签的src属性显示图片
          img: res.tempFilePaths[0],
          hidden: false
        })
      }
    })
  },

  chooseimage: function () {
    var that = this;
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
    })

  },
})