# 散步心象地图 - 产品设计文档 (PDD)

## 1. 系统架构概览

### 1.1 技术栈选择
```
Frontend: React 18 + TypeScript + Vite
Styling: Tailwind CSS 3.x
Map: 高德地图 JavaScript API v2.0
State: Zustand (轻量级状态管理)
Storage: SuperDB
Build: Vite + PWA Plugin
```

### 1.2 项目结构
```
src/
├── components/           # 组件库
│   ├── Map/             # 地图相关组件
│   ├── Cards/           # 卡片相关组件
│   ├── UI/              # 通用UI组件
│   └── Modals/          # 弹窗组件
├── hooks/               # 自定义Hooks
├── stores/              # 状态管理
├── services/            # 服务层
├── types/               # TypeScript类型定义
├── utils/               # 工具函数
└── constants/           # 常量配置
```

## 2. 核心组件设计

### 2.1 地图组件架构

#### MapContainer.tsx
```typescript
interface MapContainerProps {
  userLocation: GeolocationCoordinates | null;
  routePoints: RoutePoint[];
  emotionMarks: EmotionMark[];
  className?: string;
}

interface RoutePoint {
  lat: number;
  lng: number;
  timestamp: number;
}

interface EmotionMark {
  id: string;
  lat: number;
  lng: number;
  emotion: string;
  timestamp: number;
  cardType: CardType;
}

const MapContainer: React.FC<MapContainerProps> = ({
  userLocation,
  routePoints,
  emotionMarks,
  className
}) => {
  // 地图实例管理
  // 路线绘制逻辑
  // 标记点渲染
  // 实时位置更新
}
```

#### 高德地图配置
```typescript
// constants/mapConfig.ts
export const MAP_CONFIG = {
  key: process.env.VITE_AMAP_KEY,
  version: '2.0',
  plugins: ['AMap.Scale', 'AMap.ToolBar'],
  mapStyle: 'amap://styles/custom-minimal',
  zoom: 16,
  pitch: 0,
  rotation: 0,
  dragEnable: false,      // 禁用拖拽，地图始终跟随用户
  zoomEnable: false,
  doubleClickZoom: false,
  keyboardEnable: false,
  scrollWheel: false,
  touchZoom: false,
  rotateEnable: false,
  pitchEnable: false,
  animateEnable: true,    // 启用动画，地图移动更平滑
} as const;

// 自定义地图样式
export const CUSTOM_MAP_STYLE = [
  {
    featureType: 'background',
    elementType: 'geometry',
    stylers: [{ color: '#F5F5F5' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#CCCCCC' }, { weight: 1 }]
  },
  {
    featureType: 'road',
    elementType: 'geometry.fill', 
    stylers: [{ color: '#FFFFFF' }]
  },
  {
    featureType: 'poi',
    elementType: 'all',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'transit',
    elementType: 'all',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'administrative',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }]
  }
];
```

### 2.2 散步卡片系统

#### Card组件设计
```typescript
// types/card.ts
export enum CardType {
  OBSERVATION = 'observation',
  MOVEMENT = 'movement', 
  INTERACTION = 'interaction',
  REFLECTION = 'reflection',
  DISCOVERY = 'discovery'
}

export interface CardConfig {
  type: CardType;
  markable: boolean;
  color: string;
  icon: string;
  examples: string[];
}

export interface WalkCard {
  id: string;
  type: CardType;
  content: string;
  estimatedTime?: number;
  aiGenerated: boolean;
  createdAt: number;
}

// constants/cardTypes.ts
export const CARD_CONFIGS: Record<CardType, CardConfig> = {
  [CardType.OBSERVATION]: {
    type: CardType.OBSERVATION,
    markable: true,
    color: 'bg-blue-500',
    icon: '👁️',
    examples: [
      '寻找下一个让你印象深刻的颜色',
      '注意接下来听到的第一个声音',
      '观察周围最特别的纹理或材质'
    ]
  },
  [CardType.MOVEMENT]: {
    type: CardType.MOVEMENT,
    markable: false, 
    color: 'bg-green-500',
    icon: '🚶',
    examples: [
      '向你的左手边走3分钟',
      '跟随前方的第一个人走一小段',
      '选择看起来最不起眼的路径'
    ]
  },
  [CardType.INTERACTION]: {
    type: CardType.INTERACTION,
    markable: true,
    color: 'bg-orange-500', 
    icon: '🤝',
    examples: [
      '观察一个陌生人30秒，想象他们的故事',
      '触摸你经过的下一个有趣表面',
      '向路过的人微笑'
    ]
  },
  [CardType.REFLECTION]: {
    type: CardType.REFLECTION,
    markable: true,
    color: 'bg-purple-500',
    icon: '🧘',
    examples: [
      '找个地方站定，闭眼听周围声音1分钟',
      '回想这条街道给你的第一印象',
      '感受此刻的身体状态'
    ]
  },
  [CardType.DISCOVERY]: {
    type: CardType.DISCOVERY,
    markable: false,
    color: 'bg-red-500',
    icon: '🔍', 
    examples: [
      '寻找一条你从未走过的小路',
      '向最吸引你的建筑方向前进',
      '探索一个被忽视的角落'
    ]
  }
};
```

