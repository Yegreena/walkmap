import React, { useRef, useEffect } from 'react';
import { useAmapInstance } from '../../hooks/useAmapInstance';
import { useRouteRenderer } from '../../hooks/useRouteRenderer';
import { useMarkerRenderer } from '../../hooks/useMarkerRenderer';
import { useMapCenterFollow } from '../../hooks/useMapCenterFollow';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useWalkStore } from '../../stores/walkStore';

const ResponsiveMapContainer: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { mapInstance, isLoaded } = useAmapInstance(mapContainerRef);
  const { userLocation, routePoints, emotionMarks, isWalking } = useWalkStore();
  const { startTracking, stopTracking } = useGeolocation();

  // 地图渲染
  useRouteRenderer(mapInstance, routePoints);
  useMarkerRenderer(mapInstance, userLocation, emotionMarks);
  useMapCenterFollow(mapInstance, userLocation, isWalking);

  // 散步时自动开启定位，结束时关闭
  useEffect(() => {
    if (isWalking) {
      startTracking();
    } else {
      stopTracking();
    }
  }, [isWalking, startTracking, stopTracking]);

  return (
    <div className="relative w-full h-full">
      {/* 地图容器 */}
      <div
        ref={mapContainerRef}
        className="absolute inset-0 w-full h-full"
        style={{ height: 'calc(100vh - 10rem)', minHeight: '400px' }}
      />
      {/* 加载状态 */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-600">正在加载地图...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponsiveMapContainer; 