export interface AIPotential {
  viralProbability: string; // e.g. "高"
  viralScore: number;       // e.g. 85
  conversionRate: string;   // e.g. "强"
  conversionScore: number; // e.g. 72
  loyalty: string;          // e.g. "稳定"
  loyaltyScore: number;     // e.g. 65
}

export interface Demographics {
  femalePercentage: number;
  malePercentage: number;
  age18to24: number;
  age25to34: number;
  age35to44: number;
  ageOthers?: number;
}

export interface TrafficDataPoint {
  date: string;
  exposure: number;
}

export interface InterestPreference {
  name: string;
  value: number; // e.g. 85
}

export interface InfluencerProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  category: string;
  platform: 'Douyin' | 'Xiaohongshu' | 'Bilibili' | 'Weibo';
  followers: string;       // e.g. "2.4M"
  engagementRate: string;  // e.g. "18%"
  avgLikes: string;        // e.g. "45K"
  brandFitScore: number;   // e.g. 94
  brandMatchLevel: string; // e.g. "极佳匹配"
  aiPotential: AIPotential;
  demographics: Demographics;
  trafficTrend: TrafficDataPoint[];
  aiHot?: boolean;
  recentTropes?: string[];
  aiScore?: number;
  interests?: InterestPreference[];
  city?: string; // "成都" | "重庆" | "杭州" etc.
}

export interface ScriptInspiration {
  title: string;
  scenes: {
    sceneNum: number;
    visual: string;
    audio: string;
    duration: string;
  }[];
  tags: string[];
}

export interface TitlePrediction {
  score: number;
  ctrRange: string;
  suggestions: string[];
  emotions: { name: string; value: number }[];
}

export interface MiniProgramFile {
  name: string;
  path: string;
  type: 'wxml' | 'wxss' | 'js' | 'json';
  content: string;
}