#### WalkCard组件
```typescript
// components/Cards/WalkCard.tsx
interface WalkCardProps {
  card: WalkCard;
  onComplete: (cardId: string) => void;
  onSkip: (cardId: string) => void;
  isActive: boolean;
}

const WalkCard: React.FC<WalkCardProps> = ({
  card,
  onComplete,
  onSkip,
  isActive
}) => {
  const config = CARD_CONFIGS[card.type];
  
  return (
    <div className={`
      relative p-6 rounded-xl shadow-lg transition-all duration-300
      ${config.color} text-white
      ${isActive ? 'scale-105' : 'scale-95 opacity-70'}
    `}>
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-3">{config.icon}</span>
        <span className="text-sm font-medium opacity-90">
          {card.type.toUpperCase()}
        </span>
      </div>
      
      <p className="text-lg leading-relaxed mb-6">
        {card.content}
      </p>
      
      {card.estimatedTime && (
        <div className="text-sm opacity-75 mb-4">
          预计用时: {card.estimatedTime}分钟
        </div>
      )}
      
      <div className="flex gap-3">
        <button
          onClick={() => onComplete(card.id)}
          className="flex-1 bg-white/20 hover:bg-white/30 
                     backdrop-blur-sm rounded-lg py-3 px-4
                     font-medium transition-colors"
        >
          完成
        </button>
        <button
          onClick={() => onSkip(card.id)}
          className="px-4 py-3 text-white/70 hover:text-white
                     transition-colors"
        >
          跳过
        </button>
      </div>
    </div>
  );
};
```

### 2.3 情感标记系统

#### EmotionSelector组件
```typescript
// types/emotion.ts
export interface Emotion {
  emoji: string;
  label: string;
  value: string;
}

export const EMOTIONS: Emotion[] = [
  { emoji: '😊', label: '愉悦', value: 'joy' },
  { emoji: '😮', label: '惊喜', value: 'surprise' },
  { emoji: '🤔', label: '困惑', value: 'confusion' },
  { emoji: '😌', label: '平静', value: 'calm' },
  { emoji: '😐', label: '无感', value: 'neutral' }
];

// components/Modals/EmotionSelector.tsx
interface EmotionSelectorProps {
  isVisible: boolean;
  onSelect: (emotion: string) => void;
  onAutoHide: () => void;
  autoHideDelay?: number;
}

const EmotionSelector: React.FC<EmotionSelectorProps> = ({
  isVisible,
  onSelect,
  onAutoHide,
  autoHideDelay = 8000
}) => {
  useEffect(() => {
    if (!isVisible) return;
    
    const timer = setTimeout(() => {
      onAutoHide();
    }, autoHideDelay);
    
    return () => clearTimeout(timer);
  }, [isVisible, autoHideDelay, onAutoHide]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* 遮罩层 */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onAutoHide}
      />
      
      {/* 选择器 */}
      <div className="relative w-full bg-white rounded-t-2xl p-6
                      transform transition-transform duration-300
                      animate-slide-up">
        <div className="text-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            记录此刻的感受
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {autoHideDelay / 1000}秒后自动关闭
          </p>
        </div>
        
        <div className="flex justify-center gap-4">
          {EMOTIONS.map((emotion) => (
            <button
              key={emotion.value}
              onClick={() => onSelect(emotion.emoji)}
              className="flex flex-col items-center p-3 rounded-xl
                         hover:bg-gray-100 transition-colors
                         active:scale-95 transform"
            >
              <span className="text-4xl mb-2">{emotion.emoji}</span>
              <span className="text-xs text-gray-600">{emotion.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
```
2.4 添加用户系统支持
typescript// types/user.ts
export interface User {
  userId: string;
  deviceId: string;
  createdAt: number;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  cardTypes: CardType[];
  autoEmotionPrompt: boolean;
  mapStyle: 'minimal' | 'satellite';
}

// stores/userStore.ts
interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updatePreferences: (preferences) => set(state => ({
    user: state.user ? {
      ...state.user,
      preferences: { ...state.user.preferences, ...preferences }
    } : null
  }))
}));


## 3. 状态管理设计

