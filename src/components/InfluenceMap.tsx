import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Flame, Users, Sparkles } from 'lucide-react';

interface CityHeat {
  name: string;
  x: number; // SVG center coordinate
  y: number;
  dyHeat: number; // Douyin heat index (0-100)
  xhsHeat: number; // Xiaohongshu heat index (0-100)
  topCategory: string;
  count: string;
}

const CITY_DATA: CityHeat[] = [
  { name: "成都", x: 80, y: 140, dyHeat: 98, xhsHeat: 91, topCategory: "川渝地道火锅 / 社区餐饮探店 / 小吃", count: "185K+" },
  { name: "重庆", x: 92, y: 158, dyHeat: 99, xhsHeat: 93, topCategory: "九宫格老火锅 / 码头江湖菜 / 特色吃播", count: "168K+" },
  { name: "杭州", x: 195, y: 135, dyHeat: 94, xhsHeat: 88, topCategory: "江浙精细杭帮菜 / 创意融合菜 / 下午茶", count: "145K+" },
  { name: "上海", x: 215, y: 120, dyHeat: 85, xhsHeat: 96, topCategory: "西餐日料 / 精致Bistro / 烘焙甜品控", count: "130K+" },
  { name: "广州", x: 160, y: 195, dyHeat: 89, xhsHeat: 84, topCategory: "广式粤菜早茶 / 潮汕牛肉火锅 / 大排档", count: "115K+" },
  { name: "北京", x: 165, y: 55, dyHeat: 82, xhsHeat: 75, topCategory: "京城胡同融合菜 / 传统铜锅涮肉 / 烤鸭", count: "98K+" }
];

interface InfluenceMapProps {
  currentPlatform: 'Douyin' | 'Xiaohongshu';
  onCitySelect?: (city: string) => void;
}

