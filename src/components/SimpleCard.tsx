import React from 'react';
import type { WalkCard as WalkCardType } from '../types/card';
import { CardType } from '../types/card';
import { CARD_CONFIGS } from '../constants/cardTypes';

interface SimpleCardProps {
  card: WalkCardType;
  onComplete: () => void;
}

const SimpleCard: React.FC<SimpleCardProps> = ({ card, onComplete }) => {
  const config = CARD_CONFIGS[card.type];

  const getTypeLabel = (type: CardType) => {
    switch (type) {
      case CardType.OBSERVATION:
        return '观察';
      case CardType.MOVEMENT:
        return '移动';
      case CardType.INTERACTION:
        return '互动';
      case CardType.REFLECTION:
        return '沉思';
      case CardType.DISCOVERY:
        return '探索';
      default:
        return '未知';
    }
  };

  const getBorderColor = (type: CardType) => {
    switch (type) {
      case CardType.OBSERVATION:
        return 'border-blue-200';
      case CardType.MOVEMENT:
        return 'border-green-200';
      case CardType.INTERACTION:
        return 'border-orange-200';
      case CardType.REFLECTION:
        return 'border-purple-200';
      case CardType.DISCOVERY:
        return 'border-red-200';
      default:
        return 'border-gray-200';
    }
  };

  const getIconBgColor = (type: CardType) => {
    switch (type) {
      case CardType.OBSERVATION:
        return 'bg-blue-100';
      case CardType.MOVEMENT:
        return 'bg-green-100';
      case CardType.INTERACTION:
        return 'bg-orange-100';
      case CardType.REFLECTION:
        return 'bg-purple-100';
      case CardType.DISCOVERY:
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className={`bg-white rounded-2xl border-2 ${getBorderColor(card.type)} p-4 shadow-sm`}>
      {/* 卡片头部 */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 ${getIconBgColor(card.type)} rounded-full flex items-center justify-center text-lg`}>
          {config.icon}
        </div>
        <h3 className="font-semibold text-gray-900">{getTypeLabel(card.type)}</h3>
      </div>

      {/* 卡片内容 */}
      <div className="mb-6">
        <p className="text-gray-800 text-base leading-relaxed">
          {card.content}
        </p>
      </div>

      {/* 完成按钮 */}
      <button
        onClick={onComplete}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white px-4 py-3 rounded-xl font-medium transition-colors duration-200"
      >
        完成
      </button>
    </div>
  );
};

export default SimpleCard;