### 3.1 Zustand Store
```typescript
// stores/walkStore.ts
interface WalkState {
  // 散步状态
  isWalking: boolean;
  walkId: string | null;
  startTime: number | null;
  
  // 位置数据
  userLocation: GeolocationCoordinates | null;
  routePoints: RoutePoint[];
  
  // 卡片状态
  currentCard: WalkCard | null;
  cardHistory: WalkCard[];
  
  // 情感标记
  emotionMarks: EmotionMark[];
  showEmotionSelector: boolean;
  
  // 行为方法
  startWalk: () => void;
  endWalk: () => void;
  updateLocation: (location: GeolocationCoordinates) => void;
  addRoutePoint: (point: RoutePoint) => void;
  setCurrentCard: (card: WalkCard) => void;
  completeCard: (cardId: string) => void;
  addEmotionMark: (emotion: string) => void;
  showEmotionSelector: () => void;
  hideEmotionSelector: () => void;
}

export const useWalkStore = create<WalkState>((set, get) => ({
  // 初始状态
  isWalking: false,
  walkId: null,
  startTime: null,
  userLocation: null,
  routePoints: [],
  currentCard: null,
  cardHistory: [],
  emotionMarks: [],
  showEmotionSelector: false,

  // 行为实现
  startWalk: () => {
    const walkId = `walk_${Date.now()}`;
    const startTime = Date.now();
    
    set({
      isWalking: true,
      walkId,
      startTime,
      routePoints: [],
      emotionMarks: [],
      cardHistory: []
    });
  },

  endWalk: () => {
    const state = get();
    if (state.walkId) {
      // 保存散步记录到IndexedDB
      saveWalkToDatabase({
        walkId: state.walkId,
        startTime: state.startTime!,
        endTime: Date.now(),
        routePoints: state.routePoints,
        emotionMarks: state.emotionMarks,
        cardsCompleted: state.cardHistory.length
      });
    }
    
    set({
      isWalking: false,
      walkId: null,
      startTime: null,
      currentCard: null
    });
  },

  updateLocation: (location) => {
    set({ userLocation: location });
    
    // 添加路线点
    if (get().isWalking) {
      const routePoint: RoutePoint = {
        lat: location.latitude,
        lng: location.longitude,
        timestamp: Date.now()
      };
      
      set(state => ({
        routePoints: [...state.routePoints, routePoint]
      }));
    }
  },

  completeCard: (cardId) => {
    const state = get();
    const card = state.currentCard;
    
    if (card && card.id === cardId) {
      // 添加到历史记录
      set(state => ({
        cardHistory: [...state.cardHistory, card]
      }));
      
      // 如果卡片支持情感标记，显示选择器
      const config = CARD_CONFIGS[card.type];
      if (config.markable && state.userLocation) {
        set({ showEmotionSelector: true });
      }
    }
  },

  addEmotionMark: (emotion) => {
    const state = get();
    
    if (state.userLocation && state.currentCard) {
      const emotionMark: EmotionMark = {
        id: `emotion_${Date.now()}`,
        lat: state.userLocation.latitude,
        lng: state.userLocation.longitude,
        emotion,
        timestamp: Date.now(),
        cardType: state.currentCard.type
      };
      
      set(state => ({
        emotionMarks: [...state.emotionMarks, emotionMark],
        showEmotionSelector: false
      }));
    }
  },

  showEmotionSelector: () => set({ showEmotionSelector: true }),
  hideEmotionSelector: () => set({ showEmotionSelector: false })
}));
```

## 4. 服务层设计

### 4.1 地理位置服务
```typescript
// services/locationService.ts
export class LocationService {
  private watchId: number | null = null;
  private lastLocation: GeolocationCoordinates | null = null;
  
  constructor(
    private onLocationUpdate: (location: GeolocationCoordinates) => void,
    private onError: (error: GeolocationPositionError) => void
  ) {}

  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 2000
      };

      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          const location = position.coords;
          
          // 简单的位置过滤，避免GPS漂移
          if (this.shouldUpdateLocation(location)) {
            this.lastLocation = location;
            this.onLocationUpdate(location);
          }
        },
        this.onError,
        options
      );

      // 获取初始位置
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.lastLocation = position.coords;
          this.onLocationUpdate(position.coords);
          resolve();
        },
        reject,
        options
      );
    });
  }

  stop(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  private shouldUpdateLocation(newLocation: GeolocationCoordinates): boolean {
    if (!this.lastLocation) return true;
    
    const distance = this.calculateDistance(
      this.lastLocation,
      newLocation
    );
    
    // 如果移动距离小于3米，可能是GPS漂移，忽略
    return distance > 3;
  }

  private calculateDistance(
    coord1: GeolocationCoordinates,
    coord2: GeolocationCoordinates
  ): number {
    // 使用Haversine公式计算距离
    const R = 6371e3; // 地球半径（米）
    const φ1 = coord1.latitude * Math.PI / 180;
    const φ2 = coord2.latitude * Math.PI / 180;
    const Δφ = (coord2.latitude - coord1.latitude) * Math.PI / 180;
    const Δλ = (coord2.longitude - coord1.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }
}
```

### 4.2 数据存储服务
```typescript
// services/databaseService.ts
import SuperDB from 'superdb'; // 替换Dexie

class WalkDatabase {
  private db: SuperDB;
  
  constructor() {
    this.db = new SuperDB({
      url: process.env.VITE_SUPERDB_URL,
      apiKey: process.env.VITE_SUPERDB_KEY
    });
  }

  async saveWalk(walk: WalkRecord): Promise<void> {
    await this.db.collection('walks').create(walk);
  }

  async getWalkHistory(): Promise<WalkRecord[]> {
    return await this.db.collection('walks')
      .orderBy('startTime', 'desc')
      .get();
  }

  async saveCard(card: CardRecord): Promise<void> {
    await this.db.collection('cards').create(card);
  }
}

export const db = new WalkDatabase();
```

### 4.3 AI卡片生成服务
```typescript
// services/aiCardService.ts
export interface AICardRequest {
  location: {
    lat: number;
    lng: number;
  };
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  weather?: string;
  environmentType?: 'urban' | 'park' | 'residential' | 'commercial';
  cardHistory: CardType[];
}

export interface AICardResponse {
  type: CardType;
  content: string;
  estimatedTime?: number;
}

export class AICardService {
  private baseURL: string = ''; // 待定义AI服务URL
  private apiKey: string = ''; // 待定义API密钥
  
  async generateCard(request: AICardRequest): Promise<WalkCard> {
    try {
      // TODO: 实现AI API调用
      const response = await this.callAIAPI(request);
      
      return {
        id: `ai_card_${Date.now()}`,
        type: response.type,
        content: response.content,
        estimatedTime: response.estimatedTime,
        aiGenerated: true,
        createdAt: Date.now()
      };
    } catch (error) {
      console.error('Failed to generate AI card:', error);
      // 降级到预设卡片
      return this.getFallbackCard(request);
    }
  }

  private async callAIAPI(request: AICardRequest): Promise<AICardResponse> {
    // 预留AI API接口实现
    throw new Error('AI API not implemented yet');
  }

  private getFallbackCard(request: AICardRequest): WalkCard {
    // 从预设卡片中随机选择
    const availableTypes = Object.values(CardType).filter(
      type => !request.cardHistory.includes(type)
    );
    
    const randomType = availableTypes[
      Math.floor(Math.random() * availableTypes.length)
    ] || CardType.OBSERVATION;
    
    const config = CARD_CONFIGS[randomType];
    const randomExample = config.examples[
      Math.floor(Math.random() * config.examples.length)
    ];
    
    return {
      id: `fallback_card_${Date.now()}`,
      type: randomType,
      content: randomExample,
      aiGenerated: false,
      createdAt: Date.now()
    };
  }
}
```

