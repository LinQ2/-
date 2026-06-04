// pages/profile/profile.js
Page({
  data: {
    profile: {
      id: 'LunaTech',
      name: 'LunaTech',
      handle: '@lunatech_official',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzjeej0CI_4b9zsTHPubk043Lz0jcAxUtL0N5MOkcF03gvg7X9_6Gs81wVaqFf5l84l7qle3IjLbOC6QwnnUYQUweIUy-38hNkvWa00cfRenyr5K-V_XZYg10YbEA-OPja5rh1EOHoY1yA2DYzlu0EiSKTn4yyuhP2dyO-aaLopO11jgAg0Xb0OSNm6WSLWDcemAr_c1te_jwTMY-F63dLfcgI6CRqyJ3GVowe35JG65Vx0ohWBPtBc1tqRPmc-ZgtgVgIcfSBin4',
      category: '数码科技',
      platform: 'Douyin',
      followers: '850K',
      engagementRate: '14.2%',
      avgLikes: '28K',
      brandFitScore: 92,
      brandMatchLevel: '极佳匹配',
      aiPotential: {
        viralProbability: '高',
        viralScore: 88,
        conversionRate: '中',
        conversionScore: 78,
        loyalty: '稳定',
        loyaltyScore: 84
      },
      demographics: {
        femalePercentage: 42,
        malePercentage: 58,
        age18to24: 35,
        age25to34: 45,
        age35to44: 20
      },
      trafficTrend: [
        { date: "10-01", exposure: 60 },
        { date: "10-15", exposure: 85 },
        { date: "10-30", exposure: 95 }
      ],
      interests: [
        { name: "极客数码", value: 92 },
        { name: "智能家居", value: 85 },
        { name: "硬核配件", value: 78 },
        { name: "品质好物", value: 65 },
        { name: "科技前沿", value: 58 }
      ]
    }
  },

  onLoad(options) {
    if (options.data) {
      try {
        const parsedProfile = JSON.parse(decodeURIComponent(options.data));
        this.setData({ profile: parsedProfile });
      } catch (e) {
        console.error("加载达人数据出错:", e);
      }
    } else if (options.name) {
      wx.showLoading({ title: '拉取情报中...' });
      wx.request({
        url: 'https://api.creativelab.com/analyze',
        method: 'POST',
        data: { query: options.name, platform: 'Douyin' },
        success: (res) => {
          wx.hideLoading();
          if (res.data) {
            this.setData({ profile: res.data });
          }
        },
        fail: () => {
          wx.hideLoading();
          wx.showToast({ title: '无法获取数据', icon: 'error' });
        }
      });
    }
  }
})
