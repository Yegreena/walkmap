import { CardType, type WalkCard } from '../types/card';
import { CARD_CONFIGS } from '../constants/cardTypes';

export interface AICardRequest {
  location: { lat: number; lng: number };
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  weather?: string;
  environmentType?: 'urban' | 'park' | 'residential' | 'commercial';
  cardHistory: CardType[];
}

export interface AICardResponse {
  type: CardType;
  content: string;
  estimatedTime?: number;
}

export class AICardService {
  async generateCard(request: AICardRequest): Promise<WalkCard> {
    try {
      // TODO: 实现AI API调用
      const response = await this.callAIAPI();
      return {
        id: `ai_card_${Date.now()}`,
        type: response.type,
        content: response.content,
        estimatedTime: response.estimatedTime,
        aiGenerated: true,
        createdAt: Date.now()
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('AI卡片生成失败:', error);
      return this.getFallbackCard(request);
    }
  }

  private async callAIAPI(): Promise<AICardResponse> {
    // 预留AI API接口实现
    throw new Error('AI API not implemented yet');
  }

  private getFallbackCard(request: AICardRequest): WalkCard {
    const availableTypes = Object.values(CardType).filter(
      type => !request.cardHistory.includes(type)
    );
    const randomType = availableTypes[
      Math.floor(Math.random() * availableTypes.length)
    ] || CardType.OBSERVATION;
    const config = CARD_CONFIGS[randomType];
    const randomExample = config.examples[
      Math.floor(Math.random() * config.examples.length)
    ];
    return {
      id: `fallback_card_${Date.now()}`,
      type: randomType,
      content: randomExample,
      aiGenerated: false,
      createdAt: Date.now()
    };
  }
} 