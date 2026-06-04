// pages/discover/discover.js
Page({
  data: {
    platform: 'Douyin',
    searchQuery: '',
    isRefreshing: false,
    categories: [
      { name: '极简美妆', heat: '1.2M', icon: '💄' },
      { name: 'AI生产力工具', heat: '850K', icon: '💻' },
      { name: '可持续时尚', heat: '620K', icon: '🎽' }
    ],
    rankList: [
      { id: '1', name: 'David Codes', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150', category: '数码测评', followers: '2.4M', growth: '12.5%' },
      { id: '2', name: 'Style By Sarah', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150', category: '时尚生活', followers: '1.8M', growth: '8.2%' }
    ]
  },

  switchPlatform(e) {
    const platform = e.currentTarget.dataset.platform;
    this.setData({ platform });
    wx.showToast({
      title: '切换至 ' + platform,
      icon: 'success'
    });
  },

  onSearchInput(e) {
    this.setData({ searchQuery: e.detail.value });
  },

  triggerAISearch() {
    if (!this.data.searchQuery) {
      wx.showToast({ title: '请输入搜索词', icon: 'error' });
      return;
    }
    wx.showLoading({ title: 'AI 搜索分析中...' });
    
    // 调用后台 API 进行大模型 Grounding 达人分析
    wx.request({
      url: 'https://api.creativelab.com/analyze',
      method: 'POST',
      data: { query: this.data.searchQuery, platform: this.data.platform },
      success: (res) => {
        wx.hideLoading();
        wx.navigateTo({
          url: '/pages/profile/profile?data=' + encodeURIComponent(JSON.stringify(res.data))
        });
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '分析失败', icon: 'none' });
      }
    });
  },

  onPullDownRefresh() {
    this.setData({ isRefreshing: true });
    setTimeout(() => {
      this.setData({
        isRefreshing: false,
        'rankList[0].followers': '2.5M',
        'rankList[0].growth': '14.2%'
      });
      wx.showToast({ title: '排行榜已实时刷新' });
    }, 1500);
  },

  goToProfile(e) {
    const item = e.currentTarget.dataset.item || { name: 'Elena Chen' };
    wx.navigateTo({
      url: '/pages/profile/profile?name=' + item.name
    });
  }
})
