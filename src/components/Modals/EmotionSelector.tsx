import React, { useEffect } from 'react';

const EMOTIONS = [
  { emoji: '😊', label: '愉悦', value: 'joy' },
  { emoji: '😮', label: '惊喜', value: 'surprise' },
  { emoji: '🤔', label: '困惑', value: 'confusion' },
  { emoji: '😌', label: '平静', value: 'calm' },
  { emoji: '😐', label: '无感', value: 'neutral' }
];

interface EmotionSelectorProps {
  isVisible: boolean;
  onSelect: (emotion: string) => void;
  onAutoHide: () => void;
  autoHideDelay?: number;
}

const EmotionSelector: React.FC<EmotionSelectorProps> = ({ isVisible, onSelect, onAutoHide, autoHideDelay = 8000 }) => {
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => {
      onAutoHide();
    }, autoHideDelay);
    return () => clearTimeout(timer);
  }, [isVisible, autoHideDelay, onAutoHide]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* 遮罩层 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onAutoHide} />
      {/* 选择器 */}
      <div className="relative w-full bg-white rounded-t-2xl p-6 transform transition-transform duration-300 animate-slide-up">
        <div className="text-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">记录此刻的感受</h3>
          <p className="text-sm text-gray-500 mt-1">{autoHideDelay / 1000}秒后自动关闭</p>
        </div>
        <div className="flex justify-center gap-4">
          {EMOTIONS.map((emotion) => (
            <button
              key={emotion.value}
              onClick={() => onSelect(emotion.emoji)}
              className="flex flex-col items-center p-3 rounded-xl hover:bg-gray-100 transition-colors active:scale-95 transform"
            >
              <span className="text-4xl mb-2">{emotion.emoji}</span>
              <span className="text-xs text-gray-600">{emotion.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmotionSelector; 