# 散步心象地图 - 技术方案概述

## 核心功能
- **极简地图**：单色背景，只显示路径和情感标记点
- **AI散步卡片**：根据环境生成引导指令（5种类型）
- **情感标记**：完成特定卡片后可选记录情感（8秒自动消失）
- **路径记录**：实时绘制走过路线，生成个人心象地图

## 技术栈
```
前端：React 18 + TypeScript + Tailwind CSS
状态：Zustand
地图：高德地图 JavaScript API v2.0
数据：SuperDB（云端存储）
构建：Vite + PWA
部署：Docker + Nginx
```

## 核心设计
- **地图跟随**：始终以用户位置为中心，禁用手势操作
- **卡片分类**：观察/行动/互动/沉思/探索，只有前三种可标记情感
- **响应式**：移动端优先，固定布局（地图+底部卡片区）
- **离线优先**：PWA支持，本地缓存关键数据

## 数据流
```
用户位置 → 地图中心同步 → 路径点收集
AI生成卡片 → 用户完成 → 情感选择（可选）→ 地图标记
散步结束 → 保存到SuperDB → 心象地图归档
```

## 关键约束
- 地图缩放级别固定16
- 情感选择非强制，8秒自动关闭
- GPS精度过滤（<3米忽略，减少漂移）
- 路径简化（>1000点自动压缩）