import express from "express";
import path from "path";
import fs from "fs/promises";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy client creator to prevent crash if GEMINI_API_KEY is not defined.
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// 1. Analyze Influencer API Endpoint (uses Search Grounding for real influencers!)
app.post("/api/analyze", async (req, res) => {
  const { query, platform } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  const ai = getGeminiClient();

  if (!ai) {
    // High-quality static mock fallback if key is missing or is placeholder
    console.log("Gemini API Client offline. Generating premium simulated analysis for " + query);
    const mockData = generateSmartMockInfluencer(query, platform || "Douyin");
    return res.json({ source: "simulated", data: mockData });
  }

  try {
    const systemPrompt = `You are an expert social media analyst for Douyin and Xiaohongshu to evaluate influencer performance.
You must fetch authentic and up-to-date information about the influencer named "${query}" (Chinese name or handle).
Use Google Search grounding to retrieve real stats (follower count, engagement rates, and metrics).
Evaluate their brand-fit score out of 100, viral probability score, conversion efficiency, and demographics.

You MUST respond ONLY with a single JSON object. Do not wrap in markdown blocks, just return exact JSON text. Structure matching:
{
  "name": "name of influencer",
  "handle": "unique username or ID, starting with @. If not found, create one based on name pinyin.",
  "category": "one of: 川味火锅 / 串串香, 江湖菜 / 特色川湘菜, 江南精致料理, 新概念创意杭帮菜, 特色街头小吃, 市井大排档, 大胃吃播探店, 美食探店, 饮食推荐",
  "city": "the main city they operate or eat in. Typically one of: 成都, 重庆, 杭州 (or default to one of these if it matches local topics)",
  "platform": "Douyin" or "Xiaohongshu",
  "followers": "follower string e.g. 5.2M, 850k",
  "engagementRate": "estimated engagement rate e.g. 12.4%",
  "avgLikes": "average likes count e.g. 35K, 4.2k",
  "brandFitScore": 80 to 98 integer,
  "brandMatchLevel": "极佳匹配" or "优秀匹配" or "合意匹配",
  "aiPotential": {
    "viralProbability": "高" or "中" or "稳定",
    "viralScore": 60 to 99 integer,
    "conversionRate": "强" or "高" or "中" or "偏强",
    "conversionScore": 60 to 95 integer,
    "loyalty": "高" or "稳定" or "极高",
    "loyaltyScore": 60 to 95 integer
  },
  "demographics": {
    "femalePercentage": number between 10 and 90,
    "malePercentage": number (sums to 100 with femalePercentage),
    "age18to24": percentage e.g. 35,
    "age25to34": percentage e.g. 45,
    "age35to44": percentage e.g. 20 (sum of ages must equal 100)
  },
  "trafficTrend": [
    {"date": "10月1日", "exposure": 25},
    {"date": "10月4日", "exposure": 32},
    {"date": "10月8日", "exposure": 40},
    {"date": "10月12日", "exposure": 65},
    {"date": "10月15日", "exposure": 55},
    {"date": "10月18日", "exposure": 48},
    {"date": "10月22日", "exposure": 70},
    {"date": "10月25日", "exposure": 85},
    {"date": "10月28日", "exposure": 95},
    {"date": "10月30日", "exposure": 76}
  ],
  "recentTropes": ["List 2 or 3 common content tag topics they discuss"],
  "interests": [
    {"name": "彩妆护肤", "value": 92},
    {"name": "当季穿搭", "value": 85},
    {"name": "医美抗衰", "value": 78},
    {"name": "精致下午茶", "value": 65},
    {"name": "香美美学", "value": 52}
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Search and analyze the actual creator: "${query}" on platform: "${platform || 'Douyin'}"`,
      config: {
        systemInstruction: systemPrompt,
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      }
    });

    let rawText = response.text || "";
    // Clean up if the model wrapped it in ```json ... ```
    const match = rawText.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("Could not parse JSON response from search analysis");
    }

    const data = JSON.parse(match[0]);
    return res.json({ source: "gemini_grounding", data });
  } catch (err: any) {
    console.error("Gemini API call failed, reverting to mock smart analyzer:", err.message);
    const mockData = generateSmartMockInfluencer(query, platform || "Douyin");
    return res.json({ source: "fallback_simulated", data: mockData, warning: err.message });
  }
});

