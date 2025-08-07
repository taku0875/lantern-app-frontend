// frontend/app/lanterns/LanternsClient.jsx

'use client';

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';

// LanternSceneを動的にインポートし、SSRを無効化
const DynamicLanternScene = dynamic(
  () => import('../components/LanternScene').then(mod => mod.LanternScene),
  {
    ssr: false,
  }
);

export function LanternsClient({ colors }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <p>ランタンをロード中...</p>;
  }

  if (!colors || colors.length === 0) {
    return <p>ランタンの色を読み込めませんでした。</p>;
  }

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <DynamicLanternScene colors={colors} />
    </div>
  );
}