export default function InfluenceMap({ currentPlatform, onCitySelect }: InfluenceMapProps) {
  const [selectedCity, setSelectedCity] = useState<CityHeat>(CITY_DATA[0]); // Default to Chengdu

  const getHeatValue = (city: CityHeat) => {
    return currentPlatform === 'Douyin' ? city.dyHeat : city.xhsHeat;
  };

  // Sort descending by current heat for progress bars
  const sortedCities = [...CITY_DATA].sort((a, b) => getHeatValue(b) - getHeatValue(a));

  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm mb-5">
      
      {/* Block Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
        <div className="flex items-center gap-1.5 text-slate-800">
          <span className="text-indigo-600">🗺️</span>
          <h3 className="text-xs font-bold font-display uppercase tracking-wider">MCN地域达人活跃热力</h3>
        </div>
        <span className="text-[9px] bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-0.5 rounded-full font-mono font-bold animate-pulse">
          LIVE 地区指数
        </span>
      </div>

      <p className="text-[10px] text-slate-500 leading-tight mb-3 font-mono">
        全网餐饮与美食探店达人活跃热度分布，重点覆盖川渝热辣老饕地（成都、重庆）及杭帮精致料理商圈：
      </p>

      {/* SVG Stylized China Map Grid & Hotspots */}
      <div className="relative w-full aspect-[4/3] bg-slate-50/75 border border-slate-100 rounded-xl overflow-hidden flex items-center justify-center p-2 mb-4">
        
        {/* Subtle decorative futuristic network background grid lines */}
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 1.2px, transparent 1.2px)', 
          backgroundSize: '16px 16px' 
        }}></div>

        {/* Dynamic Glowing Halo for selected city */}
        <AnimatePresence>
          <motion.div 
            key={selectedCity.name}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 0.35 }}
            exit={{ opacity: 0 }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
            className="absolute rounded-full border border-indigo-400 bg-indigo-200"
            style={{
              width: `${getHeatValue(selectedCity) * 0.7}px`,
              height: `${getHeatValue(selectedCity) * 0.7}px`,
              left: `${selectedCity.x - (getHeatValue(selectedCity) * 0.35)}px`,
              top: `${selectedCity.y - (getHeatValue(selectedCity) * 0.35)}px`,
              pointerEvents: "none"
            }}
          />
        </AnimatePresence>

        {/* China Coastline Schematic Wireframe (Faint Vector Representation) */}
        <svg className="absolute inset-0 w-full h-full text-slate-200" viewBox="0 0 280 230" fill="none">
          <path d="M40,110 C50,115 65,100 85,115 C105,130 110,105 130,95 C145,85 155,90 170,80 C185,70 190,40 175,30 C160,20 180,10 200,35 C215,55 220,68 205,80 C190,92 212,105 220,115 C228,125 210,140 195,155 C180,170 170,185 160,205 C150,225 145,210 135,195 C125,180 110,185 100,170 C90,155 70,165 50,150 C30,135 30,120 40,110 Z" 
                stroke="currentColor" 
                strokeWidth="1.2" 
                strokeDasharray="4,4" 
                className="opacity-65"
          />
        </svg>

        {/* City Hotspots */}
        <div className="absolute inset-0">
          {CITY_DATA.map((city) => {
            const isSelected = city.name === selectedCity.name;
            const heat = getHeatValue(city);
            // Size of core indicator dot proportional to heat
            const heatSize = 10 + (heat / 100) * 12;

            return (
              <div 
                key={city.name}
                onClick={() => {
                  setSelectedCity(city);
                  onCitySelect?.(city.name);
                }}
                className="absolute cursor-pointer select-none group"
                style={{ left: `${city.x}px`, top: `${city.y}px` }}
              >
                {/* Outward pulse core ring */}
                <span 
                  className={`absolute -left-[5px] -top-[5px] rounded-full filter blur-[1.5px] transition-all ${isSelected ? 'bg-indigo-600 scale-125' : 'bg-cyan-500 opacity-60 group-hover:opacity-100'}`}
                  style={{
                    width: `${heatSize}px`,
                    height: `${heatSize}px`,
                    backgroundColor: isSelected ? '#4f46e5' : '#06b6d4'
                  }}
                />

                {/* Pin core indicator dot */}
                <div 
                  className={`w-2.5 h-2.5 rounded-full border-1.5 border-white flex items-center justify-center transition-transform ${isSelected ? 'bg-slate-900 scale-125 shadow-md' : 'bg-white'}`}
                />

                {/* Small City Name Label */}
                <span 
                  className={`absolute left-4 -top-2 text-[9px] font-bold px-1 py-0.5 rounded border antialiased font-mono whitespace-nowrap transition-all ${isSelected ? 'bg-indigo-950 text-white border-indigo-900 shadow-sm' : 'bg-white text-slate-700 border-slate-200 group-hover:border-slate-300'}`}
                >
                  {city.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Detail Box */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1 font-display">
            <MapPin className="w-3.5 h-3.5 text-indigo-600" />
            已选地区：{selectedCity.name}信标
          </span>
          <span className="text-[9px] font-mono font-bold text-cyan-700 bg-cyan-100/60 px-2 py-0.5 rounded-md">
            MCN数量: {selectedCity.count}
          </span>
        </div>
        
        <div className="space-y-1 text-[10px] text-slate-600 font-mono">
          <div className="flex justify-between">
            <span>主力赛道类目:</span>
            <span className="text-slate-900 font-bold">{selectedCity.topCategory}</span>
          </div>
          <div className="flex justify-between">
            <span>当前平台热度:</span>
            <span className="text-indigo-900 font-bold flex items-center gap-0.5">
              <Flame className="w-3 h-3 text-red-500" />
              {getHeatValue(selectedCity)}% (排名第 {sortedCities.findIndex(c => c.name === selectedCity.name) + 1})
            </span>
          </div>
        </div>
      </div>

      {/* Tiny sorted list bars */}
      <div className="space-y-1.5">
        {sortedCities.map((city, index) => {
          const isSelected = city.name === selectedCity.name;
          const heatVal = getHeatValue(city);

          return (
            <div 
              key={city.name}
              onClick={() => setSelectedCity(city)}
              className={`flex items-center gap-2 p-1.5 rounded-lg border transition-all cursor-pointer ${isSelected ? 'bg-indigo-50 border-indigo-200/50' : 'bg-white border-slate-100 hover:border-slate-200'}`}
            >
              <span className={`w-4 text-center font-mono text-[9px] font-bold ${index < 3 ? 'text-indigo-900' : 'text-slate-400'}`}>
                {index + 1}
              </span>
              <span className="w-7 text-[10px] font-bold text-slate-700">{city.name}</span>
              
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${index === 0 ? 'bg-gradient-to-r from-red-500 to-indigo-600' : 'bg-indigo-500'}`}
                  style={{ width: `${heatVal}%` }}
                ></div>
              </div>

              <span className="w-8 text-right font-mono text-[9px] font-bold text-slate-500">
                {heatVal}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