## 5. 高德地图集成方案

### 5.1 地图初始化
```typescript
// hooks/useAmapInstance.ts
export const useAmapInstance = (containerRef: RefObject<HTMLDivElement>) => {
  const [mapInstance, setMapInstance] = useState<AMap.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const initMap = async () => {
      try {
        // 确保高德地图API已加载
        if (!window.AMap) {
          await loadAmapScript();
        }

        const map = new AMap.Map(containerRef.current!, MAP_CONFIG);
        
        // 设置自定义样式
        map.setMapStyle(MAP_CONFIG.mapStyle);
        
        setMapInstance(map);
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to initialize map:', error);
      }
    };

    initMap();

    return () => {
      if (mapInstance) {
        mapInstance.destroy();
      }
    };
  }, [containerRef]);

  return { mapInstance, isLoaded };
};

// 动态加载高德地图脚本
const loadAmapScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${MAP_CONFIG.key}&plugin=AMap.Scale,AMap.ToolBar`;
    script.async = true;
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Amap script'));
    
    document.head.appendChild(script);
  });
};
```

### 5.2 路线绘制组件
```typescript
// hooks/useRouteRenderer.ts
export const useRouteRenderer = (
  mapInstance: AMap.Map | null,
  routePoints: RoutePoint[]
) => {
  const polylineRef = useRef<AMap.Polyline | null>(null);

  useEffect(() => {
    if (!mapInstance || routePoints.length < 2) return;

    // 转换路径点格式
    const lngLatArray: [number, number][] = routePoints.map(point => [
      point.lng,
      point.lat
    ]);

    // 创建或更新路径线
    if (polylineRef.current) {
      polylineRef.current.setPath(lngLatArray);
    } else {
      polylineRef.current = new AMap.Polyline({
        path: lngLatArray,
        strokeColor: '#1890ff',
        strokeWeight: 4,
        strokeOpacity: 0.8,
        lineJoin: 'round',
        lineCap: 'round'
      });
      
      mapInstance.add(polylineRef.current);
    }

    // 平滑移动地图中心到最新位置
    if (routePoints.length > 0) {
      const lastPoint = routePoints[routePoints.length - 1];
      mapInstance.setCenter([lastPoint.lng, lastPoint.lat]);
    }

  }, [mapInstance, routePoints]);

  useEffect(() => {
    return () => {
      if (polylineRef.current && mapInstance) {
        mapInstance.remove(polylineRef.current);
      }
    };
  }, [mapInstance]);
};
```

### 5.3 标记点渲染
```typescript
// hooks/useMarkerRenderer.ts
export const useMarkerRenderer = (
  mapInstance: AMap.Map | null,
  userLocation: GeolocationCoordinates | null,
  emotionMarks: EmotionMark[]
) => {
  const userMarkerRef = useRef<AMap.Marker | null>(null);
  const emotionMarkersRef = useRef<AMap.Marker[]>([]);

  // 渲染用户位置标记
  useEffect(() => {
    if (!mapInstance || !userLocation) return;

    const position = [userLocation.longitude, userLocation.latitude];

    if (userMarkerRef.current) {
      userMarkerRef.current.setPosition(position);
    } else {
      userMarkerRef.current = new AMap.Marker({
        position,
        icon: new AMap.Icon({
          size: new AMap.Size(20, 20),
          image: '/icons/user-location.svg',
          imageSize: new AMap.Size(20, 20)
        }),
        anchor: 'center',
        zIndex: 1000
      });
      
      mapInstance.add(userMarkerRef.current);
    }
  }, [mapInstance, userLocation]);

  // 渲染情感标记
  useEffect(() => {
    if (!mapInstance) return;

    // 清除现有标记
    emotionMarkersRef.current.forEach(marker => {
      mapInstance.remove(marker);
    });
    emotionMarkersRef.current = [];

    // 创建新标记
    emotionMarks.forEach(mark => {
      const marker = new AMap.Marker({
        position: [mark.lng, mark.lat],
        content: `<div class="emotion-marker">${mark.emotion}</div>`,
        anchor: 'center',
        zIndex: 500
      });
      
      mapInstance.add(marker);
      emotionMarkersRef.current.push(marker);
    });

  }, [mapInstance, emotionMarks]);

  useEffect(() => {
    return () => {
      // 清理标记
      if (mapInstance) {
        if (userMarkerRef.current) {
          mapInstance.remove(userMarkerRef.current);
        }
        emotionMarkersRef.current.forEach(marker => {
          mapInstance.remove(marker);
        });
      }
    };
  }, [mapInstance]);
};
```

5.4 地图中心跟随逻辑
typescript// hooks/useMapCenterFollow.ts
export const useMapCenterFollow = (
  mapInstance: AMap.Map | null,
  userLocation: GeolocationCoordinates | null,
  isWalking: boolean
) => {
  const lastCenterRef = useRef<[number, number] | null>(null);

  useEffect(() => {
    if (!mapInstance || !userLocation || !isWalking) return;

    const newCenter: [number, number] = [userLocation.longitude, userLocation.latitude];
    
    // 避免频繁的地图移动，只有位置变化足够大时才更新
    if (lastCenterRef.current) {
      const distance = calculateDistance(
        { latitude: lastCenterRef.current[1], longitude: lastCenterRef.current[0] } as GeolocationCoordinates,
        userLocation
      );
      
      // 移动距离小于5米时不更新地图中心
      if (distance < 5) return;
    }

    // 平滑移动到新位置
    mapInstance.panTo(newCenter, 500); // 500ms动画时间
    lastCenterRef.current = newCenter;

  }, [mapInstance, userLocation, isWalking]);
};

## 6. 响应式设计实现

### 6.1 Tailwind配置
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-out': 'fadeOut 0.3s ease-out',
        'pulse-location': 'pulseLocation 2s infinite'
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' }
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        pulseLocation: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.2)', opacity: '0.7' }
        }
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px'
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)'
      }
    }
  },
  plugins: []
};
```

