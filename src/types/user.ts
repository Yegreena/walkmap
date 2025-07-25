import { CardType } from './card';

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