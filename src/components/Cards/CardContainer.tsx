import React, { useState, useCallback, useEffect } from 'react';
import WalkCard from './WalkCard';
import EmotionSelector from '../Modals/EmotionSelector';
import { useWalkStore } from '../../stores/walkStore';
import { CardType, type WalkCard as WalkCardType } from '../../types/card';
import { CARD_CONFIGS } from '../../constants/cardTypes';

// 生成一张随机卡片（无AI时用）
function getRandomCard(cardHistory: WalkCardType[]): WalkCardType {
  const usedTypes = cardHistory.map(c => c.type);
  const availableTypes = Object.values(CardType).filter(type => !usedTypes.includes(type));
  const type = availableTypes.length > 0 ? availableTypes[Math.floor(Math.random() * availableTypes.length)] : CardType.OBSERVATION;
  const config = CARD_CONFIGS[type];
  const content = config.examples[Math.floor(Math.random() * config.examples.length)];
  return {
    id: `card_${Date.now()}`,
    type,
    content,
    aiGenerated: false,
    createdAt: Date.now()
  };
}

const CardContainer: React.FC = () => {
  const {
    currentCard,
    isWalking,
    isEmotionSelectorVisible,
    completeCard,
    hideEmotionSelector,
    addEmotionMark,
    cardHistory,
    setCurrentCard
  } = useWalkStore();
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);

  // 生成新卡片
  const generateNewCard = useCallback(() => {
    setIsGeneratingCard(true);
    setTimeout(() => {
      const newCard = getRandomCard(cardHistory);
      setCurrentCard(newCard);
      setIsGeneratingCard(false);
    }, 500);
  }, [cardHistory, setCurrentCard]);

  // 散步开始时生成首张卡片
  useEffect(() => {
    if (isWalking && !currentCard && !isGeneratingCard) {
      generateNewCard();
    }
  }, [isWalking, currentCard, isGeneratingCard, generateNewCard]);

  const handleCardComplete = (cardId: string) => {
    completeCard(cardId);
    setTimeout(() => {
      generateNewCard();
    }, 1000);
  };

  const handleCardSkip = () => {
    generateNewCard();
  };

  return (
    <div className="h-full flex flex-col">
      {/* 卡片显示区域 */}
      <div className="flex-1 p-4">
        {!isWalking ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">开始你的城市探索</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">通过散步卡片的引导，重新发现熟悉的城市空间，记录属于你的心象地图</p>
            <button
              onClick={useWalkStore.getState().startWalk}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors duration-200 active:scale-95 transform"
            >开始散步</button>
          </div>
        ) : isGeneratingCard ? (
          <div className="h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-600">正在生成新的探索任务...</span>
            </div>
          </div>
        ) : currentCard ? (
          <WalkCard
            card={currentCard}
            onComplete={handleCardComplete}
            onSkip={handleCardSkip}
            isActive={true}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">暂无卡片</div>
        )}
      </div>
      {/* 情感选择器 */}
      <EmotionSelector
        isVisible={isEmotionSelectorVisible}
        onSelect={addEmotionMark}
        onAutoHide={hideEmotionSelector}
        autoHideDelay={8000}
      />
    </div>
  );
};

export default CardContainer; 