import { CardType, type CardConfig } from '../types/card';

export const CARD_CONFIGS: Record<CardType, CardConfig> = {
  [CardType.OBSERVATION]: {
    type: CardType.OBSERVATION,
    markable: true,
    color: 'bg-blue-500',
    icon: '👁️',
    examples: [
      '寻找下一个让你印象深刻的颜色',
      '注意接下来听到的第一个声音',
      '观察周围最特别的纹理或材质',
      '找到一个让你感到好奇的物体',
      '留意阳光在建筑上投下的阴影',
      '发现一个你以前从未注意到的细节',
      '观察路人的步伐节奏',
      '寻找一个有趣的反光表面',
      '注意周围植物的生长状态',
      '观察天空云朵的变化'
    ]
  },
  [CardType.MOVEMENT]: {
    type: CardType.MOVEMENT,
    markable: false,
    color: 'bg-green-500',
    icon: '🚶',
    examples: [
      '向你的左手边走3分钟',
      '跟随前方的第一个人走一小段',
      '选择看起来最不起眼的路径',
      '改变你的步行速度，慢下来或加快',
      '走到最近的十字路口然后右转',
      '寻找并走向最高的建筑',
      '沿着你看到的第一条曲线路径前进',
      '向有树木的方向走去',
      '选择一个你从未走过的出入口',
      '朝着听到声音最多的方向前进'
    ]
  },
  [CardType.INTERACTION]: {
    type: CardType.INTERACTION,
    markable: true,
    color: 'bg-orange-500',
    icon: '🤝',
    examples: [
      '观察一个陌生人30秒，想象他们的故事',
      '触摸你经过的下一个有趣表面',
      '向路过的人微笑',
      '在心中为周围的建筑起一个昵称',
      '模仿你看到的某个人的姿态',
      '用手感受墙面、栏杆或树干的质地',
      '想象这个地方在100年前的样子',
      '为你经过的商店想一个新的用途',
      '假装你是第一次来到这里',
      '给你看到的第一只动物（或雕像）打招呼'
    ]
  },
  [CardType.REFLECTION]: {
    type: CardType.REFLECTION,
    markable: true,
    color: 'bg-purple-500',
    icon: '🧘',
    examples: [
      '找个地方站定，闭眼听周围声音1分钟',
      '回想这条街道给你的第一印象',
      '感受此刻的身体状态',
      '深呼吸三次，感受空气的味道',
      '回忆你最近一次在这里的经历',
      '想象如果你住在这里会是什么感觉',
      '静止30秒，感受脚下地面的坚实',
      '思考这个地方最让你舒适的是什么',
      '闭眼倾听，分辨出至少三种不同的声音',
      '感受当下的情绪，不加评判地接受它'
    ]
  },
  [CardType.DISCOVERY]: {
    type: CardType.DISCOVERY,
    markable: false,
    color: 'bg-red-500',
    icon: '🔍',
    examples: [
      '寻找一条你从未走过的小路',
      '向最吸引你的建筑方向前进',
      '探索一个被忽视的角落',
      '寻找一个隐秘的小空间',
      '发现一个有趣的门或窗户',
      '找到一个能看到远方的制高点',
      '探索最近的公园或绿地',
      '寻找一面有故事的墙',
      '发现一个适合拍照的独特角度',
      '找到一个能听到水声的地方'
    ]
  }
}; 