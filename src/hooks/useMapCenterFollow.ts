import { useEffect, useRef } from 'react';

function calculateDistance(coord1: GeolocationCoordinates, coord2: GeolocationCoordinates): number {
  const R = 6371e3;
  const φ1 = coord1.latitude * Math.PI / 180;
  const φ2 = coord2.latitude * Math.PI / 180;
  const Δφ = (coord2.latitude - coord1.latitude) * Math.PI / 180;
  const Δλ = (coord2.longitude - coord1.longitude) * Math.PI / 180;
  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export const useMapCenterFollow = (
  mapInstance: any,
  userLocation: GeolocationCoordinates | null,
  isWalking: boolean
) => {
  const lastCenterRef = useRef<[number, number] | null>(null);
  useEffect(() => {
    if (!mapInstance || !userLocation || !isWalking) return;
    const newCenter: [number, number] = [userLocation.longitude, userLocation.latitude];
    if (lastCenterRef.current) {
      const distance = calculateDistance(
        { latitude: lastCenterRef.current[1], longitude: lastCenterRef.current[0] } as GeolocationCoordinates,
        userLocation
      );
      if (distance < 5) return;
    }
    mapInstance.panTo(newCenter, 500);
    lastCenterRef.current = newCenter;
  }, [mapInstance, userLocation, isWalking]);
}; 