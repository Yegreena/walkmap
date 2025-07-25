export const CardType = {
  OBSERVATION: 'observation',
  MOVEMENT: 'movement',
  INTERACTION: 'interaction',
  REFLECTION: 'reflection',
  DISCOVERY: 'discovery'
} as const;

export type CardType = typeof CardType[keyof typeof CardType];

export interface CardConfig {
  type: CardType;
  markable: boolean;
  color: string;
  icon: string;
  examples: string[];
}

export interface WalkCard {
  id: string;
  type: CardType;
  content: string;
  estimatedTime?: number;
  aiGenerated: boolean;
  createdAt: number;
} 