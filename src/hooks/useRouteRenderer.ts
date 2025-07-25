import { useEffect, useRef } from 'react';
import type { RoutePoint } from '../stores/walkStore';

export const useRouteRenderer = (
  mapInstance: any,
  routePoints: RoutePoint[]
) => {
  const polylineRef = useRef<any>(null);

  useEffect(() => {
    if (!mapInstance || routePoints.length < 2) return;
    const lngLatArray = routePoints.map(point => [point.lng, point.lat]);
    if (polylineRef.current) {
      polylineRef.current.setPath(lngLatArray);
    } else {
      polylineRef.current = new (window as any).AMap.Polyline({
        path: lngLatArray,
        strokeColor: '#1890ff',
        strokeWeight: 4,
        strokeOpacity: 0.8,
        lineJoin: 'round',
        lineCap: 'round'
      });
      mapInstance.add(polylineRef.current);
    }
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