import { create } from 'zustand';
import type { User, UserPreferences } from '../types/user';

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updatePreferences: (preferences) => set(state => {
    if (!state.user) {
      return { user: null };
    }
    const currentPreferences = state.user.preferences ?? {
      cardTypes: [],
      autoEmotionPrompt: false,
      mapStyle: 'minimal',
    };
    return {
      user: {
        ...state.user,
        preferences: {
          ...currentPreferences,
          ...preferences,
        }
      }
    };
  })
})); 