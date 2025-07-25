import { useEffect, useState } from 'react';
import SimpleCard from './components/SimpleCard';
import { generateRandomCard } from './utils/cardGenerator';
import type { WalkCard as WalkCardType } from './types/card';

function App() {
  const [currentCard, setCurrentCard] = useState<WalkCardType | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  // 模拟位置数据（或使用真实GPS）
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('GPS error:', error);
          // 模拟位置（北京天安门附近）
          setLocation({
            lat: 39.9042 + (Math.random() - 0.5) * 0.01,
            lng: 116.4074 + (Math.random() - 0.5) * 0.01
          });
        }
      );
    }
  }, []);

  // 初始化第一张卡片
  useEffect(() => {
    if (!currentCard) {
      const newCard = generateRandomCard();
      setCurrentCard(newCard);
    }
  }, [currentCard]);

  // 处理卡片完成
  const handleCardComplete = () => {
    const newCard = generateRandomCard();
    setCurrentCard(newCard);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* 位置信息 */}
      <div className="bg-white rounded-lg p-4 mb-4 text-center">
        <h1 className="text-xl font-bold mb-2">散步心象地图</h1>
        {location ? (
          <p className="text-green-600">
            📍 {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
          </p>
        ) : (
          <p className="text-gray-500">正在获取位置...</p>
        )}
      </div>

      {/* 卡片区域 */}
      <div className="max-w-md mx-auto">
        {currentCard ? (
          <SimpleCard
            card={currentCard}
            onComplete={handleCardComplete}
          />
        ) : (
          <div className="bg-gray-100 rounded-2xl p-6 text-center">
            <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-600">正在生成散步卡片...</p>
          </div>
        )}
      </div>

      {/* 地图占位符 */}
      <div className="mt-6 bg-gray-200 rounded-lg h-64 flex items-center justify-center">
        <p className="text-gray-600">地图区域（暂时用GPS坐标代替）</p>
      </div>
    </div>
  );
}

export default App;