### 6.2 主布局组件
```typescript
// components/Layout/AppLayout.tsx
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* 状态栏 */}
      <header className="bg-white shadow-sm px-4 py-3 pt-safe-top
                         flex items-center justify-between
                         h-16```typescript
                         z-10">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-gray-900">散步心象</h1>
          <WalkTimer />
        </div>
        <WalkControls />
      </header>

      {/* 主要内容区域 */}
      <main className="flex-1 relative overflow-hidden">
        {children}
      </main>

      {/* 卡片区域 */}
      <section className="bg-white border-t border-gray-200 
                         pb-safe-bottom relative z-10
                         h-40 sm:h-44">
        <CardContainer />
      </section>
    </div>
  );
};

// 散步计时器组件
const WalkTimer: React.FC = () => {
  const { isWalking, startTime } = useWalkStore();
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!isWalking || !startTime) return;

    const timer = setInterval(() => {
      setDuration(Date.now() - startTime);
    }, 1000);

    return () => clearInterval(timer);
  }, [isWalking, startTime]);

  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
    }
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  if (!isWalking) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <span className="font-mono">{formatDuration(duration)}</span>
    </div>
  );
};
```

### 6.3 响应式地图容器
```typescript
// components/Map/ResponsiveMapContainer.tsx
const ResponsiveMapContainer: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { mapInstance, isLoaded } = useAmapInstance(mapContainerRef);
  const { userLocation, routePoints, emotionMarks, isWalking } = useWalkStore();

  // 现有的渲染Hooks
  useRouteRenderer(mapInstance, routePoints);
  useMarkerRenderer(mapInstance, userLocation, emotionMarks);
  
  // 新增：地图中心跟随Hook
  useMapCenterFollow(mapInstance, userLocation, isWalking);

  return (
    <div className="relative w-full h-full">
      {/* 地图容器 */}
      <div
        ref={mapContainerRef}
        className="absolute inset-0 w-full h-full"
        style={{ 
          height: 'calc(100vh - 10rem)', // 减去header和card区域高度
          minHeight: '400px'
        }}
      />

      {/* 加载状态 */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center
                       bg-gray-100">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent
                           rounded-full animate-spin" />
            <span className="text-sm text-gray-600">正在加载地图...</span>
          </div>
        </div>
      )}

    

      {/* 位置信息显示 */}
      {userLocation && (
        <LocationInfo 
          location={userLocation}
          className="absolute bottom-4 left-4"
        />
      )}
    </div>
  );
};

