import React from 'react';
import type { WalkCard as WalkCardType } from '../../types/card';
import { CARD_CONFIGS } from '../../constants/cardTypes';

interface WalkCardProps {
  card: WalkCardType;
  onComplete: (cardId: string) => void;
  onSkip: (cardId: string) => void;
  isActive: boolean;
}

const WalkCard: React.FC<WalkCardProps> = ({ card, onComplete, onSkip, isActive }) => {
  const config = CARD_CONFIGS[card.type];
  return (
    <div className={`relative p-6 rounded-xl shadow-lg transition-all duration-300 ${config.color} text-white ${isActive ? 'scale-105' : 'scale-95 opacity-70'}`}>
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-3">{config.icon}</span>
        <span className="text-sm font-medium opacity-90">{card.type.toUpperCase()}</span>
      </div>
      <p className="text-lg leading-relaxed mb-6">{card.content}</p>
      {card.estimatedTime && (
        <div className="text-sm opacity-75 mb-4">预计用时: {card.estimatedTime}分钟</div>
      )}
      <div className="flex gap-3">
        <button
          onClick={() => onComplete(card.id)}
          className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg py-3 px-4 font-medium transition-colors"
        >完成</button>
        <button
          onClick={() => onSkip(card.id)}
          className="px-4 py-3 text-white/70 hover:text-white transition-colors"
        >跳过</button>
      </div>
    </div>
  );
};

export default WalkCard; 