import { useEffect, useState, type RefObject } from 'react';

const MAP_CONFIG = {
  key: import.meta.env.VITE_AMAP_KEY,
  version: '2.0',
  plugins: ['AMap.Scale', 'AMap.ToolBar'],
  mapStyle: 'amap://styles/custom-minimal',
  zoom: 16,
  pitch: 0,
  rotation: 0,
  dragEnable: false,
  zoomEnable: false,
  doubleClickZoom: false,
  keyboardEnable: false,
  scrollWheel: false,
  touchZoom: false,
  rotateEnable: false,
  pitchEnable: false,
  animateEnable: true
};

export const useAmapInstance = (containerRef: RefObject<HTMLDivElement | null>) => {
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    let map: any;
    const initMap = async () => {
      try {
        if (!(window as any).AMap) {
          await loadAmapScript();
        }
        map = new (window as any).AMap.Map(containerRef.current, MAP_CONFIG);
        map.setMapStyle(MAP_CONFIG.mapStyle);
        setMapInstance(map);
        setIsLoaded(true);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('地图初始化失败', e);
      }
    };
    initMap();
    return () => {
      if (map) map.destroy();
    };
  }, [containerRef]);

  return { mapInstance, isLoaded };
};

function loadAmapScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).AMap) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${MAP_CONFIG.key}&plugin=AMap.Scale,AMap.ToolBar,AMap.Geolocation`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('高德地图脚本加载失败'));
    document.head.appendChild(script);
  });
} 