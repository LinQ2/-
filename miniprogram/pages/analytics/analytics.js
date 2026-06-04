// pages/analytics/analytics.js
Page({
  data: {
    categories: ["美妆个护", "数码科技", "时尚穿搭", "美食探店", "萌宠逗趣"],
    categoryIdx: 0,
    metrics: {
      activeCreators: "14,830+",
      avgEngagement: "8.4%"
    },
    brandExposure: [
      { name: "新晋潮牌推广", exposure: 82 },
      { name: "老字号跨界", exposure: 65 },
      { name: "国际奢品首发", exposure: 42 }
    ]
  },

  onCategorySelect(e) {
    const idx = parseInt(e.detail.value);
    this.setData({ categoryIdx: idx });
    
    // Simulating database refetch with different analytics metrics
    if (idx === 1) { // Digital
      this.setData({
        metrics: { activeCreators: "8,920+", avgEngagement: "11.2%" },
        brandExposure: [
          { name: "硬核处理器评测", exposure: 95 },
          { name: "智能折叠屏开箱", exposure: 78 },
          { name: "千元显卡推荐", exposure: 55 }
        ]
      });
    } else {
      this.setData({
        metrics: { activeCreators: "14,830+", avgEngagement: "8.4%" },
        brandExposure: [
          { name: "新晋潮牌推广", exposure: 82 },
          { name: "老字号跨界", exposure: 65 },
          { name: "国际奢品首发", exposure: 42 }
        ]
      });
    }
  }
})
