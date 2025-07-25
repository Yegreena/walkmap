import { useEffect, useRef } from 'react';
import type { EmotionMark } from '../stores/walkStore';

export const useMarkerRenderer = (
  mapInstance: any,
  userLocation: GeolocationCoordinates | null,
  emotionMarks: EmotionMark[]
) => {
  const userMarkerRef = useRef<any>(null);
  const emotionMarkersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapInstance || !userLocation) return;
    const position = [userLocation.longitude, userLocation.latitude];
    if (userMarkerRef.current) {
      userMarkerRef.current.setPosition(position);
    } else {
      userMarkerRef.current = new (window as any).AMap.Marker({
        position,
        icon: new (window as any).AMap.Icon({
          size: new (window as any).AMap.Size(20, 20),
          image: '/icons/user-location.svg',
          imageSize: new (window as any).AMap.Size(20, 20)
        }),
        anchor: 'center',
        zIndex: 1000
      });
      mapInstance.add(userMarkerRef.current);
    }
  }, [mapInstance, userLocation]);

  useEffect(() => {
    if (!mapInstance) return;
    emotionMarkersRef.current.forEach(marker => {
      mapInstance.remove(marker);
    });
    emotionMarkersRef.current = [];
    emotionMarks.forEach(mark => {
      const marker = new (window as any).AMap.Marker({
        position: [mark.lng, mark.lat],
        content: `<div class='emotion-marker'>${mark.emotion}</div>`,
        anchor: 'center',
        zIndex: 500
      });
      mapInstance.add(marker);
      emotionMarkersRef.current.push(marker);
    });
  }, [mapInstance, emotionMarks]);

  useEffect(() => {
    return () => {
      if (mapInstance) {
        if (userMarkerRef.current) mapInstance.remove(userMarkerRef.current);
        emotionMarkersRef.current.forEach(marker => mapInstance.remove(marker));
      }
    };
  }, [mapInstance]);
}; 