import { MiniProgramFile } from '../types';

export const wxmlFiles: MiniProgramFile[] = [
  {
    name: "app.json",
    path: "app.json",
    type: "json",
    content: `{
  "pages": [
    "pages/discover/discover",
    "pages/analytics/analytics",
    "pages/ailab/ailab",
    "pages/mine/mine",
    "pages/profile/profile"
  ],
  "window": {
    "navigationBarBackgroundColor": "#f7f9fc",
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "达人情报局",
    "backgroundColor": "#f7f9fc",
    "backgroundTextStyle": "light"
  },
  "tabBar": {
    "color": "#454652",
    "selectedColor": "#1a237e",
    "backgroundColor": "#ffffff",
    "borderStyle": "white",
    "list": [
      {
        "pagePath": "pages/discover/discover",
        "text": "探索",
        "iconPath": "assets/explore.png",
        "selectedIconPath": "assets/explore_sel.png"
      },
      {
        "pagePath": "pages/analytics/analytics",
        "text": "分析",
        "iconPath": "assets/analytics.png",
        "selectedIconPath": "assets/analytics_sel.png"
      },
      {
        "pagePath": "pages/ailab/ailab",
        "text": "AI实验室",
        "iconPath": "assets/psychology.png",
        "selectedIconPath": "assets/psychology_sel.png"
      },
      {
        "pagePath": "pages/mine/mine",
        "text": "我的",
        "iconPath": "assets/mine.png",
        "selectedIconPath": "assets/mine_sel.png"
      }
    ]
  },
  "style": "v2",
  "sitemapLocation": "sitemap.json"
}`
  },
  {
    name: "discover.wxml",
    path: "pages/discover/discover.wxml",
    type: "wxml",
    content: `<!-- pages/discover/discover.wxml -->
<navigation-bar title="达人情报局" back="{{false}}" background="#f7f9fc"></navigation-bar>

<scroll-view class="container" scroll-y="true" refresher-enabled="true" refresher-triggered="{{isRefreshing}}" bindrefresherrefresh="onPullDownRefresh">
  <!-- 搜索与平台切换 -->
  <view class="search-section">
    <view class="search-bar">
      <icon class="search-icon" type="search" size="18"></icon>
      <input class="search-input" placeholder="搜索达人、领域或 AI 搜索" bindinput="onSearchInput" value="{{searchQuery}}" />
      <button class="ai-btn" bindtap="triggerAISearch">
        <text class="material-icon">✨</text> Mini AI
      </button>
    </view>

    <!-- 平台切换器 -->
    <view class="platform-tabs">
      <view class="tab {{platform === 'Douyin' ? 'active' : ''}}" data-platform="Douyin" bindtap="switchPlatform">Douyin</view>
      <view class="tab {{platform === 'Xiaohongshu' ? 'active' : ''}}" data-platform="Xiaohongshu" bindtap="switchPlatform">Xiaohongshu</view>
    </view>
  </view>

  <!-- AI 潜力新星预测 -->
  <view class="spotlight-card" bindtap="goToProfile" data-id="LunaTech">
    <view class="card-header">
      <text class="header-icon">🧭</text>
      <text class="header-title">AI潜力新星预测</text>
    </view>
    <view class="spotlight-content">
      <image class="avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzjeej0CI_4b9zsTHPubk043Lz0jcAxUtL0N5MOkcF03gvg7X9_6Gs81wVaqFf5l84l7qle3IjLbOC6QwnnUYQUweIUy-38hNkvWa00cfRenyr5K-V_XZYg10YbEA-OPja5rh1EOHoY1yA2DYzlu0EiSKTn4yyuhP2dyO-aaLopO11jgAg0Xb0OSNm6WSLWDcemAr_c1te_jwTMY-F63dLfcgI6CRqyJ3GVowe35JG65Vx0ohWBPtBc1tqRPmc-ZgtgVgIcfSBin4" mode="aspectFill"></image>
      <view class="info">
        <text class="creator-name">@LunaTech</text>
        <text class="creator-sub">Tech & Gadgets · 数码科技</text>
      </view>
      <view class="growth-stats">
        <text class="percentage">+84%</text>
        <text class="growth-label">环比增长</text>
      </view>
    </view>
    <view class="card-footer">
      <text class="badge">高高互动</text>
      <text class="badge primary-badge">上升赛道</text>
    </view>
  </view>

  <!-- 地区热门达人分布热力图 -->
  <view class="region-heatmap">
    <view class="card-header">
      <text class="header-icon">🗺️</text>
      <text class="header-title">地域达人分布热力地图</text>
    </view>
    <view class="map-visual">
      <!-- 渲染微信小程序底层热力地图拓扑图 -->
      <canvas canvas-id="heatmapCanvas" style="width: 100%; height: 100%;" />
    </view>
  </view>

  <!-- 热门领域 -->
  <view class="category-card">
    <view class="category-header">
      <view class="flex-row">
        <text class="header-icon">🔥</text>
        <text class="header-title">热门领域</text>
      </view>
      <text class="more-link">查看全部</text>
    </view>
    
    <view class="category-list">
      <block wx:for="{{categories}}" wx:key="name">
        <view class="category-item">
          <view class="left-cell">
            <text class="cate-icon">{{item.icon}}</text>
            <text class="cate-name">{{item.name}}</text>
          </view>
          <text class="cate-heat">热度: {{item.heat}}</text>
        </view>
      </block>
    </view>
  </view>

  <!-- 实时热度榜 -->
  <view class="rank-section">
    <view class="rank-header">
      <view>
        <text class="rank-title">实时热度榜</text>
        <text class="rank-sub">达人实时增长势头监控</text>
      </view>
      <image class="filter-icon" src="/assets/tune.png"></image>
    </view>

    <view class="rank-list">
      <block wx:for="{{rankList}}" wx:key="id">
        <view class="rank-row" bindtap="goToProfile" data-item="{{item}}">
          <text class="rank-no">{{index + 1}}</text>
          <image class="rank-avatar" src="{{item.avatar}}" mode="aspectFill"></image>
          <view class="rank-info">
            <text class="rank-name">{{item.name}}</text>
            <text class="rank-category">{{item.category}}</text>
          </view>
          <view class="rank-right">
            <text class="rank-followers">{{item.followers}}</text>
            <text class="rank-trend">📈 {{item.growth}}</text>
          </view>
        </view>
      </block>
    </view>
  </view>
</scroll-view>`
  },
  {
    name: "discover.js",
    path: "pages/discover/discover.js",
    type: "js",
    content: `// pages/discover/discover.js
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
    
    // 模拟调用后台 API
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
})`
  },
  {
    name: "discover.wxss",
    path: "pages/discover/discover.wxss",
    type: "wxss",
    content: `/* pages/discover/discover.wxss */
.container {
  display: flex;
  flex-direction: column;
  background-color: #f7f9fc;
  height: 100vh;
  box-sizing: border-box;
}

.search-section {
  padding: 16rpx 32rpx;
  background-color: #f7f9fc;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 12rpx 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  margin-left: 12rpx;
}

.ai-btn {
  background: linear-gradient(135deg, #1a237e, #0d47a1);
  color: #ffffff;
  font-size: 24rpx;
  padding: 12rpx 24rpx;
  border-radius: 16rpx;
  line-height: 1.5;
}

.platform-tabs {
  display: flex;
  background-color: #eceef1;
  border-radius: 20rpx;
  padding: 6rpx;
  margin-top: 16rpx;
}

.tab {
  flex: 1;
  text-align: center;
  font-size: 26rpx;
  padding: 12rpx 0;
  color: #454652;
  border-radius: 16rpx;
  transition: all 0.2s;
}

.tab.active {
  background-color: #ffffff;
  color: #1a237e;
  font-weight: bold;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.08);
}

.spotlight-card {
  margin: 24rpx 32rpx;
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(1, 18, 85, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
}

.header-title {
  font-size: 26rpx;
  font-weight: bold;
  color: #191c1e;
  margin-left: 8rpx;
}

.spotlight-content {
  display: flex;
  align-items: center;
}

.avatar {
  width: 110rpx;
  height: 110rpx;
  border-radius: 50%;
  border: 4rpx solid #bdc2ff;
}

.info {
  flex: 1;
  margin-left: 20rpx;
}

.creator-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #191c1e;
  display: block;
}

.creator-sub {
  font-size: 24rpx;
  color: #767683;
}

.growth-stats {
  text-align: right;
}

.percentage {
  font-size: 38rpx;
  font-weight: bold;
  color: #006876;
  display: block;
}

.growth-label {
  font-size: 20rpx;
  color: #767683;
}

.badge {
  font-size: 22rpx;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
  background-color: #eceef1;
  color: #454652;
  margin-right: 12rpx;
}

.primary-badge {
  background-color: #dee1ff;
  color: #1a237e;
}

.region-heatmap {
  margin: 24rpx 32rpx;
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(1, 18, 85, 0.08);
}

.map-visual {
  height: 320rpx;
  background-color: #f7f9fc;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
`
  },
  {
    name: "profile.wxml",
    path: "pages/profile/profile.wxml",
    type: "wxml",
    content: `<!-- pages/profile/profile.wxml -->
<navigation-bar title="达人详情" back="{{true}}"></navigation-bar>

<scroll-view class="container" scroll-y="true">
  <!-- 头部档案 -->
  <view class="profile-header">
    <view class="avatar-ring">
      <image class="avatar" src="{{profile.avatar}}" mode="aspectFill"></image>
    </view>
    <text class="name">{{profile.name}}</text>
    <text class="handle">{{profile.handle}} · {{profile.category}}</text>
    
    <view class="tags">
      <text class="tag xhs">{{profile.platform}}</text>
      <text class="tag dy">官方分析</text>
    </view>

    <!-- 关键数据 KPI -->
    <view class="kpi-row">
      <view class="kpi-item">
        <text class="kpi-val">{{profile.followers}}</text>
        <text class="kpi-label">粉丝数</text>
      </view>
      <view class="kpi-item">
        <text class="kpi-val">{{profile.engagementRate}}</text>
        <text class="kpi-label">互动率</text>
      </view>
      <view class="kpi-item">
        <text class="kpi-val">{{profile.avgLikes}}</text>
        <text class="kpi-label">平均点赞</text>
      </view>
    </view>
  </view>

  <!-- 品牌契合量化 & AI 潜力评估 (双卡片Grid) -->
  <view class="grid-section">
    <view class="fit-card">
      <text class="card-title">品牌契合度</text>
      <view class="score-container">
        <text class="big-score">{{profile.brandFitScore}}</text>
        <text class="score-sub">{{profile.brandMatchLevel}}</text>
      </view>
    </view>

    <view class="potential-card">
      <text class="card-title">AI潜力评估</text>
      <view class="progress-list">
        <view class="prog-item">
          <text class="prog-label">爆火概率: {{profile.aiPotential.viralProbability}}</text>
          <progress percent="{{profile.aiPotential.viralScore}}" stroke-width="4" activeColor="#1a237e" backgroundColor="#eceef1" />
        </view>
        <view class="prog-item">
          <text class="prog-label">转化效率: {{profile.aiPotential.conversionRate}}</text>
          <progress percent="{{profile.aiPotential.conversionScore}}" stroke-width="4" activeColor="#006876" backgroundColor="#eceef1" />
        </view>
        <view class="prog-item">
          <text class="prog-label">忠诚度: 稳定</text>
          <progress percent="75" stroke-width="4" activeColor="#b9c3ff" backgroundColor="#eceef1" />
        </view>
      </view>
    </view>
  </view>

  <!-- 流量趋势 -->
  <view class="trend-section">
    <view class="section-title-row">
      <text class="section-title">流量趋势 (30天)</text>
      <text class="section-sub">曝光量</text>
    </view>
    <!-- 模拟柱状图 -->
    <view class="bar-chart">
      <view class="bar-item" wx:for="{{profile.trafficTrend}}" wx:key="date" style="height: {{item.exposure}}%"></view>
    </view>
    <view class="chart-labels">
      <text>10月1日</text>
      <text>10月15日</text>
      <text>10月30日</text>
    </view>
  </view>

  <!-- 粉丝画像 -->
  <view class="demographics-section">
    <text class="section-title">粉丝画像</text>
    <view class="demo-grid">
      <!-- 性别分布 -->
      <view class="gender-block">
        <text class="sub-title">性别分布</text>
        <view class="pie-sim">
          <view class="color-dot xhs-color"></view>
          <text>女性 {{profile.demographics.femalePercentage}}%</text>
        </view>
        <view class="pie-sim">
          <view class="color-dot dy-color"></view>
          <text>男性 {{profile.demographics.malePercentage}}%</text>
        </view>
      </view>

      <!-- 年龄分布 -->
      <view class="age-block">
        <text class="sub-title">年龄分布</text>
        <view class="age-row">
          <text class="age-range">18-24</text>
          <progress percent="{{profile.demographics.age18to24}}" stroke-width="3" activeColor="#b9c3ff" class="age-percent-bar" />
          <text class="age-num">{{profile.demographics.age18to24}}%</text>
        </view>
        <view class="age-row">
          <text class="age-range">25-34</text>
          <progress percent="{{profile.demographics.age25to34}}" stroke-width="3" activeColor="#1a237e" class="age-percent-bar" />
          <text class="age-num">{{profile.demographics.age25to34}}%</text>
        </view>
        <view class="age-row">
          <text class="age-range">35-44</text>
          <progress percent="{{profile.demographics.age35to44}}" stroke-width="3" activeColor="#b9c3ff" class="age-percent-bar" />
          <text class="age-num">{{profile.demographics.age35to44}}%</text>
        </view>
      </view>
    </view>

    <!-- 兴趣偏好雷达图 -->
    <view class="interests-block" style="margin-top: 20rpx;">
      <text class="sub-title">兴趣偏好 (行业分布雷达)</text>
      <radar-chart data="{{profile.interests}}" />
    </view>
  </view>
</scroll-view>`
  }
];