// 定位按钮
const LocationButton: React.FC = () => {
  const { userLocation } = useWalkStore();

  const handleLocationClick = () => {
    // 重新定位到用户当前位置
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // 地图重新聚焦到用户位置
          // mapInstance.setCenter([longitude, latitude]);
        }
      );
    }
  };

  return (
    <button
      onClick={handleLocationClick}
      className="w-10 h-10 bg-white rounded-lg shadow-md
                 flex items-center justify-center
                 hover:bg-gray-50 transition-colors"
      disabled={!userLocation}
    >
      <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
      </svg>
    </button>
  );
};
```

## 7. 卡片容器设计

### 7.1 卡片容器组件
```typescript
// components/Cards/CardContainer.tsx
const CardContainer: React.FC = () => {
  const { 
    currentCard, 
    isWalking, 
    showEmotionSelector,
    completeCard,
    hideEmotionSelector,
    addEmotionMark 
  } = useWalkStore();

  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const aiCardService = useRef(new AICardService());

  // 生成新卡片
  const generateNewCard = useCallback(async () => {
    if (!isWalking) return;

    setIsGeneratingCard(true);
    try {
      const newCard = await aiCardService.current.generateCard({
        location: { lat: 0, lng: 0 }, // 实际位置数据
        timeOfDay: 'afternoon', // 实际时间数据
        cardHistory: [] // 实际历史数据
      });
      
      useWalkStore.getState().setCurrentCard(newCard);
    } catch (error) {
      console.error('Failed to generate card:', error);
    } finally {
      setIsGeneratingCard(false);
    }
  }, [isWalking]);

  // 开始散步时生成首张卡片
  useEffect(() => {
    if (isWalking && !currentCard && !isGeneratingCard) {
      generateNewCard();
    }
  }, [isWalking, currentCard, isGeneratingCard, generateNewCard]);

  const handleCardComplete = (cardId: string) => {
    completeCard(cardId);
    // 延迟生成下一张卡片，给用户时间处理情感选择
    setTimeout(() => {
      generateNewCard();
    }, 1000);
  };

  const handleCardSkip = (cardId: string) => {
    generateNewCard();
  };

  return (
    <div className="h-full flex flex-col">
      {/* 卡片显示区域 */}
      <div className="flex-1 p-4">
        {!isWalking ? (
          <WalkStartPrompt />
        ) : isGeneratingCard ? (
          <CardLoadingState />
        ) : currentCard ? (
          <WalkCard
            card={currentCard}
            onComplete={handleCardComplete}
            onSkip={handleCardSkip}
            isActive={true}
          />
        ) : (
          <EmptyCardState />
        )}
      </div>

      {/* 情感选择器 */}
      <EmotionSelector
        isVisible={showEmotionSelector}
        onSelect={addEmotionMark}
        onAutoHide={hideEmotionSelector}
        autoHideDelay={8000}
      />
    </div>
  );
};

// 散步开始提示
const WalkStartPrompt: React.FC = () => {
  const startWalk = useWalkStore(state => state.startWalk);

  return (
    <div className="h-full flex flex-col items-center justify-center
                   text-center px-6">
      <div className="w-16 h-16 bg-blue-100 rounded-full
                     flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        开始你的城市探索
      </h3>
      
      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
        通过散步卡片的引导，重新发现熟悉的城市空间，
        记录属于你的心象地图
      </p>
      
      <button
        onClick={startWalk}
        className="bg-blue-600 hover:bg-blue-700 text-white
                   px-8 py-3 rounded-xl font-medium
                   transition-colors duration-200
                   active:scale-95 transform"
      >
        开始散步
      </button>
    </div>
  );
};

// 卡片加载状态
const CardLoadingState: React.FC = () => (
  <div className="h-full flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent
                     rounded-full animate-spin" />
      <span className="text-sm text-gray-600">正在生成新的探索任务...</span>
    </div>
  </div>
);
```

## 8. 自定义Hooks

### 8.1 地理位置Hook
```typescript
// hooks/useGeolocation.ts
interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

interface GeolocationState {
  location: GeolocationCoordinates | null;
  error: GeolocationPositionError | null;
  isLoading: boolean;
}

