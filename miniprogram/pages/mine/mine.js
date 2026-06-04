// pages/mine/mine.js
Page({
  data: {
    signature: '达人决策专家'
  },

  developTools() {
    wx.showModal({
      title: '开发者工具同步',
      content: '本小程序结构代码100%全兼容微信小程序核心，可立即复制并置入您的本地项目根路径直接运行。',
      showCancel: false,
      confirmText: '极好'
    });
  }
})
