import { useState, useRef, useCallback, useEffect } from 'react';
import { useWalkStore } from '../stores/walkStore';

interface GeolocationState {
  location: GeolocationCoordinates | null;
  error: GeolocationPositionError | null;
  isLoading: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    isLoading: false
  });
  const watchIdRef = useRef<number | null>(null);
  const { updateLocation } = useWalkStore();

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, error: new Error('Geolocation not supported') as any, isLoading: false }));
      return;
    }
    setState(prev => ({ ...prev, isLoading: true }));
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setState({ location: position.coords, error: null, isLoading: false });
        updateLocation(position.coords);
      },
      (error) => {
        setState(prev => ({ ...prev, error, isLoading: false }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 2000 }
    );
  }, [updateLocation]);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
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