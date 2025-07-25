import { type WalkCard, CardType } from '../types/card';
import { CARD_CONFIGS } from '../constants/cardTypes';

/**
 * 生成随机散步卡片
 */
export function generateRandomCard(): WalkCard {
  // 获取所有卡片类型
  const cardTypes = Object.values(CardType);
  
  // 随机选择卡片类型
  const randomType = cardTypes[Math.floor(Math.random() * cardTypes.length)];
  const config = CARD_CONFIGS[randomType];
  
  // 随机选择该类型的一个示例内容
  const randomContent = config.examples[Math.floor(Math.random() * config.examples.length)];
  
  // 生成卡片ID
  const cardId = `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // 随机估计时间（1-5分钟）
  const estimatedTime = Math.floor(Math.random() * 5) + 1;
  
  return {
    id: cardId,
    type: randomType,
    content: randomContent,
    estimatedTime,
    aiGenerated: false,
    createdAt: Date.now()
  };
}

/**
 * 生成一系列随机卡片
 */
export function generateCardBatch(count: number = 5): WalkCard[] {
  const cards: WalkCard[] = [];
  const usedContents = new Set<string>();
  
  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let card: WalkCard;
    
    // 避免重复内容，最多尝试10次
    do {
      card = generateRandomCard();
      attempts++;
    } while (usedContents.has(card.content) && attempts < 10);
    
    usedContents.add(card.content);
    cards.push(card);
  }
  
  return cards;
}

/**
 * 根据类型偏好生成卡片
 */
export function generateCardByTypePreference(
  preferredTypes: CardType[] = Object.values(CardType),
  excludeTypes: CardType[] = []
): WalkCard {
  // 过滤掉排除的类型
  const availableTypes = preferredTypes.filter(type => !excludeTypes.includes(type));
  
  if (availableTypes.length === 0) {
    // 如果没有可用类型，回退到生成随机卡片
    return generateRandomCard();
  }
  
  // 从偏好类型中随机选择
  const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
  const config = CARD_CONFIGS[randomType];
  const randomContent = config.examples[Math.floor(Math.random() * config.examples.length)];
  
  return {
    id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: randomType,
    content: randomContent,
    estimatedTime: Math.floor(Math.random() * 5) + 1,
    aiGenerated: false,
    createdAt: Date.now()
  };
}

/**
 * 智能卡片生成器 - 根据历史记录智能选择
 */
export function generateSmartCard(cardHistory: WalkCard[] = []): WalkCard {
  // 统计已使用的卡片类型
  const typeCount: Record<CardType, number> = {
    [CardType.OBSERVATION]: 0,
    [CardType.MOVEMENT]: 0,
    [CardType.INTERACTION]: 0,
    [CardType.REFLECTION]: 0,
    [CardType.DISCOVERY]: 0
  };
  
  cardHistory.forEach(card => {
    typeCount[card.type]++;
  });
  
  // 找出使用最少的类型
  const minCount = Math.min(...Object.values(typeCount));
  const leastUsedTypes = Object.entries(typeCount)
    .filter(([_, count]) => count === minCount)
    .map(([type, _]) => type as CardType);
  
  // 从使用最少的类型中生成卡片
  return generateCardByTypePreference(leastUsedTypes);
}