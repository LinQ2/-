// pages/ailab/ailab.js
Page({
  data: {
    titleInput: '',
    predictionResult: null
  },

  onTitleInput(e) {
    this.setData({ titleInput: e.detail.value });
  },

  predictTitle() {
    if (!this.data.titleInput) {
      wx.showToast({ title: '请输入标题', icon: 'error' });
      return;
    }

    wx.showLoading({ title: 'AI 爆款推算中...' });
    
    wx.request({
      url: 'https://api.creativelab.com/predict-title',
      method: 'POST',
      data: { title: this.data.titleInput, category: '数码' },
      success: (res) => {
        wx.hideLoading();
        if (res.data) {
          this.setData({ predictionResult: res.data });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '推测失败', icon: 'none' });
      }
    });
  }
})