export const useGeolocation = (options: GeolocationOptions = {}) => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    isLoading: false
  });

  const locationServiceRef = useRef<LocationService | null>(null);
  const { updateLocation } = useWalkStore();

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: new Error('Geolocation not supported') as any,
        isLoading: false
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 2000,
      ...options
    };

    locationServiceRef.current = new LocationService(
      (location) => {
        setState({
          location,
          error: null,
          isLoading: false
        });
        updateLocation(location);
      },
      (error) => {
        setState(prev => ({
          ...prev,
          error,
          isLoading: false
        }));
      }
    );

    locationServiceRef.current.start().catch((error) => {
      setState(prev => ({
        ...prev,
        error,
        isLoading: false
      }));
    });
  }, [options, updateLocation]);

  const stopTracking = useCallback(() => {
    if (locationServiceRef.current) {
      locationServiceRef.current.stop();
      locationServiceRef.current = null;
    }
    setState(prev => ({ ...prev, isLoading: false }));
  }, []);

  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  return {
    ...state,
    startTracking,
    stopTracking
  };
};
```

### 8.2 散步会话Hook
```typescript
// hooks/useWalkSession.ts
export const useWalkSession = () => {
  const { 
    isWalking, 
    startWalk, 
    endWalk, 
    walkId,
    routePoints,
    emotionMarks,
    cardHistory
  } = useWalkStore();

  const { startTracking, stopTracking } = useGeolocation();
  
  const [sessionStats, setSessionStats] = useState({
    duration: 0,
    distance: 0,
    cardsCompleted: 0,
    emotionsRecorded: 0
  });

  // 计算会话统计
  useEffect(() => {
    if (!isWalking) return;

    const timer = setInterval(() => {
      const distance = calculateTotalDistance(routePoints);
      
      setSessionStats({
        duration: Date.now() - (useWalkStore.getState().startTime || 0),
        distance,
        cardsCompleted: cardHistory.length,
        emotionsRecorded: emotionMarks.length
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isWalking, routePoints, cardHistory.length, emotionMarks.length]);

  const handleStartWalk = useCallback(() => {
    startWalk();
    startTracking();
  }, [startWalk, startTracking]);

  const handleEndWalk = useCallback(() => {
    endWalk();
    stopTracking();
    
    // 重置统计
    setSessionStats({
      duration: 0,
      distance: 0,
      cardsCompleted: 0,
      emotionsRecorded: 0
    });
  }, [endWalk, stopTracking]);

  return {
    isWalking,
    walkId,
    sessionStats,
    startWalk: handleStartWalk,
    endWalk: handleEndWalk
  };
};

// 计算总距离的工具函数
const calculateTotalDistance = (points: RoutePoint[]): number => {
  if (points.length < 2) return 0;

  let totalDistance = 0;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    
    totalDistance += calculateDistance(
      { latitude: prev.lat, longitude: prev.lng } as GeolocationCoordinates,
      { latitude: curr.lat, longitude: curr.lng } as GeolocationCoordinates
    );
  }
  
  return totalDistance;
};
```

## 9. 样式系统

### 9.1 CSS变量和主题
```css
/* src/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* 主色调 */
  --primary-50: #eff6ff;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  
  /* 情感色彩 */
  --emotion-joy: #f59e0b;
  --emotion-surprise: #ef4444;
  --emotion-confusion: #8b5cf6;
  --emotion-calm: #10b981;
  --emotion-neutral: #6b7280;
  
  /* 地图样式 */
  --map-background: #f5f5f5;
  --map-road: #cccccc;
  --map-route: #1890ff;
  --map-user-location: #ff6b35;
  
  /* 响应式间距 */
  --container-padding: 1rem;
  --card-border-radius: 0.75rem;
  --shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

@media (min-width: 640px) {
  :root {
    --container-padding: 1.5rem;
    --card-border-radius: 1rem;
  }
}

/* 基础样式 */
@layer base {
  body {
    @apply font-sans antialiased;
    @apply bg-gray-50 text-gray-900;
    @apply overflow-hidden; /* 防止页面滚动 */
  }
  
  * {
    @apply box-border;
  }
}

/* 组件样式 */
@layer components {
  .emotion-marker {
    @apply w-8 h-8 flex items-center justify-center;
    @apply text-xl bg-white rounded-full shadow-md;
    @apply border-2 border-white;
    @apply transform transition-transform duration-200;
    @apply hover:scale-110;
  }
  
  .walk-card {
    @apply rounded-xl shadow-lg p-6;
    @apply transform transition-all duration-300;
    @apply border border-white/20 backdrop-blur-sm;
  }
  
  .map-control-button {
    @apply w-10 h-10 bg-white rounded-lg shadow-md;
    @apply flex items-center justify-center;
    @apply hover:bg-gray-50 transition-colors;
    @apply active:scale-95 transform duration-150;
  }
}

/* 工具样式 */
@layer utilities {
  .safe-top {
    padding-top: env(safe-area-inset-top);
  }
  
  .safe-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }
  
  .text-balance {
    text-wrap: balance;
  }
}

/* 动画关键帧 */
@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes pulseLocation {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
```

## 10. 构建和部署配置

### 10.1 Vite配置
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/webapi\.amap\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'amap-api',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7天
              }
            }
          }
        ]
      },
      manifest: {
        name: '散步心象地图',
        short_name: '散步心象',
        description: '基于情境主义理论的城市探索应用',
        theme_color: '#3b82f6',
        background_color: '#f5f5f5',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  define: {
    'process.env.VITE_AMAP_KEY': JSON.stringify(process.env.VITE_AMAP_KEY),
    'process.env.VITE_SUPERDB_URL': JSON.stringify(process.env.VITE_SUPERDB_URL),
    'process.env.VITE_SUPERDB_KEY': JSON.stringify(process.env.VITE_SUPERDB_KEY)
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          map: ['@amap/amap-jsapi-loader'],
          store: ['zustand', 'dexie']
        }
      }
    }
  },
  server: {
    host: true,
    port: 3000,
    https: true // HTTPS required for geolocation
  }
});
```

### 10.2 环境变量配置
```bash
# .env.local
VITE_AMAP_KEY=your_amap_api_key_here
VITE_AI_API_URL=https://api.your-ai-service.com
VITE_AI_API_KEY=your_ai_api_key_here

# .env.production
VITE_AMAP_KEY=your_production_amap_key
VITE_AI_API_URL=https://api.your-ai-service.com
VITE_AI_API_KEY=your_production_ai_key
```
# .env.local - 添加
VITE_SUPERDB_URL=https://your-superdb-instance.com
VITE_SUPERDB_KEY=your_superdb_api_key

# .env.production - 添加
VITE_SUPERDB_URL=https://production-superdb-instance.com
VITE_SUPERDB_KEY=your_production_superdb_key

### 10.3 类型定义
```typescript
// src/types/global.d.ts
declare global {
  interface Window {
    AMap: typeof AMap;
  }
}

declare namespace AMap {
  class Map {
    constructor(container: HTMLElement, options: MapOptions);
    setCenter(center: [number, number]): void;
    setMapStyle(style: string): void;
    add(overlay: any): void;
    remove(overlay: any): void;
    destroy(): void;
  }
  
  class Marker {
    constructor(options: MarkerOptions);
    setPosition(position: [number, number]): void;
  }
  
  class Polyline {
    constructor(options: PolylineOptions);
    setPath(path: [number, number][]): void;
  }
  
  interface MapOptions {
    zoom: number;
    mapStyle?: string;
    dragEnable?: boolean;
    zoomEnable?: boolean;
    [key: string]: any;
  }
  
  interface MarkerOptions {
    position: [number, number];
    icon?: any;
    content?: string;
    anchor?: string;
    zIndex?: number;
  }
  
  interface PolylineOptions {
    path: [number, number][];
    strokeColor?: string;
    strokeWeight?: number;
    strokeOpacity?: number;
    lineJoin?: string;
    lineCap?: string;
  }
}

export {};
```

10.4 Docker配置
dockerfile# Dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
10.5 Nginx配置
nginx# nginx.conf
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
        
        # SPA路由支持
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        # HTTPS重定向和安全头
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
    }
}

## 11. 测试策略

### 11.1 单元测试配置
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true
  }
});

