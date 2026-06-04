import { useState, useEffect } from 'react';
import { 
  User as Person, 
  RefreshCw, 
  Search, 
  Sparkles, 
  ArrowLeft, 
  Copy, 
  Check, 
  Smartphone, 
  FileCode, 
  TrendingUp, 
  ChevronRight, 
  ExternalLink,
  Zap,
  Flame,
  Award,
  Users,
  Compass,
  LineChart as ChartIcon,
  Play,
  RotateCcw,
  UserCheck,
  CheckSquare,
  Scale,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { InfluencerProfile, ScriptInspiration, TitlePrediction, MiniProgramFile } from './types';
import { wxmlFiles } from './data/wxmlCode';
import RadarChart from './components/RadarChart';
import InfluenceMap from './components/InfluenceMap';

// Standard static popular influencers to provide initial premium database
const INITIAL_INFLUENCERS: InfluencerProfile[] = [
  {
    id: "Mizijun",
    name: "密子君",
    handle: "@mizijun_spicy",
    category: "重辣老火锅 / 江湖菜探店",
    city: "成都",
    platform: "Douyin",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDas_m3fIgwCyQnPOZhJ8lqQCEHMJbfNV_7FNDlqq7i3KTTCKb77UcNYW40MKIoivL80SIv2DNBxQPI8uv76unxLGTzYjQVRZJQbPL4T2DXfwfQlewmaC7WPPdFca20gbAJJJP-DnIVbUu15HDANUKtVZsfTlrVkJZj7ezuo_jteXMqmO45WE0yfgdGQ2GPR91NRYrvJl3jULRjfMTo5QNrjKwydDuQSVgOKMTbnL14auoe4eTbV2i8EcBjdiMckYUKDVNOJmZKkRg",
    followers: "18.5M",
    engagementRate: "16.4%",
    avgLikes: "230K",
    brandFitScore: 95,
    brandMatchLevel: "极佳匹配",
    aiPotential: {
      viralProbability: "高",
      viralScore: 94,
      conversionRate: "强",
      conversionScore: 91,
      loyalty: "稳定",
      loyaltyScore: 88
    },
    demographics: {
      femalePercentage: 65,
      malePercentage: 35,
      age18to24: 45,
      age25to34: 40,
      age35to44: 15
    },
    trafficTrend: [
      { date: "10-01", exposure: 60 },
      { date: "10-04", exposure: 75 },
      { date: "10-08", exposure: 70 },
      { date: "10-12", exposure: 95 },
      { date: "10-15", exposure: 80 },
      { date: "10-18", exposure: 72 },
      { date: "10-22", exposure: 88 },
      { date: "10-25", exposure: 90 },
      { date: "10-28", exposure: 120 },
      { date: "10-30", exposure: 110 }
    ],
    interests: [
      { name: "川渝九宫格", value: 95 },
      { name: "宵夜大排档", value: 89 },
      { name: "大胃王吃播", value: 85 },
      { name: "城市美食卡", value: 78 },
      { name: "国货调味品", value: 72 }
    ]
  },
  {
    id: "Taozijie",
    name: "蜀中桃子姐",
    handle: "@sichuan_taozijie",
    category: "乡村柴火慢炖 / 传统川菜",
    city: "重庆",
    platform: "Douyin",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzjeej0CI_4b9zsTHPubk043Lz0jcAxUtL0N5MOkcF03gvg7X9_6Gs81wVaqFf5l84l7qle3IjLbOC6QwnnUYQUweIUy-38hNkvWa00cfRenyr5K-V_XZYg10YbEA-OPja5rh1EOHoY1yA2DYzlu0EiSKTn4yyuhP2dyO-aaLopO11jgAg0Xb0OSNm6WSLWDcemAr_c1te_jwTMY-F63dLfcgI6CRqyJ3GVowe35JG65Vx0ohWBPtBc1tqRPmc-ZgtgVgIcfSBin4",
    followers: "21.2M",
    engagementRate: "18.2%",
    avgLikes: "250K",
    brandFitScore: 96,
    brandMatchLevel: "极佳匹配",
    aiPotential: {
      viralProbability: "高",
      viralScore: 96,
      conversionRate: "优秀",
      conversionScore: 92,
      loyalty: "极高",
      loyaltyScore: 95
    },
    demographics: {
      femalePercentage: 55,
      malePercentage: 45,
      age18to24: 25,
      age25to34: 50,
      age35to44: 25
    },
    trafficTrend: [
      { date: "10-01", exposure: 50 },
      { date: "10-04", exposure: 65 },
      { date: "10-08", exposure: 58 },
      { date: "10-12", exposure: 80 },
      { date: "10-15", exposure: 92 },
      { date: "10-18", exposure: 85 },
      { date: "10-22", exposure: 98 },
      { date: "10-25", exposure: 89 },
      { date: "10-28", exposure: 110 },
      { date: "10-30", exposure: 105 }
    ],
    interests: [
      { name: "柴火走地鸡", value: 96 },
      { name: "传统自制酱", value: 90 },
      { name: "田园风调料", value: 87 },
      { name: "五谷粗杂粮", value: 76 },
      { name: "家常快手菜", value: 70 }
    ]
  },
  {
    id: "Daoyueshe",
    name: "盗月社食遇记",
    handle: "@daoyueshe_eats",
    category: "街头传统老字号 / 暖心夜市",
    city: "重庆",
    platform: "Xiaohongshu",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJNbh2k95zKdZbKAcsz9k5T5LFQ-TEw4oBIcybIQXWqZYDkQbyhr-nVbSt2HxjjKVdfOFV_72QWpqrN_dlCiols4pHC8_G8mCVgpClIifMsIckSN6LLdiUglRpWRj7T1KlMWzsgRx_hpDtDBsan1o-wll0fwpWUVHYzdHVZNZ9MzxgtX2E-si3Fn57y97ct43FQAUwUZXPR_AJMtwJ3b70wb9Wb0NqG1c6F3AmfM_5As5soouk3T8avTq6dR8bU_W9OctnIUFlCss",
    followers: "8.6M",
    engagementRate: "12.5%",
    avgLikes: "92K",
    brandFitScore: 92,
    brandMatchLevel: "极佳匹配",
    aiPotential: {
      viralProbability: "高",
      viralScore: 91,
      conversionRate: "强",
      conversionScore: 89,
      loyalty: "稳定",
      loyaltyScore: 86
    },
    demographics: {
      femalePercentage: 48,
      malePercentage: 52,
      age18to24: 40,
      age25to34: 48,
      age35to44: 12
    },
    trafficTrend: [
      { date: "10-01", exposure: 35 },
      { date: "10-04", exposure: 42 },
      { date: "10-08", exposure: 50 },
      { date: "10-12", exposure: 68 },
      { date: "10-15", exposure: 60 },
      { date: "10-18", exposure: 55 },
      { date: "10-22", exposure: 80 },
      { date: "10-25", exposure: 75 },
      { date: "10-28", exposure: 98 },
      { date: "10-30", exposure: 92 }
    ],
    interests: [
      { name: "非遗老字号", value: 92 },
      { name: "市井下酒菜", value: 88 },
      { name: "深夜大排档", value: 81 },
      { name: "城市慢享餐", value: 75 },
      { name: "冷链预制菜", value: 64 }
    ]
  },
  {
    id: "Hangzhou_Daliang",
    name: "杭州餐饮阿亮",
    handle: "@hz_gourmet_liang",
    category: "新派融合杭帮菜 / 奢享私房宴",
    city: "杭州",
    platform: "Xiaohongshu",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5J-q7uBFTxXMwVRjL25An5RKBglN3P8THwbeyvnsW5COgh0nA_V5wOPQEAEQK5g8B9ot_r23pOwWadWhlKVugxnvXrwQc5Sp-__hspgHf_9ks_1OTGhqXuMd3U7KliKrP39lDJSQ0esu7J45py4hcDPhAJqiYhFAOiva_khEvznvhdtDUhndrufaT0LXTnCiP5gr1iVrEkLx0nrcoe9LjKNKYQCYG0Fe_v6M9CJla0LcHKpKxmk-GmXHJbI1ijRIfukVWUiRSyXA",
    followers: "3.8M",
    engagementRate: "9.2%",
    avgLikes: "42K",
    brandFitScore: 88,
    brandMatchLevel: "优秀匹配",
    aiPotential: {
      viralProbability: "稳定",
      viralScore: 84,
      conversionRate: "高",
      conversionScore: 82,
      loyalty: "稳定",
      loyaltyScore: 85
    },
    demographics: {
      femalePercentage: 62,
      malePercentage: 38,
      age18to24: 30,
      age25to34: 55,
      age35to44: 15
    },
    trafficTrend: [
      { date: "10-01", exposure: 25 },
      { date: "10-04", exposure: 30 },
      { date: "10-08", exposure: 35 },
      { date: "10-12", exposure: 42 },
      { date: "10-15", exposure: 48 },
      { date: "10-18", exposure: 55 },
      { date: "10-22", exposure: 60 },
      { date: "10-25", exposure: 58 },
      { date: "10-28", exposure: 75 },
      { date: "10-30", exposure: 70 }
    ],
    interests: [
      { name: "精致江浙菜", value: 95 },
      { name: "私房融合菜", value: 89 },
      { name: "奢享黑珍珠", value: 84 },
      { name: "西式小酒馆", value: 72 },
      { name: "新茶饮烘焙", value: 65 }
    ]
  }
];

export default function App() {
  // Mobile Simulator State
  const [activeTab, setActiveTab] = useState<'discover' | 'analytics' | 'ailab' | 'mine'>('discover');
  const [platform, setPlatform] = useState<'Douyin' | 'Xiaohongshu'>('Douyin');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<InfluencerProfile | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [database, setDatabase] = useState<InfluencerProfile[]>(INITIAL_INFLUENCERS);
  const [cateringExclusive, setCateringExclusive] = useState(true); // Default to true since the user is focused on food
  const [selectedCityFilter, setSelectedCityFilter] = useState<'全部' | '成都' | '重庆' | '杭州'>('全部');

  const filteredDatabase = database.filter(x => {
    if (x.platform !== platform) return false;

    if (cateringExclusive) {
      const cat = (x.category || "").toLowerCase();
      const name = (x.name || "").toLowerCase();
      const interests = (x.interests || []).map(i => i.name.toLowerCase()).join(" ");
      const isCatering = (
        ["成都", "重庆", "杭州"].includes(x.city || "") ||
        cat.includes("火锅") || cat.includes("菜") || cat.includes("餐") || cat.includes("食") || cat.includes("大排档") || cat.includes("小吃") || cat.includes("吃播") || cat.includes("店") ||
        name.includes("餐饮") || name.includes("美食") || name.includes("吃") ||
        interests.includes("锅") || interests.includes("餐") || interests.includes("食")
      );

      if (!isCatering) return false;

      if (selectedCityFilter !== '全部') {
        const itemCity = x.city || "";
        if (itemCity !== selectedCityFilter) return false;
      } else {
        if (!x.city || !["成都", "重庆", "杭州"].includes(x.city)) {
          return false;
        }
      }
    }

    return true;
  });

  // AI Script Generator State
  const [scriptTopic, setScriptTopic] = useState('');
  const [scriptCategory, setScriptCategory] = useState('时尚穿搭');
  const [isLoadingScript, setIsLoadingScript] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<ScriptInspiration | null>(null);

  // AI Title Predictor State
  const [titleDraft, setTitleDraft] = useState('');
  const [titleCategory, setTitleCategory] = useState('美妆护肤');
  const [isLoadingTitle, setIsLoadingTitle] = useState(false);
  const [titlePrediction, setTitlePrediction] = useState<TitlePrediction | null>(null);

  // Competitor Analysis State
  const [compAccountA, setCompAccountA] = useState('Elena Chen');
  const [compAccountB, setCompAccountB] = useState('Style By Sarah');

  // Mini Program IDE Dynamic Filesystem Sync State
  const [files, setFiles] = useState<MiniProgramFile[]>(wxmlFiles);
  const [selectedFilePath, setSelectedFilePath] = useState<string>("pages/discover/discover.wxml");
  const [editorContent, setEditorContent] = useState<string>(wxmlFiles[1].content);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const currentFile = files.find(f => f.path === selectedFilePath) || files[0] || wxmlFiles[1];

  // Sync editor content when selected file changes
  useEffect(() => {
    if (currentFile) {
      setEditorContent(currentFile.content);
    }
  }, [selectedFilePath, files]);

  // Load WeChat miniprogram files dynamic list from workspace disk
  useEffect(() => {
    fetch("/api/miniprogram-files")
      .then(res => res.json())
      .then(data => {
        if (data && data.files && data.files.length > 0) {
          setFiles(data.files);
        }
      })
      .catch(err => console.warn("WeChat live syncing offline. Falling back to simulated in-memory mode.", err));
  }, []);

  // Save changes back to server workspace disk
  const handleSaveFile = async () => {
    setIsSaving(true);
    setSaveStatus("正在同步至 /miniprogram 目录...");
    try {
      const response = await fetch("/api/miniprogram-files/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: selectedFilePath, content: editorContent })
      });
      const data = await response.json();
      if (data && data.success && data.files) {
        setFiles(data.files);
        setSaveStatus("✅ 保存成功！已同步至本地微信项目。");
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus("❌ 写入失败：" + (data.error || "未知解析错误"));
        setTimeout(() => setSaveStatus(null), 5000);
      }
    } catch (e: any) {
      setSaveStatus("❌ 写入失败：" + e.message);
      setTimeout(() => setSaveStatus(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  // Pull To Refresh Simulated Handler
  const triggerPullDownRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Modify statistical bounds subtly to represent authentic data update
      setDatabase(prev => prev.map(item => {
        if (item.id === "David_Codes" || item.id === "DavidCodes") {
          return { ...item, followers: "2.5M", engagementRate: "12.8%" };
        }
        return item;
      }));
      setIsRefreshing(false);
      showToastNotification("排行榜数据已实时更新！");
    }, 1200);
  };

  // Toast notifier inside mock phone
  const [phoneToast, setPhoneToast] = useState<string | null>(null);
  const showToastNotification = (msg: string) => {
    setPhoneToast(msg);
    setTimeout(() => setPhoneToast(null), 3000);
  };

  // Live Creator AI Search Grounding Integration
  const handleAISearch = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsSearching(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryText, platform })
      });
      const resData = await response.json();
      if (resData && resData.data) {
        const found = resData.data as InfluencerProfile;
        // Append to temporary mock list to support detail navigations
        setDatabase(prev => {
          if (!prev.some(x => x.name.toLowerCase() === found.name.toLowerCase())) {
            return [found, ...prev];
          }
          return prev;
        });
        setSelectedCreator(found);
        showToastNotification(`成功抓取真实达人 [@${found.name}] 数据！`);
      } else {
        showToastNotification("拉取数据失败，请检查网络或重试。");
      }
    } catch (err) {
      console.error(err);
      showToastNotification("API请求异常，使用本地智能模拟。");
    } finally {
      setIsSearching(false);
    }
  };

  // Live Script Generation Call
  const handleGenerateScript = async () => {
    if (!scriptTopic.trim()) {
      showToastNotification("请输入脚本主题");
      return;
    }
    setIsLoadingScript(true);
    try {
      const res = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: scriptTopic, category: scriptCategory })
      });
      const result = await res.json();
      if (result && result.data) {
        setGeneratedScript(result.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingScript(false);
    }
  };

  // Live Title CTR Prediction Call
  const handlePredictTitle = async () => {
    if (!titleDraft.trim()) {
      showToastNotification("请输入预设标题");
      return;
    }
    setIsLoadingTitle(true);
    try {
      const res = await fetch("/api/predict-title", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: titleDraft, category: titleCategory })
      });
      const result = await res.json();
      if (result && result.data) {
        setTitlePrediction(result.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingTitle(false);
    }
  };

  // Copy Code Handler for developer pane
  const handleCopyCode = (content: string, filename: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const activeCategoryList = [
    { name: '川渝老火锅与串串香', heat: '2.4M', icon: '🌶️' },
    { name: '杭州精品新派杭帮菜', heat: '1.5M', icon: '🍵' },
    { name: '市井江湖菜与深夜烧烤', heat: '980K', icon: '🍢' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Dynamic Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-900/40">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
              达人情报局 · Mini Program IDE Developer Environment
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              WeChat Mini Program Code Sandbox & Visual Simulator
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="hidden lg:inline-flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-800 border border-slate-700/80 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Server Ingress Bind Port 3000
          </span>
          <a 
            href="#simulator" 
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-900/20"
          >
            <Smartphone className="w-4 h-4" />
            跳转至模拟器
          </a>
        </div>
      </header>

      {/* Main Grid View */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 max-w-[1700px] w-full mx-auto align-stretch">
        
        {/* Left Side: Developer Code Studio & Syntax Inspector (WXML, WXSS, JS, JSON) */}
        <section className="lg:col-span-7 flex flex-col bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden min-h-[780px]">
          {/* Studio Tab bar header */}
          <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5 mr-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500 block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500 block"></span>
              </div>
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-cyan-400" />
                WeChat IDE Project Directory
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono bg-slate-900 px-2.5 py-1 rounded-md">
              WeChat SDK v2.33.0 Stable
            </div>
          </div>

          <div className="flex-1 flex flex-col md:flex-row align-stretch">
            {/* Folder file structure rail */}
            <div className="w-full md:w-56 bg-slate-950/40 border-r border-slate-800 p-3 flex flex-col gap-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                <span>Root Directory</span>
                <span className="text-[10px] bg-slate-800 text-indigo-400 px-1 py-0.5 rounded font-mono">App.json</span>
              </div>
              <div className="flex flex-col gap-1.5 text-xs overflow-y-auto max-h-[350px] pr-1">
                {/* Global App files */}
                {files.filter(f => !f.path.includes("/")).map(file => (
                  <button 
                    key={file.path}
                    onClick={() => setSelectedFilePath(file.path)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg font-mono flex items-center gap-2 transition-all ${selectedFilePath === file.path ? 'bg-indigo-950/50 text-indigo-300 border border-indigo-800/80 font-semibold' : 'text-slate-400 hover:bg-slate-800/40'}`}
                  >
                    <span className="text-amber-500 text-xs">⚙️</span> {file.name}
                  </button>
                ))}

                <div className="h-[1px] bg-slate-800/60 my-2"></div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                  <span>Pages Folder</span>
                  <span className="text-[9px] bg-slate-800 text-cyan-400 px-1 py-0.5 rounded font-mono">WeChat Pages</span>
                </div>

                {/* Page Files */}
                {files.filter(f => f.path.includes("/")).map(file => (
                  <button 
                    key={file.path}
                    onClick={() => setSelectedFilePath(file.path)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg font-mono flex items-center gap-2 transition-all ${selectedFilePath === file.path ? 'bg-indigo-950/50 text-indigo-300 border border-indigo-800/80 font-semibold' : 'text-slate-400 hover:bg-slate-800/40'}`}
                  >
                    <span className={file.type === 'wxml' ? 'text-cyan-400' : file.type === 'js' ? 'text-yellow-400' : file.type === 'wxss' ? 'text-sky-400' : 'text-amber-400'}>
                      {file.type === 'wxml' ? '📝' : file.type === 'js' ? 'JS' : file.type === 'wxss' ? '🎨' : '⚙️'}
                    </span>
                    <span className="truncate flex-1 text-slate-300">{file.path.replace("pages/", "")}</span>
                  </button>
                ))}
              </div>

              {/* WeChat Mini Program Education Tip */}
              <div className="mt-auto bg-slate-900 border border-slate-800 p-3 rounded-xl hidden md:block">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1">
                  <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  WXML 标签小贴士
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                  小程序不使用 HTML。&lt;view&gt; 对应 &lt;div&gt;，&lt;text&gt; 对应 &lt;span&gt;，&lt;progress&gt; 提供原生组件化的百分比指示。
                </p>
              </div>
            </div>

            {/* Code presentation output window */}
            <div className="flex-1 flex flex-col bg-slate-950/60 p-4">
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded font-mono">
                    {currentFile.path}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {currentFile.type.toUpperCase()} syntax configuration
                  </span>
                </div>
                <button 
                  onClick={() => handleCopyCode(editorContent, currentFile.name)}
                  className="bg-slate-800 hover:bg-slate-700/80 text-xs text-slate-300 font-medium px-3 py-1.5 rounded-lg border border-slate-700/80 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  {copiedFile === currentFile.name ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      复制代码
                    </>
                  )}
                </button>
              </div>

              {/* Code editor container pane */}
              <div className="flex-1 flex flex-col rounded-xl border border-slate-800 bg-slate-950/95 font-mono p-1 overflow-hidden min-h-[460px]">
                <textarea
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                  className="flex-1 w-full bg-transparent font-mono text-xs text-slate-300 p-4 leading-relaxed outline-none resize-none focus:ring-1 focus:ring-indigo-500/30 rounded-lg h-full"
                  placeholder="正在拉取小程序源配置文件..."
                  spellCheck="false"
                />
              </div>

              {/* Action operations and saving panel */}
              <div className="mt-3 flex items-center justify-between">
                <div className="text-[10px] text-slate-500 font-mono">
                  {saveStatus ? (
                    <span className="text-indigo-400 font-medium animate-pulse">{saveStatus}</span>
                  ) : (
                    <span>直接在此处编辑源码，保存即可在右侧动态模拟调试</span>
                  )}
                </div>
                <button
                  onClick={handleSaveFile}
                  disabled={isSaving}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer animate-hover"
                >
                  <Save className="w-3.5 h-3.5" />
                  {isSaving ? "正在保存..." : "💾 保存修改并同步"}
                </button>
              </div>

              {/* Explanation of parameters */}
              <div className="mt-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-semibold text-cyan-400 mb-1">当前组件分析与 system 映射</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  在左侧进行了源码保存后，底层的 Express 容器服务器将直接在主机的 <code className="text-indigo-300">/miniprogram</code> 目录中同步写入真实物理文件。开发所得随时可整体打包直接在微信官方开发者工具中直接加载运行！
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: Smartphone Frame Simulator */}
        <section id="simulator" className="lg:col-span-5 flex flex-col items-center">
          
          <div className="relative w-full max-w-[410px] bg-slate-900 p-3 rounded-[44px] shadow-2xl border border-slate-800 shadow-indigo-950/70 overflow-hidden">
            
            {/* Phone speaker and selfie camera notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-40 h-6 bg-slate-950 rounded-full z-50 flex items-center justify-center gap-1 px-3">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900 block border border-slate-800"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-900 block ml-auto"></span>
              <span className="w-14 h-1 bg-slate-800 rounded-full block"></span>
            </div>

            {/* Inner Phone Screen */}
            <div className="relative w-full aspect-[9/19.5] rounded-[34px] overflow-hidden bg-slate-50 text-slate-900 flex flex-col select-none">
              
              {/* Carrier status notification bar */}
              <div className="bg-[#f7f9fc] h-10 pt-2 px-6 flex justify-between items-center text-xs font-mono text-slate-800 z-10">
                <span>01:53</span>
                <div className="flex items-center gap-1.5">
                  <span>5G</span>
                  <div className="w-5 h-2.5 border border-slate-800 rounded-sm p-[1px] flex">
                    <div className="bg-slate-800 h-full w-[85%] rounded-2xs"></div>
                  </div>
                </div>
              </div>

              {/* Top Custom Navigation Header Bar */}
              <div className="bg-[#f7f9fc] px-4 py-2 border-b border-slate-200/50 flex items-center justify-between z-10 sticky top-0">
                <div className="flex items-center gap-2">
                  {selectedCreator && (
                    <button 
                      onClick={() => setSelectedCreator(null)}
                      className="p-1 hover:bg-slate-200/50 rounded-full mr-1 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4 text-slate-800" />
                    </button>
                  )}
                  {selectedCreator ? (
                    <h2 className="text-sm font-bold text-slate-800">达人档案详情</h2>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] text-white font-bold">
                        AI
                      </div>
                      <h2 className="text-sm font-bold text-slate-800 font-display">达人情报局</h2>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 bg-slate-200/60 px-2 py-1 rounded-full border border-slate-300/40">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full block animate-pulse"></span>
                  <span className="text-[10px] text-slate-700 font-mono">小程序联接</span>
                </div>
              </div>

              {/* Smartphone Display area */}
              <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col bg-[#f7f9fc]">
                
                {/* Pull To Refresh Animated Indicator Overlay */}
                {isRefreshing && (
                  <div className="absolute top-0 w-full left-0 bg-[#e0e0ff]/30 py-3 flex items-center justify-center gap-2 text-xs font-mono text-indigo-900 border-b border-indigo-200 z-30 animate-fade-in">
                    <RefreshCw className="w-4 h-4 text-indigo-700 animate-spin" />
                    云数据流同步中...
                  </div>
                )}

                {/* Simulated Toast prompt wrapper */}
                <AnimatePresence>
                  {phoneToast && (
                    <motion.div 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-12 left-4 right-4 bg-slate-900/95 text-slate-100 font-mono text-xs px-3.5 py-2.5 rounded-xl shadow-lg leading-tight z-40 text-center flex items-center justify-center gap-2 border border-slate-700"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      {phoneToast}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Subpage Router View Container */}
                <AnimatePresence mode="wait">
                  {selectedCreator ? (
                    /* Detailed Profile page overlay */
                    <motion.div 
                      key="profile"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="p-4"
                    >
                      {/* Section from Elena Chen / Image 1 */}
                      <div className="flex flex-col items-center text-center mt-2 mb-6">
                        <div className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-md">
                          <img 
                            src={selectedCreator.avatar} 
                            alt={selectedCreator.name} 
                            className="w-full h-full rounded-full object-cover border-2 border-white"
                          />
                        </div>
                        <h3 className="text-lg font-bold font-display text-slate-900 mt-2.5">{selectedCreator.name}</h3>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedCreator.handle} • {selectedCreator.category}</p>
                        
                        <div className="flex gap-2 mt-2.5">
                          <span className={`text-[9px] font-bold font-mono px-2.5 py-0.5 rounded-full ${selectedCreator.platform === 'Xiaohongshu' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-slate-900 text-white'}`}>
                            {selectedCreator.platform}
                          </span>
                          <span className="bg-emerald-50 text-emerald-600 text-[9px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                            数据已验真
                          </span>
                        </div>

                        {/* Top Score Summary Cards */}
                        <div className="flex gap-4 mt-5 w-full justify-between px-2">
                          <div className="flex-1 flex flex-col items-center bg-white p-2 rounded-xl shadow-xs border border-slate-200/50">
                            <span className="font-mono text-lg font-bold text-indigo-900 leading-tight">{selectedCreator.followers}</span>
                            <span className="text-[10px] text-slate-500 font-medium">粉丝数</span>
                          </div>
                          <div className="flex-1 flex flex-col items-center bg-white p-2 rounded-xl shadow-xs border border-slate-200/50">
                            <span className="font-mono text-lg font-bold text-indigo-900 leading-tight">{selectedCreator.engagementRate}</span>
                            <span className="text-[10px] text-slate-500 font-medium">互动率</span>
                          </div>
                          <div className="flex-1 flex flex-col items-center bg-white p-2 rounded-xl shadow-xs border border-slate-200/50">
                            <span className="font-mono text-lg font-bold text-indigo-900 leading-tight">{selectedCreator.avgLikes}</span>
                            <span className="text-[10px] text-slate-500 font-medium">平均点赞</span>
                          </div>
                        </div>
                      </div>

                      {/* Score metrics dual column section */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {/* Brand Fit Score container (Image 1 Left) */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/40 relative overflow-hidden flex flex-col justify-between aspect-square">
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <Award className="w-4 h-4 text-cyan-600" />
                            <span className="text-xs font-semibold">品牌契合度</span>
                          </div>
                          <div className="flex flex-col items-center my-auto">
                            <span className="text-4xl font-bold font-mono text-cyan-600 leading-none">{selectedCreator.brandFitScore}</span>
                            <span className="text-[10px] text-cyan-700 bg-cyan-100/60 px-2 py-0.5 rounded-full mt-1.5 font-bold">
                              {selectedCreator.brandMatchLevel}
                            </span>
                          </div>
                          {/* Inner soft sphere mask */}
                          <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full bg-cyan-100/30 border-4 border-cyan-200/40"></div>
                        </div>

                        {/* AI potential Diagnosis container (Image 1 Right) */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/40 flex flex-col gap-2.5">
                          <div className="flex items-center justify-between text-slate-700">
                            <span className="text-xs font-semibold">AI潜力评估</span>
                            <Zap className="w-4 h-4 text-indigo-500" />
                          </div>
                          <div className="flex-1 flex flex-col justify-end gap-2 text-[10px] text-slate-500 font-mono">
                            <div className="w-full">
                              <div className="flex justify-between mb-0.5">
                                <span>爆火概率</span>
                                <span className="text-indigo-900 font-bold">{selectedCreator.aiPotential.viralProbability}</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
                                  style={{ width: `${selectedCreator.aiPotential.viralScore}%` }}
                                ></div>
                              </div>
                            </div>

                            <div className="w-full">
                              <div className="flex justify-between mb-0.5">
                                <span>转化效率</span>
                                <span className="text-indigo-900 font-bold">{selectedCreator.aiPotential.conversionRate}</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-teal-500 rounded-full transition-all duration-500" 
                                  style={{ width: `${selectedCreator.aiPotential.conversionScore}%` }}
                                ></div>
                              </div>
                            </div>

                            <div className="w-full">
                              <div className="flex justify-between mb-0.5">
                                <span>粉丝忠诚度</span>
                                <span className="text-indigo-900 font-bold">{selectedCreator.aiPotential.loyalty}</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-indigo-300 rounded-full transition-all duration-500" 
                                  style={{ width: `${selectedCreator.aiPotential.loyaltyScore}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Traffic Exposure Trend 30 Day histograms */}
                      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/40 mb-4">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">流量趋势 (30天)</span>
                          <span className="text-[10px] text-slate-400 font-mono">曝光量</span>
                        </div>
                        <div className="h-28 flex items-end justify-between gap-1 p-1 relative">
                          <div className="absolute inset-x-0 top-0 bottom-0 flex flex-col justify-between pointer-events-none">
                            <span className="w-full border-b border-slate-100 block"></span>
                            <span className="w-full border-b border-slate-100 block"></span>
                            <span className="w-full border-b border-slate-100 block"></span>
                          </div>
                          {selectedCreator.trafficTrend.map((pt, idx) => (
                            <div 
                              key={idx}
                              className="flex-1 bg-indigo-500/80 hover:bg-indigo-600 rounded-t-sm transition-all relative group cursor-pointer"
                              style={{ height: `${pt.exposure}%` }}
                            >
                              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-[8px] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-15 shadow">
                                {pt.exposure}W
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between text-[8px] text-slate-400 font-mono mt-1 px-1">
                          <span>10月1日</span>
                          <span>10月15日</span>
                          <span>10月30日</span>
                        </div>
                      </div>

                      {/* Fan Demographics (PIE chart simulation) */}
                      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/40 mb-4">
                        <span className="text-xs font-bold text-slate-800 block border-b border-slate-100 pb-2 mb-3">粉丝画像</span>
                        
                        <div className="grid grid-cols-12 gap-2 text-slate-700">
                          {/* Sex pie */}
                          <div className="col-span-12 xs:col-span-5 flex flex-col gap-1 inline-cell">
                            <span className="text-[10px] text-slate-400 font-mono">性别分布</span>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center">
                                <div className="absolute inset-0 bg-cyan-600" style={{ clipPath: `polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 0, 25% 0)` }}></div>
                                <div className="absolute inset-1 bg-white rounded-full"></div>
                                <span className="text-[10px] font-bold text-cyan-800 font-mono relative z-10">{selectedCreator.demographics.femalePercentage}%</span>
                              </div>
                              <div className="text-[10px] leading-tight font-mono">
                                <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-cyan-600 block"></span>女 {selectedCreator.demographics.femalePercentage}%</div>
                                <div className="flex items-center gap-1 mt-0.5"><span className="w-1.5 h-1.5 rounded-full bg-indigo-100 block border border-indigo-200"></span>男 {selectedCreator.demographics.malePercentage}%</div>
                              </div>
                            </div>
                          </div>

                          {/* Age block */}
                          <div className="col-span-12 xs:col-span-7 flex flex-col gap-1 inline-cell px-1">
                            <span className="text-[10px] text-slate-400 font-mono">年龄分布</span>
                            <div className="flex flex-col gap-1.5 mt-1 font-mono text-[9px] text-slate-600">
                              <div className="flex items-center justify-between gap-1">
                                <span className="w-8">18-24</span>
                                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${selectedCreator.demographics.age18to24}%` }}></div>
                                </div>
                                <span className="w-6 text-right font-bold text-slate-900">{selectedCreator.demographics.age18to24}%</span>
                              </div>

                              <div className="flex items-center justify-between gap-1">
                                <span className="w-8">25-34</span>
                                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${selectedCreator.demographics.age25to34}%` }}></div>
                                </div>
                                <span className="w-6 text-right font-bold text-slate-900">{selectedCreator.demographics.age25to34}%</span>
                              </div>

                              <div className="flex items-center justify-between gap-1">
                                <span className="w-8">35-44</span>
                                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-indigo-300 rounded-full" style={{ width: `${selectedCreator.demographics.age35to44}%` }}></div>
                                </div>
                                <span className="w-6 text-right font-bold text-slate-900">{selectedCreator.demographics.age35to44}%</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Top 5 core industry interests Radar Chart */}
                        <RadarChart interests={selectedCreator.interests} />
                      </div>

                      {/* Content Tropes analysis block */}
                      <div className="bg-gradient-to-br from-[#1a237e]/5 to-[#00bcd4]/5 rounded-2xl p-4 shadow-sm border border-slate-200/45">
                        <span className="text-xs font-bold text-indigo-950 block mb-2 flex items-center gap-1.5">
                          <Zap className="w-4 h-4 text-yellow-500" />
                          AI 智能运营诊断标签
                        </span>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {selectedCreator.recentTropes?.map((tr, idx) => (
                            <span key={idx} className="bg-indigo-100/60 border border-indigo-200/50 text-indigo-900 text-[10px] font-mono px-2.5 py-1 rounded-lg">
                              ⚡ {tr}
                            </span>
                          )) || (
                            <span className="text-[10px] text-slate-400">暂无画像诊断</span>
                          )}
                        </div>
                      </div>

                      <button 
                        onClick={() => setSelectedCreator(null)}
                        className="w-full mt-6 bg-slate-800 text-white font-semibold py-2.5 rounded-xl text-xs active:scale-95 transition-transform hover:bg-slate-700/90 shadow cursor-pointer"
                      >
                        返回探索榜单
                      </button>
                    </motion.div>
                  ) : (
                    /* General Tab switching pages */
                    activeTab === 'discover' ? (
                      /* 🔍 Discover Page View */
                      <motion.div 
                        key="tab-discover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-4"
                      >
                        {/* Search Block Section */}
                        <div className="flex flex-col gap-3 mb-5">
                          <div className="relative w-full">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                              <Search className="w-4 h-4" />
                            </span>
                            <input 
                              type="text" 
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="搜索达人ID、关键词或领域进行AI诊断"
                              className="w-full pl-9 pr-22 py-2.5 bg-white border border-slate-200 rounded-xl font-mono text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 shadow-sm"
                            />
                            <button 
                              onClick={() => handleAISearch(searchQuery)}
                              disabled={isSearching}
                              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 active:scale-95 transition-transform disabled:opacity-50 cursor-pointer"
                            >
                              <Sparkles className="w-3 h-3 text-yellow-400" />
                              {isSearching ? "分析中" : "AI 诊断"}
                            </button>
                          </div>

                          {/* Quick keywords suggestions */}
                          <div className="flex flex-wrap gap-1.5">
                            <span className="text-[9px] text-slate-400 self-center">热门词：</span>
                            {["李佳琦", "小杨哥", "董宇辉", "papi酱"].map((kw) => (
                              <button 
                                key={kw}
                                onClick={() => {
                                  setSearchQuery(kw);
                                  handleAISearch(kw);
                                }}
                                className="bg-white border border-slate-200 hover:border-slate-300 text-slate-600 text-[10px] px-2 py-0.5 rounded-md cursor-pointer transition-all"
                              >
                                {kw}
                              </button>
                            ))}
                          </div>

                          {/* Platform Toggle panel */}
                          <div className="flex gap-1.5 p-1 bg-slate-200/60 rounded-xl mt-1.5">
                            <button 
                              onClick={() => setPlatform('Douyin')}
                              className={`flex-1 text-center py-2 text-[11px] font-bold rounded-lg transition-all ${platform === 'Douyin' ? 'bg-white text-indigo-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                              抖音分析
                            </button>
                            <button 
                              onClick={() => setPlatform('Xiaohongshu')}
                              className={`flex-1 text-center py-2 text-[11px] font-bold rounded-lg transition-all ${platform === 'Xiaohongshu' ? 'bg-white text-indigo-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                              小红书分析
                            </button>
                          </div>

                          {/* 🌶️ Catering Exclusive Mode Selector Panel */}
                          <button
                            onClick={() => {
                              setCateringExclusive(prev => !prev);
                              // Reset city filter if disabling
                              if (cateringExclusive) {
                                setSelectedCityFilter('全部');
                              }
                            }}
                            className={`w-full mt-3 p-3 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer relative overflow-hidden outline-none ${
                              cateringExclusive 
                                ? 'bg-gradient-to-r from-orange-500 to-amber-500 border-transparent text-white shadow-md active:scale-98' 
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-98'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 z-10">
                              <span className="text-base select-none">🌶️</span>
                              <div>
                                <h4 className="text-[11px] font-bold leading-tight">餐饮行业专属模式</h4>
                                <p className={`text-[9px] font-mono leading-tight mt-0.5 ${cateringExclusive ? 'text-amber-100' : 'text-slate-400'}`}>
                                  核心覆盖：成渝抗（成都、重庆、杭州）餐饮大盘
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 z-10">
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${cateringExclusive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                {cateringExclusive ? '已开启' : '已关闭'}
                              </span>
                            </div>
                          </button>

                          {cateringExclusive && (
                            <div className="bg-slate-50/80 border border-slate-200/60 rounded-xl p-2.5 mt-2 shadow-inner">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[9px] font-bold text-slate-500 flex items-center gap-1 select-none">
                                  🗺️ 核心城市地理位置聚合策略
                                </span>
                                <span className="text-[8px] font-mono text-indigo-600 font-bold bg-indigo-50 px-1 rounded">
                                  精准餐饮探店
                                </span>
                              </div>
                              <div className="grid grid-cols-4 gap-1">
                                {(['全部', '成都', '重庆', '杭州'] as const).map((city) => {
                                  const count = database.filter(x => 
                                    x.platform === platform && 
                                    (city === '全部' ? ["成都", "重庆", "杭州"].includes(x.city || "") : x.city === city)
                                  ).length;
                                  return (
                                    <button
                                      key={city}
                                      onClick={() => setSelectedCityFilter(city)}
                                      className={`py-1 rounded-lg text-[9px] font-bold cursor-pointer transition-all ${selectedCityFilter === city ? 'bg-slate-800 text-white shadow-xs scale-102' : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-600'}`}
                                    >
                                      {city === '全部' ? '全部' : city} ({count})
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Top AI predicted star section */}
                        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm mb-5">
                          <div className="flex items-center gap-1.5 mb-3 text-slate-800">
                            <Zap className="w-4 h-4 text-indigo-600" />
                            <h3 className="text-xs font-bold font-display uppercase tracking-wider">AI潜力新星预测</h3>
                          </div>
                          
                          <div 
                            onClick={() => {
                              const found = database.find(x => x.id === "Taozijie");
                              if (found) setSelectedCreator(found);
                            }}
                            className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 flex items-center gap-3.5 hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <img 
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzjeej0CI_4b9zsTHPubk043Lz0jcAxUtL0N5MOkcF03gvg7X9_6Gs81wVaqFf5l84l7qle3IjLbOC6QwnnUYQUweIUy-38hNkvWa00cfRenyr5K-V_XZYg10YbEA-OPja5rh1EOHoY1yA2DYzlu0EiSKTn4yyuhP2dyO-aaLopO11jgAg0Xb0OSNm6WSLWDcemAr_c1te_jwTMY-F63dLfcgI6CRqyJ3GVowe35JG65Vx0ohWBPtBc1tqRPmc-ZgtgVgIcfSBin4" 
                              alt="Taozijie" 
                              className="w-12 h-12 rounded-full object-cover border border-slate-200" 
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-slate-800 truncate">@蜀中桃子姐</h4>
                              <p className="text-[10px] text-slate-500 font-mono mt-0.5">川菜民俗餐饮智能推荐</p>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-bold text-teal-600 block leading-tight font-mono">+84%</span>
                              <span className="text-[9px] text-slate-400 font-mono">环比增长</span>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3 pl-1">
                            <span className="bg-teal-50 border border-teal-200/50 text-teal-700 text-[9px] font-mono px-2 py-0.5 rounded-md">高频活跃</span>
                            <span className="bg-indigo-50 border border-indigo-200/50 text-indigo-700 text-[9px] font-mono px-2 py-0.5 rounded-md">上升赛道第一</span>
                          </div>
                        </div>

                        {/* Region-based hot creator distribution map */}
                        <InfluenceMap 
                          currentPlatform={platform} 
                          onCitySelect={(city) => {
                            if (["成都", "重庆", "杭州"].includes(city)) {
                              setCateringExclusive(true);
                              setSelectedCityFilter(city as '全部' | '成都' | '重庆' | '杭州');
                              showToastNotification(`🎯 已定位到【${city}】餐饮专属数据下钻分析！`);
                            } else {
                              showToastNotification(`🌶️ 餐饮行业模式仅对【成渝杭】核心商圈提供深度位置策略。`);
                            }
                          }}
                        />

                        {/* Popular categories section */}
                        <div className="bg-white border border-[#eceef1] rounded-2xl p-4 shadow-sm mb-5">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-1.5 text-slate-800">
                              <Flame className="w-4 h-4 text-orange-500" />
                              <h3 className="text-xs font-bold font-display uppercase tracking-wider">热门分析领域</h3>
                            </div>
                            <button className="text-[9px] text-indigo-600 hover:underline">查看全部</button>
                          </div>
                          <div className="flex flex-col gap-2">
                            {activeCategoryList.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100/50 transition-colors">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">{item.icon}</span>
                                  <span className="text-xs text-slate-800 font-medium">{item.name}</span>
                                </div>
                                <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/30">
                                  热度: {item.heat}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Top Creators ranks list block */}
                        <div className="bg-white border border-[#eceef1] rounded-2xl p-4 shadow-sm mb-4">
                          <div className="flex justify-between items-end mb-4">
                            <div>
                              <h3 className="text-sm font-bold text-slate-800">实时热度榜</h3>
                              <p className="text-[10px] text-slate-400 mt-0.5">多平台网络达人抓取</p>
                            </div>
                            <button 
                              onClick={triggerPullDownRefresh}
                              className="p-1 px-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-[10px] text-indigo-700 flex items-center gap-1.5 outline-none transition-all active:scale-95 cursor-pointer bg-white font-mono"
                            >
                              <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
                              模拟下拉刷新
                            </button>
                          </div>

                          <div className="flex flex-col gap-2.5">
                            {filteredDatabase.length === 0 ? (
                              <div className="text-center py-8 px-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                                <span className="text-xl block mb-1">🌶️</span>
                                <h4 className="text-xs font-bold text-slate-700">没有符合筛选条件的达人</h4>
                                <p className="text-[10px] text-slate-400 mt-1 max-w-[200px] mx-auto leading-relaxed">
                                  当前城市暂无抓取到的数据。请尝试在上方输入新达人ID进行AI诊断自动添加！
                                </p>
                              </div>
                            ) : (
                              filteredDatabase.map((item, idx) => (
                                <motion.div 
                                  key={item.id}
                                  onClick={() => setSelectedCreator(item)}
                                  whileHover={{ 
                                    scale: 1.02, 
                                    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.05)",
                                    borderColor: "rgba(99, 102, 241, 0.2)"
                                  }}
                                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                  className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 cursor-pointer flex items-center gap-3 active:scale-98"
                                >
                                  <span className="text-xs font-mono font-bold text-slate-400 w-4 text-center">{idx + 1}</span>
                                  <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1 font-bold text-xs text-slate-800">
                                      <span className="truncate">{item.name}</span>
                                      <span className="text-teal-600">✓</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                      <p className="text-[9px] text-slate-400 font-mono truncate max-w-[120px]">{item.category}</p>
                                      {item.city && (
                                        <span className="text-[8px] px-1 bg-amber-50 text-amber-700 border border-amber-200/50 rounded leading-none py-0.5 font-bold font-mono">
                                          {item.city}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-xs font-mono font-bold text-slate-800 block">{item.followers}</span>
                                    <span className="text-[9px] text-teal-600 font-mono flex items-center justify-end gap-0.5">
                                      ▲ {item.engagementRate}
                                    </span>
                                  </div>
                                </motion.div>
                              ))
                            )}
                          </div>
                        </div>

                      </motion.div>
                    ) : activeTab === 'analytics' ? (
                      /* 📊 Analytics Dashboard Tab */
                      <motion.div 
                        key="tab-analytics"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4"
                      >
                        <div className="mb-4">
                          <h3 className="text-sm font-bold text-slate-800">全网深度分析</h3>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Multichannel Distribution Board</p>
                        </div>

                        {/* KPI Grid */}
                        <div className="grid grid-cols-2 gap-2.5 mb-5">
                          <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xs">
                            <span className="text-[10px] text-slate-400 block font-mono">总曝光量 (30天)</span>
                            <span className="text-lg font-bold font-mono text-indigo-950 block mt-1">124.5M</span>
                            <span className="text-[9px] text-teal-600 font-mono">▲ +15.2% 环比</span>
                          </div>

                          <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xs">
                            <span className="text-[10px] text-slate-400 block font-mono">平均粉丝转化率</span>
                            <span className="text-lg font-bold font-mono text-indigo-950 block mt-1">3.8%</span>
                            <span className="text-[9px] text-teal-600 font-mono">▲ +0.4% 本月</span>
                          </div>

                          <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xs">
                            <span className="text-[10px] text-slate-400 block font-mono">预估平均ROI</span>
                            <span className="text-lg font-bold font-mono text-indigo-950 block mt-1">1 : 2.4</span>
                            <span className="text-[9px] text-slate-400 font-mono">▬ 持平平均水平</span>
                          </div>

                          <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xs">
                            <span className="text-[10px] text-slate-400 block font-mono">活跃合作达人</span>
                            <span className="text-lg font-bold font-mono text-indigo-950 block mt-1">42 名</span>
                            <span className="text-[9px] text-teal-600 font-mono">▲ 本周新增5人</span>
                          </div>
                        </div>

                        {/* Line Chart showing Simulated Exposure Trend overlay */}
                        <div className="bg-white border border-[#eceef1] rounded-2xl p-4 shadow-sm mb-5">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-bold text-slate-800">全网流量月度走势</span>
                            <span className="text-[9px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-mono">近30天</span>
                          </div>
                          
                          {/* SVG Line path renderer for high visual density and safety */}
                          <div className="h-28 w-full p-1 relative flex items-end">
                            <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                              <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#006876" stopOpacity="0.25" />
                                  <stop offset="100%" stopColor="#006876" stopOpacity="0" />
                                </linearGradient>
                              </defs>
                              <path 
                                d="M 0,30 L 10,25 L 20,28 L 30,12 L 40,24 L 50,18 L 60,8 L 70,16 L 80,10 L 90,4 L 100,8" 
                                fill="none" 
                                stroke="#00bcd4" 
                                strokeWidth="1.5" 
                              />
                              <path 
                                d="M 0,30 L 10,25 L 20,28 L 30,12 L 40,24 L 50,18 L 60,8 L 70,16 L 80,10 L 90,4 L 100,8 L 100,30 L 0,30 Z" 
                                fill="url(#chartGradient)" 
                              />
                            </svg>
                          </div>
                          <div className="flex justify-between text-[8px] text-slate-400 font-mono mt-2">
                            <span>1号</span>
                            <span>10号</span>
                            <span>20号</span>
                            <span>30号</span>
                          </div>
                        </div>

                        {/* Platform Distribution doughnut */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                          <span className="text-xs font-bold text-slate-800 block border-b border-slate-100 pb-2 mb-3">合作活跃分布</span>
                          <div className="flex items-center gap-4">
                            <div className="relative w-14 h-14 rounded-full border-[6px] border-indigo-600 flex items-center justify-center">
                              <span className="text-[10px] font-mono font-bold">55%</span>
                            </div>
                            <div className="text-[10px] leading-relaxed font-mono text-slate-600 flex-1">
                              <div className="flex justify-between">
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-600 block"></span> 小红书</span>
                                <span className="font-bold text-slate-900">55%</span>
                              </div>
                              <div className="flex justify-between mt-1">
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-600 block"></span> 抖音</span>
                                <span className="font-bold text-slate-900">30%</span>
                              </div>
                              <div className="flex justify-between mt-1">
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-200 block"></span> Bilibili / 其他</span>
                                <span className="font-bold text-slate-900">15%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : activeTab === 'ailab' ? (
                      /* 🧠 AI Lab Tab matching Image 4 (Interactions API / script tools!) */
                      <motion.div 
                        key="tab-ailab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 flex flex-col gap-4"
                      >
                        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                          <div className="flex items-center gap-1.5 mb-2 text-indigo-900">
                            <Sparkles className="w-4 h-4 text-indigo-600" />
                            <h3 className="text-xs font-bold">脚本灵感生成器 (WeChat Wxml Live Tool)</h3>
                          </div>
                          <p className="text-[10px] text-slate-400 mb-3 leading-relaxed">
                            调用 Gemini API 生成拍摄剧本与分镜头，并匹配标准分镜时间。
                          </p>

                          <div className="flex flex-col gap-2.5">
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">脚本主题</label>
                              <input 
                                type="text"
                                value={scriptTopic}
                                onChange={(e) => setScriptTopic(e.target.value)}
                                placeholder="输入脚本创意 (例：平价好用口红测评)"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono focus:outline-none focus:border-indigo-600"
                              />
                            </div>
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">行业类目</label>
                                <select 
                                  value={scriptCategory}
                                  onChange={(e) => setScriptCategory(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono focus:outline-none"
                                >
                                  <option>川湘火锅江湖菜</option>
                                  <option>精致创意杭帮菜</option>
                                  <option>早茶点心与粤菜</option>
                                  <option>街头小吃与大排档</option>
                                </select>
                              </div>
                              <button 
                                onClick={handleGenerateScript}
                                disabled={isLoadingScript}
                                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs px-3 py-2 rounded-lg self-end h-[34px] cursor-pointer"
                              >
                                {isLoadingScript ? "生成中..." : "一键出脚本"}
                              </button>
                            </div>
                          </div>

                          {generatedScript && (
                            <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-3 max-h-[220px] overflow-y-auto no-scrollbar font-mono text-[10px] leading-relaxed">
                              <div className="font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2">
                                🎬 {generatedScript.title}
                              </div>
                              {generatedScript.scenes.map((sc, i) => (
                                <div key={i} className="mb-2 border-b border-slate-100 pb-1.5 last:border-0">
                                  <div className="flex justify-between text-[#1a237e] font-bold">
                                    <span>第 {sc.sceneNum} 镜</span>
                                    <span>时长 {sc.duration}</span>
                                  </div>
                                  <div className="text-slate-800 mt-0.5">画面: {sc.visual}</div>
                                  <div className="text-slate-600 italic">旁白: {sc.audio}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Title click prediction */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                          <div className="flex items-center gap-1.5 mb-1 text-slate-800">
                            <Sparkles className="w-4 h-4 text-teal-600" />
                            <h3 className="text-xs font-bold">爆火标题预测 (WXML CTR Predictor)</h3>
                          </div>
                          
                          <div className="flex flex-col gap-2.5 mt-3">
                            <div>
                              <input 
                                type="text"
                                value={titleDraft}
                                onChange={(e) => setTitleDraft(e.target.value)}
                                placeholder="输入备选文章/视频标题"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono focus:outline-none"
                              />
                            </div>
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <select 
                                  value={titleCategory}
                                  onChange={(e) => setTitleCategory(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono focus:outline-none"
                                >
                                  <option>川湘火锅江湖菜</option>
                                  <option>精致创意杭帮菜</option>
                                  <option>早茶点心与粤菜</option>
                                </select>
                              </div>
                              <button 
                                onClick={handlePredictTitle}
                                disabled={isLoadingTitle}
                                className="bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-semibold text-xs px-3 py-2 rounded-lg self-end h-[34px] cursor-pointer"
                              >
                                {isLoadingTitle ? "计算中" : "AI测爆火概率"}
                              </button>
                            </div>
                          </div>

                          {titlePrediction && (
                            <div className="mt-4 bg-slate-50/70 border border-slate-200 rounded-xl p-3 font-mono text-[10px] flex flex-col gap-2">
                              <div className="flex justify-between items-center bg-white p-2 rounded border border-slate-100">
                                <span>综合潜力得分：</span>
                                <span className="font-bold text-teal-600 text-sm">{titlePrediction.score}分</span>
                              </div>
                              <div className="flex justify-between items-center bg-white p-2 rounded border border-slate-100">
                                <span>预期点击率 (CTR)：</span>
                                <span className="font-bold text-slate-800 font-mono">{titlePrediction.ctrRange}</span>
                              </div>
                              <div className="text-[10px] text-slate-600 leading-normal pl-1 border-l-2 border-indigo-200/50">
                                <div className="font-bold text-slate-800 mb-0.5">💡 AI 润色建议：</div>
                                {titlePrediction.suggestions.map((sg, i) => (
                                  <div key={i} className="mb-0.5">• {sg}</div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ) : (
                      /* 👤 Mine (Personal center) */
                      <motion.div 
                        key="tab-mine"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4"
                      >
                        <div className="flex flex-col items-center mt-3 mb-6">
                          <img 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDG9vt8xDfPJvG7FAJBcQ1r3NVHOgMu5MSLkYbKxCVuUgrna9IoZLb__7hbIKuoSgM5Lzzq2KW63-vQ9PX892mmQGJ3RPH1BMfSGSnw-PH2hMuvRK0oL9rTMiwJ_rqyhz0r806LL8bHEF7nh8_dAk5F6j0eWHD6A26urVSXhrd3uhal_1SYtCVdgMgxvVqSku__L7uFeWduBkLCaRtSAKz2M1Zs6KCTZKP2jPzpihF6MyLpIQW9QLmQ3EVSueL2TD2lIP7NYadi5wU" 
                            alt="Emily Chen" 
                            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md mb-2"
                          />
                          <h3 className="text-sm font-bold text-slate-900">Emily Chen</h3>
                          <span className="bg-amber-100 border border-amber-300 text-amber-800 text-[9px] font-bold px-2.5 py-0.5 rounded-full mt-1 flex items-center gap-1">
                            👑 高级专业版用户
                          </span>
                        </div>

                        {/* Personal stats */}
                        <div className="grid grid-cols-3 gap-2.5 mb-5 text-center font-mono text-[10px] text-slate-500">
                          <div className="bg-white p-2 rounded-xl border border-slate-200/50 shadow-xs">
                            <span className="text-[13px] font-bold text-indigo-900">124</span>
                            <div className="text-[9px] mt-0.5">报告生成</div>
                          </div>
                          <div className="bg-white p-2 rounded-xl border border-slate-200/50 shadow-xs">
                            <span className="text-[13px] font-bold text-indigo-900">89</span>
                            <div className="text-[9px] mt-0.5">监测账号</div>
                          </div>
                          <div className="bg-white p-2 rounded-xl border border-slate-200/50 shadow-xs">
                            <span className="text-[13px] font-bold text-indigo-900">3.2k</span>
                            <div className="text-[9px] mt-0.5">API调用</div>
                          </div>
                        </div>

                        {/* Options lists panel */}
                        <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-xs text-xs font-medium text-slate-700">
                          <div className="flex justify-between items-center p-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer">
                            <span>我的收藏</span>
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          </div>
                          <div className="flex justify-between items-center p-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer">
                            <span>历史诊断报告</span>
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          </div>
                          <div className="flex justify-between items-center p-3 hover:bg-slate-50 cursor-pointer">
                            <span>参数设置 / API连接控制</span>
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          </div>
                        </div>
                      </motion.div>
                    )
                  )}
                </AnimatePresence>

              </div>

              {/* Bottom WeChat Tab Bar (Only when on root dashboard) */}
              <div className="bg-white border-t border-slate-200/60 px-2 py-1.5 flex justify-around items-center text-slate-500 z-10 sticky bottom-0">
                <button 
                  onClick={() => {
                    setSelectedCreator(null);
                    setActiveTab('discover');
                  }}
                  className={`flex flex-col items-center gap-0.5 text-[9px] font-bold transition-all cursor-pointer ${activeTab === 'discover' && !selectedCreator ? 'text-indigo-900 scale-105' : 'text-slate-400'}`}
                >
                  <Compass className="w-4.5 h-4.5" />
                  <span>探索</span>
                </button>

                <button 
                  onClick={() => {
                    setSelectedCreator(null);
                    setActiveTab('analytics');
                  }}
                  className={`flex flex-col items-center gap-0.5 text-[9px] font-bold transition-all cursor-pointer ${activeTab === 'analytics' ? 'text-indigo-900 scale-105' : 'text-slate-400'}`}
                >
                  <ChartIcon className="w-4.5 h-4.5" />
                  <span>深度分析</span>
                </button>

                <button 
                  onClick={() => {
                    setSelectedCreator(null);
                    setActiveTab('ailab');
                  }}
                  className={`flex flex-col items-center gap-0.5 text-[9px] font-bold transition-all cursor-pointer ${activeTab === 'ailab' ? 'text-indigo-900 scale-105' : 'text-slate-400'}`}
                >
                  <Sparkles className="w-4.5 h-4.5" />
                  <span>AI实验室</span>
                </button>

                <button 
                  onClick={() => {
                    setSelectedCreator(null);
                    setActiveTab('mine');
                  }}
                  className={`flex flex-col items-center gap-0.5 text-[9px] font-bold transition-all cursor-pointer ${activeTab === 'mine' ? 'text-indigo-900 scale-105' : 'text-slate-400'}`}
                >
                  <Person className="w-4.5 h-4.5" />
                  <span>我的</span>
                </button>
              </div>

            </div>
          </div>
          
        </section>

      </main>

      {/* Standard bottom branding credit */}
      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-4 text-center text-xs font-mono text-slate-500">
        <p>© 2026 达人情报局. Engineered using React, Express, and Google Gemini Pro.</p>
      </footer>
    </div>
  );
}
