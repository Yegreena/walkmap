import React, { useState } from 'react';
import type { WalkCard as WalkCardType } from '../types/card';
import { CardType } from '../types/card';
import { CARD_CONFIGS } from '../constants/cardTypes';

interface WalkCardProps {
  card: WalkCardType;
  onComplete?: (cardId: string) => void;
  onSkip?: (cardId: string) => void;
}

const WalkCard: React.FC<WalkCardProps> = ({ card, onComplete, onSkip }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const config = CARD_CONFIGS[card.type];

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete?.(card.id);
  };

  const handleSkip = () => {
    onSkip?.(card.id);
  };

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
    <div className={`bg-white rounded-2xl border-2 ${getBorderColor(card.type)} p-4 sm:p-6 shadow-sm transition-all duration-300 ${
      isCompleted ? 'opacity-75 scale-95' : 'hover:shadow-md'
    }`}>
      {/* 卡片头部 */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className={`w-8 h-8 sm:w-10 sm:h-10 ${getIconBgColor(card.type)} rounded-full flex items-center justify-center text-base sm:text-lg`}>
            {config.icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{getTypeLabel(card.type)}</h3>
            <p className="text-xs text-gray-500">
              {config.markable ? '可标记情感' : '不可标记'}
            </p>
          </div>
        </div>
        {card.estimatedTime && (
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
            ~{card.estimatedTime}分钟
          </div>
        )}
      </div>

      {/* 卡片内容 */}
      <div className="mb-4 sm:mb-6">
        <p className="text-gray-800 text-sm sm:text-base leading-relaxed">
          {card.content}
        </p>
      </div>

      {/* 操作按钮 */}
      {!isCompleted && (
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={handleComplete}
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl font-medium text-sm sm:text-base transition-colors duration-200 active:scale-95 transform"
          >
            完成
          </button>
          <button
            onClick={handleSkip}
            className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl font-medium text-sm sm:text-base transition-colors duration-200 active:scale-95 transform"
          >
            跳过
          </button>
        </div>
      )}

      {isCompleted && (
        <div className="text-center py-2">
          <span className="text-green-600 font-medium text-sm sm:text-base">✓ 已完成</span>
        </div>
      )}
    </div>
  );
};

export default WalkCard;