// src/test/setup.ts
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

// Mock 地理位置API
const mockGeolocation = {
  getCurrentPosition: vi.fn(),
  watchPosition: vi.fn(),
  clearWatch: vi.fn()
};

Object.defineProperty(global, 'navigator', {
  value: {
    geolocation: mockGeolocation
  }
});

// Mock 高德地图
global.AMap = {
  Map: vi.fn(),
  Marker: vi.fn(),
  Polyline: vi.fn()
} as any;
```

### 11.2 关键测试用例
```typescript
// src/test/components/WalkCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { WalkCard } from '../components/Cards/WalkCard';
import { CardType } from '../types/card';

describe('WalkCard', () => {
  const mockCard = {
    id: 'test-card',
    type: CardType.OBSERVATION,
    content: '寻找下一个让你印象深刻的颜色',
    aiGenerated: false,
    createdAt: Date.now()
  };

  const mockProps = {
    card: mockCard,
    onComplete: vi.fn(),
    onSkip: vi.fn(),
    isActive: true
  };

  it('应该正确渲染卡片内容', () => {
    render(<WalkCard {...mockProps} />);
    
    expect(screen.getByText('寻找下一个让你印象深刻的颜色')).toBeInTheDocument();
    expect(screen.getByText('OBSERVATION')).toBeInTheDocument();
  });

  it('点击完成按钮应该调用onComplete', () => {
    render(<WalkCard {...mockProps} />);
    
    fireEvent.click(screen.getByText('完成'));
    expect(mockProps.onComplete).toHaveBeenCalledWith('test-card');
  });

  it('点击跳过按钮应该调用onSkip', () => {
    render(<WalkCard {...mockProps} />);
    
    fireEvent.click(screen.getByText('跳过'));
    expect(mockProps.onSkip).toHaveBeenCalledWith('test-card');
  });
});
```

## 12. 性能优化

### 12.1 代码分割和懒加载
```typescript
// src/App.tsx
import { lazy, Suspense } from 'react';

const MapContainer = lazy(() => import('./components/Map/ResponsiveMapContainer'));
const CardContainer = lazy(() => import('./components/Cards/CardContainer'));

const App: React.FC = () => {
  return (
    <AppLayout>
      <Suspense fallback={<MapLoadingSkeleton />}>
        <MapContainer />
      </Suspense>
      
      <Suspense fallback={<CardLoadingSkeleton />}>
        <CardContainer />
      </Suspense>
    </AppLayout>
  );
};
```

### 12.2 地图性能优化
```typescript
// utils/mapOptimization.ts
export class MapPerformanceOptimizer {
  private lastUpdateTime = 0;
  private readonly throttleInterval = 100; // 100ms

  shouldUpdateRoute(newPoints: RoutePoint[]): boolean {
    const now = Date.now();
    if (now - this.lastUpdateTime < this.throttleInterval) {
      return false;
    }
    this.lastUpdateTime = now;
    return true;
  }

  simplifyRoute(points: RoutePoint[], tolerance = 0.00001): RoutePoint[] {
    if (points.length <= 2) return points;
    
    // Douglas-Peucker算法简化路径
    return this.douglasPeucker(points, tolerance);
  }

  private douglasPeucker(points: RoutePoint[], tolerance: number): RoutePoint[] {
    // 简化实现，实际项目中使用现成库
    if (points.length <= 2) return points;
    
    // 找到距离首尾连线最远的点
    let maxDistance = 0;
    let maxIndex = 0;
    
    for (let i = 1; i < points.length - 1; i++) {
      const distance = this.pointToLineDistance(
        points[i],
        points[0],
        points[points.length - 1]
      );
      
      if (distance > maxDistance) {
        maxDistance = distance;
        maxIndex = i;
      }
    }
    
    // 如果最大距离小于容差，简化为首尾两点
    if (maxDistance <= tolerance) {
      return [points[0], points[points.length - 1]];
    }
    
    // 递归处理两段
    const left = this.douglasPeucker(points.slice(0, maxIndex + 1), tolerance);
    const right = this.douglasPeucker(points.slice(maxIndex), tolerance);
    
    return [...left.slice(0, -1), ...right];
  }

  private pointToLineDistance(
    point: RoutePoint,
    lineStart: RoutePoint,
    lineEnd: RoutePoint
  ): number {
    // 计算点到直线距离的简化实现
    const A = point.lat - lineStart.lat;
    const B = point.lng - lineStart.lng;
    const C = lineEnd.lat - lineStart.lat;
    const D = lineEnd.lng - lineStart.lng;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    
    if (lenSq === 0) return Math.sqrt(A * A + B * B);
    
    const param = dot / lenSq;
    
    let xx, yy;
    if (param < 0) {
      xx = lineStart.lat;
      yy = lineStart.lng;
    } else if (param > 1) {
      xx = lineEnd.lat;
      yy = lineEnd.lng;
    } else {
      xx = lineStart.lat + param * C;
      yy = lineStart.lng + param * D;
    }
    
    const dx = point.lat - xx;
    const dy = point.lng - yy;
    
    return Math.sqrt(dx * dx + dy * dy);
  }
}
```

---