// 2. Script Ideas Generator Endpoint
app.post("/api/generate-script", async (req, res) => {
  const { topic, category } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    const mockScript = {
      title: `《${topic || '打造爆款'}》短视频创意拍摄方案`,
      scenes: [
        { sceneNum: 1, visual: "切景：博主身处精致背景前，双手交叉，表情故作神秘。", audio: "【吸睛悬念】为什么90%的新手都会在这里栽跟头？今天给你全盘托出！", duration: "3s" },
        { sceneNum: 2, visual: "特写：展示核心痛点对比图。快速放大关键指标数字。", audio: "【干货痛点】来看这个数据变动，其实秘密全都在这两个习惯里，点赞收藏仔细听！", duration: "8s" },
        { sceneNum: 3, visual: "中景：博主手持道具演示，屏幕侧面浮现3个黄金法则卡片。", audio: "【法则分享】第一，控制第一条底板；第二，学会巧用情感共鸣词；第三点最关键...", duration: "12s" },
        { sceneNum: 4, visual: "切景：博主对镜头报以自信微笑，下方弹出平台转化指南卡片。", audio: "【转化钩子】想拿到我整理的这套底层话术模板？评论区留言‘学习’，马上发你！", duration: "5s" }
      ],
      tags: ["视频拍摄", "爆款脚本", category || "创作技巧"]
    };
    return res.json({ source: "simulated", data: mockScript });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Generate a structured short-video shooting script for topic: "${topic || '爆款运营'}" in social media category: "${category || '通用'}".
Return ONLY a JSON block like:
{
  "title": "shooting script name",
  "scenes": [
    { "sceneNum": 1, "visual": "shooting scene camera movement & cues", "audio": "verbal speech words", "duration": "3s" }
  ],
  "tags": ["social", "tags"]
}`,
      config: {
        temperature: 0.82
      }
    });

    const match = (response.text || "").match(/\{[\s\S]*\}/);
    if (!match) throw new Error("JSON parse error");
    return res.json({ source: "gemini", data: JSON.parse(match[0]) });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 3. Title CTR Predictor Endpoint
app.post("/api/predict-title", async (req, res) => {
  const { title, category } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    const simulatedPrediction = {
      score: Math.floor(Math.random() * 20) + 78,
      ctrRange: `${(6.4 + Math.random() * 3).toFixed(1)}% - ${(11.5 + Math.random() * 4).toFixed(1)}%`,
      suggestions: [
        "加入极度夸张的情绪冲突词（如：绝对、惊人、哭晕在厕所等）",
        "使用具体数字代替模糊概念（如将‘几种秘诀’改为‘3条黄金法则’）",
        "融入反差感悬念设计，提升用户第一秒内的点击冲动"
      ],
      emotions: [
        { name: "好奇心 (Curiosity)", value: 45 },
        { name: "危机感 (Urgency)", value: 30 },
        { name: "认同感 (Trust)", value: 25 }
      ]
    };
    return res.json({ source: "simulated", data: simulatedPrediction });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Evaluate the viral potential of this short video draft title: "${title}" in platform category: "${category}".
Provide a prediction score (0-100), estimated click-through-rate (CTR) range, suggestions, and emotional metrics.
Respond ONLY with JSON matching:
{
  "score": 85,
  "ctrRange": "8.5% - 13.2%",
  "suggestions": ["3 concrete improvement bullets"],
  "emotions": [
    { "name": "好奇心 (Curiosity)", "value": 50 },
    { "name": "焦虑感 (Fear of missing out)", "value": 30 },
    { "name": "获得感 (Desire)", "value": 20 }
  ]
}`,
      config: {
        temperature: 0.7
      }
    });

    const match = (response.text || "").match(/\{[\s\S]*\}/);
    if (!match) throw new Error("JSON parse error");
    return res.json({ source: "gemini", data: JSON.parse(match[0]) });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});


// Recursive helper function to scan and load WeChat miniprogram files directly from disk
async function getMiniprogramFiles(): Promise<any[]> {
  const rootDir = path.join(process.cwd(), "miniprogram");
  const result: any[] = [];
  
  async function walk(dir: string) {
    try {
      const list = await fs.readdir(dir);
      for (const item of list) {
        const fullPath = path.join(dir, item);
        const stat = await fs.stat(fullPath);
        if (stat.isDirectory()) {
          await walk(fullPath);
        } else {
          const relativePath = path.relative(rootDir, fullPath);
          const extName = path.extname(item).replace(".", "").toLowerCase();
          const content = await fs.readFile(fullPath, "utf-8");
          result.push({
            name: item,
            path: relativePath,
            type: extName === "wxss" ? "wxss" : extName === "wxml" ? "wxml" : extName === "js" ? "js" : extName === "json" ? "json" : "json",
            content: content
          });
        }
      }
    } catch (e) {
      console.error("Scanning miniprogram folder failed:", e);
    }
  }

  await walk(rootDir);
  return result;
}

