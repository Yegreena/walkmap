import React from 'react';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const childrenArray = React.Children.toArray(children);
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* 头部 */}
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between h-16 z-10">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-gray-900">散步心象</h1>
        </div>
        {/* 预留操作区 */}
      </header>
      {/* 主内容 */}
      <main className="flex-1 relative overflow-hidden">
        {childrenArray[0]}
      </main>
      {/* 卡片区域 */}
      <section className="bg-white border-t border-gray-200 pb-4 relative z-10 h-40 sm:h-44">
        {childrenArray[1]}
      </section>
    </div>
  );
};

export default AppLayout; 