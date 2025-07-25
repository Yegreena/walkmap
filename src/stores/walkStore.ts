import { create } from 'zustand';
import type { CardType } from '../types/card';

export interface RoutePoint {
  lat: number;
  lng: number;
  timestamp: number;
}

export interface EmotionMark {
  id: string;
  lat: number;
  lng: number;
  emotion: string;
  timestamp: number;
  cardType: CardType;
}

export interface WalkCard {
  id: string;
  type: CardType;
  content: string;
  estimatedTime?: number;
  aiGenerated: boolean;
  createdAt: number;
}

interface WalkState {
  isWalking: boolean;
  walkId: string | null;
  startTime: number | null;
  userLocation: GeolocationCoordinates | null;
  routePoints: RoutePoint[];
  currentCard: WalkCard | null;
  cardHistory: WalkCard[];
  emotionMarks: EmotionMark[];
  isEmotionSelectorVisible: boolean;
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
  isWalking: false,
  walkId: null,
  startTime: null,
  userLocation: null,
  routePoints: [],
  currentCard: null,
  cardHistory: [],
  emotionMarks: [],
  isEmotionSelectorVisible: false,
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
    set({
      isWalking: false,
      walkId: null,
      startTime: null,
      currentCard: null
    });
  },
  updateLocation: (location) => {
    set({ userLocation: location });
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
  addRoutePoint: (point) => {
    set(state => ({
      routePoints: [...state.routePoints, point]
    }));
  },
  setCurrentCard: (card) => set({ currentCard: card }),
  completeCard: (cardId) => {
    const state = get();
    const card = state.currentCard;
    if (card && card.id === cardId) {
      set(state => ({
        cardHistory: [...state.cardHistory, card]
      }));
      set({ isEmotionSelectorVisible: true });
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
        isEmotionSelectorVisible: false
      }));
    }
  },
  showEmotionSelector: () => set({ isEmotionSelectorVisible: true }),
  hideEmotionSelector: () => set({ isEmotionSelectorVisible: false })
})); 