// 4. GET WeChat Mini Program files dynamic list
app.get("/api/miniprogram-files", async (req, res) => {
  try {
    const files = await getMiniprogramFiles();
    return res.json({ files });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 5. POST Save a WeChat Mini Program file edit back to workspace disk
app.post("/api/miniprogram-files/save", async (req, res) => {
  const { path: relativePath, content } = req.body;
  if (!relativePath) {
    return res.status(400).json({ error: "File path is required" });
  }
  
  try {
    const fullPath = path.join(process.cwd(), "miniprogram", relativePath);
    // Ensure parent directories exist
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content, "utf-8");
    
    const updatedFiles = await getMiniprogramFiles();
    return res.json({ success: true, files: updatedFiles });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});


// Helper function to dynamically generate a realistic influencer profile based on search text
function generateSmartMockInfluencer(name: string, platform: string) {
  // Simple seed calculation based on name characters
  let charSum = 0;
  for (let i = 0; i < name.length; i++) charSum += name.charCodeAt(i);

  const categories = ["川味火锅 / 串串香", "江湖菜 / 特色川湘菜", "江南精致料理", "新概念创意杭帮菜", "特色街头小吃", "市井大排档", "大胃吃播探店"];
  const selectCategory = categories[charSum % categories.length];

  const cities = ["成都", "重庆", "杭州"];
  const selectCity = cities[charSum % cities.length];

  // Adjust metrics based on category & name length
  const baseFollowersValue = ((charSum % 85) / 10 + 0.3).toFixed(1);
  const followerUnit = charSum % 3 === 0 ? "M" : "K";
  const followersStr = `${baseFollowersValue}${followerUnit}`;

  const baseLikes = Math.floor((charSum % 60) + 12);
  const avgLikesStr = `${baseLikes}K`;

  const engagementValue = Math.floor((charSum % 14) + 6);
  const engagementStr = `${engagementValue}%`;

  const brandScore = Math.floor((charSum % 15) + 82);
  const matchLevel = brandScore >= 92 ? "极佳匹配" : brandScore >= 87 ? "优秀匹配" : "合意匹配";

  const isMale = charSum % 2 === 0;
  const femaleRatio = isMale ? Math.floor((charSum % 20) + 15) : Math.floor((charSum % 35) + 55);
  const maleRatio = 100 - femaleRatio;

  const age1Key = Math.floor((charSum % 15) + 25); // 18-24
  const age2Key = Math.floor(((charSum * 3) % 15) + 40); // 25-34
  const age3Key = 100 - age1Key - age2Key;

  const handlePinyin = name.split("").map((c, i) => "influencer_" + (charSum % (10 * (i + 1)))).join("").substring(0, 10);

  return {
    name: name,
    handle: `@${handlePinyin || "creativelab"}`,
    category: selectCategory,
    city: selectCity,
    platform: platform === "Douyin" ? "Douyin" : "Xiaohongshu",
    followers: followersStr,
    engagementRate: engagementStr,
    avgLikes: avgLikesStr,
    brandFitScore: brandScore,
    brandMatchLevel: matchLevel,
    aiPotential: {
      viralProbability: brandScore > 90 ? "高" : "稳定",
      viralScore: brandScore - 2,
      conversionRate: engagementValue > 12 ? "强" : "高",
      conversionScore: Math.floor(brandScore * 0.95),
      loyalty: isMale ? "稳定" : "极佳",
      loyaltyScore: Math.floor(brandScore * 0.9)
    },
    demographics: {
      femalePercentage: femaleRatio,
      malePercentage: maleRatio,
      age18to24: age1Key,
      age25to34: age2Key,
      age35to44: age3Key
    },
    trafficTrend: [
      { date: "10月1日", exposure: Math.floor((charSum % 20) + 20) },
      { date: "10月4日", exposure: Math.floor((charSum % 25) + 30) },
      { date: "10月8日", exposure: Math.floor((charSum % 18) + 25) },
      { date: "10月12日", exposure: Math.floor((charSum % 32) + 45) },
      { date: "10月15日", exposure: Math.floor((charSum % 20) + 50) },
      { date: "10月18日", exposure: Math.floor((charSum % 15) + 40) },
      { date: "10月22日", exposure: Math.floor((charSum % 40) + 60) },
      { date: "10月25日", exposure: Math.floor((charSum % 30) + 55) },
      { date: "10月28日", exposure: Math.floor((charSum % 50) + 75) },
      { date: "10月30日", exposure: Math.floor((charSum % 45) + 68) }
    ],
    recentTropes: [
      `${selectCategory}日常开箱测评`,
      `粉丝1对1改妆/搭配大挑战`,
      `全网寻找高性价比好物测评`
    ],
    interests: selectCategory === "数码测评" || selectCategory === "知识科普" || selectCategory === "数码科技"
      ? [
          { name: "智玩硬件", value: 92 },
          { name: "极客数码", value: 87 },
          { name: "智能家居", value: 76 },
          { name: "前沿硬核", value: 64 },
          { name: "极客时尚", value: 52 }
        ]
      : selectCategory === "时尚穿搭" || selectCategory === "美妆护肤"
      ? [
          { name: "彩妆护肤", value: 94 },
          { name: "当季穿搭", value: 89 },
          { name: "奢品箱包", value: 72 },
          { name: "香氛沙龙", value: 65 },
          { name: "医美抗衰", value: 58 }
        ]
      : [
          { name: "日常穿搭", value: 85 },
          { name: "美妆护肤", value: 78 },
          { name: "生活好物", value: 68 },
          { name: "美食探店", value: 55 },
          { name: "数码配件", value: 48 }
        ]
  };
}


// Integrate Vite as Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on http://localhost:${PORT}`);
  });
}

startServer();
