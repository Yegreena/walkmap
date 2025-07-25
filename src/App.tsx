import { useRef, useEffect, useState } from 'react';
import SimpleCard from './components/SimpleCard';
import { generateRandomCard } from './utils/cardGenerator';
import type { WalkCard as WalkCardType } from './types/card';

function App() {
  // 地图容器的ref
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // 定位监听ID
  const watchIdRef = useRef<number | null>(null);
  // 当前展示的散步卡片
  const [currentCard, setCurrentCard] = useState<WalkCardType | null>(null);

  // ----------------------
  // 1. 高德地图初始化与加载
  // ----------------------
  useEffect(() => {
    console.log('import.meta.env:', import.meta.env);
    const initMap = async () => {
      try {
        // 检查API密钥
        const apiKey = import.meta.env.VITE_AMAP_KEY;
        if (!apiKey) {
          throw new Error('未找到高德地图API密钥，请检查.env.local文件');
        }
        
        
        // 动态加载高德地图脚本
        if (!(window as any).AMap) {
          const script = document.createElement('script');
          script.src = `https://webapi.amap.com/maps?v=2.0&key=${apiKey}&plugin=AMap.Geolocation`;
          script.async = true;
          
          await new Promise((resolve, reject) => {
            script.onload = () => {
              console.log('高德地图脚本加载成功');
              resolve(undefined);
            };
            script.onerror = (e) => {
              console.error('脚本加载错误:', e);
              reject(new Error('高德地图脚本加载失败'));
            };
            document.head.appendChild(script);
          });
        }
        
        // 等待DOM准备
        if (!mapContainerRef.current) {
          throw new Error('地图容器未找到');
        }
        
        // 创建地图实例，设置为极简风格，禁用所有交互
        const map = new (window as any).AMap.Map(mapContainerRef.current, {
          zoom: 16, // 固定缩放级别
          center: [116.397428, 39.90923], // 北京天安门，后续会改为用户位置
          pitch: 0,
          rotation: 0,
          // 禁用所有手势操作
          dragEnable: false,
          zoomEnable: false,
          doubleClickZoom: false,
          keyboardEnable: false,
          scrollWheel: false,
          touchZoom: false,
          rotateEnable: false,
          pitchEnable: false,
          // 启用动画
          animateEnable: true
        });

        // 监听地图加载完成
        map.on('complete', () => {
          
          // 设置单色背景样式（极简风格）
          map.setMapStyle('amap://styles/light');
          
          setTimeout(() => {
            // 地图初始化完成后开始定位
            startLocationTracking(map);
          }, 500);
        });
        
      } catch (error) {
        console.error('地图初始化失败:', error);
      }
    };

    if (mapContainerRef.current) {
      initMap();
    }
  }, []);

  // ----------------------
  // 2. 用户定位与实时跟踪
  // ----------------------
  // 启动定位监听，持续获取用户位置
  const startLocationTracking = (map: any) => {
    
    // 检查浏览器是否支持地理定位
    if (!navigator.geolocation) {
      return;
    }

    // 定位选项
    const options = {
      enableHighAccuracy: true, // 启用高精度
      timeout: 10000, // 10秒超时
      maximumAge: 0 // 不使用缓存位置
    };

    // 成功获取位置的回调
    const onLocationSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      
      // 地图中心移动到用户位置（带动画）
      map.setCenter([longitude, latitude], true);
      
      // 添加用户位置标记
      updateUserMarker(map, longitude, latitude);
    };

    // 定位失败的回调
    const onLocationError = (error: GeolocationPositionError) => {
      console.error('定位错误:', error);
    };

    // 开始持续定位
    watchIdRef.current = navigator.geolocation.watchPosition(
      onLocationSuccess,
      onLocationError,
      options
    );
  };

  // 用户位置标记 - 使用useRef确保持久化
  const userMarkerRef = useRef<any>(null);
  
  // 更新用户位置标记（每次定位更新时调用）
  const updateUserMarker = (map: any, lng: number, lat: number) => {
    // 移除旧标记
    if (userMarkerRef.current) {
      map.remove(userMarkerRef.current);
    }
    
    // 创建用户位置标记
    userMarkerRef.current = new (window as any).AMap.Marker({
      position: [lng, lat],
      icon: createUserLocationIcon(),
      anchor: 'center',
      zIndex: 100
    });
    
    map.add(userMarkerRef.current);
  };

  // 创建用户位置图标（SVG）
  const createUserLocationIcon = () => {
    return new (window as any).AMap.Icon({
      image: 'data:image/svg+xml;base64,' + btoa(`
        <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="8" fill="#3B82F6" stroke="#FFFFFF" stroke-width="2"/>
          <circle cx="10" cy="10" r="3" fill="#FFFFFF"/>
        </svg>
      `),
      size: new (window as any).AMap.Size(20, 20)
    });
  };

  // 组件卸载时清理定位监听
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // ----------------------
  // 3. 散步卡片生成与切换
  // ----------------------
  // 初始化第一张卡片
  useEffect(() => {
    if (!currentCard) {
      const newCard = generateRandomCard();
      setCurrentCard(newCard);
    }
  }, [currentCard]);

  // 处理卡片完成 - 直接跳到下一张
  const handleCardComplete = () => {
    const newCard = generateRandomCard();
    setCurrentCard(newCard);
  };

  // ----------------------
  // 4. 界面布局与渲染
  // ----------------------
  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* 卡片区域 - 固定在上方 */}
      <div className="bg-white border-b shadow-sm p-4 flex-shrink-0">
        <div className="max-w-md mx-auto">
          {currentCard ? (
            <SimpleCard
              card={currentCard}
              onComplete={handleCardComplete}
            />
          ) : (
            <div className="bg-gray-100 rounded-2xl p-6 text-center">
              <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-600">正在生成散步卡片...</p>
            </div>
          )}
        </div>
      </div>
      
      {/* 地图容器 - 占用剩余空间 */}
      <div className="flex-1 relative">
        <div 
          ref={mapContainerRef}
          className="absolute inset-0 w-full h-full bg-gray-200"
        />
      </div>
    </div>
  );
}

export default App;
