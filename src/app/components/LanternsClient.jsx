'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LanternScene from './LanternScene';
import { useLanternData } from '../hooks/useLanternData';
import { useUser } from '../contexts/UserContext';

export default function LanternsClient() {
  const { user, isLoading: isUserLoading } = useUser();
  const [token, setToken] = useState(null);
  const [isTokenChecked, setIsTokenChecked] = useState(false);

  // ✨ --- ここが重要 --- ✨
  // 条件分岐（if文）の前に、すべてのフックを呼び出します。
  const { pastLanterns, newlyReleasedLantern, releaseNewLantern, isLoading: isLanternsLoading, error } = useLanternData(user, token);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
    }
    setIsTokenChecked(true);
  }, []);

  const handleReleaseLantern = async () => {
    try {
      await releaseNewLantern();
    } catch (error) {
      alert(error.message);
    }
  };

  // フックを呼び出した後に、ローディング状態のチェックを行います。
  if (isUserLoading || !isTokenChecked) {
    return <div className="flex justify-center items-center h-screen">読み込み中...</div>;
  }

  // 読み込み完了後、ユーザーがいない（ログインしていない）場合の表示
  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <p className="mb-4">ランタンを飛ばすにはログインが必要です。</p>
        <Link href="/" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          ログインページへ
        </Link>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <LanternScene pastLanterns={pastLanterns} newlyReleasedLantern={newlyReleasedLantern} />
      
      <div style={{ position: 'absolute', bottom: '5vh', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
        <button
          onClick={handleReleaseLantern}
          disabled={isLanternsLoading || newlyReleasedLantern} // ✨【タイポ修正】 isabled -> disabled
          style={{ 
            padding: '15px 30px', 
            fontSize: '1.1rem', 
            background: (isLanternsLoading || newlyReleasedLantern) ? '#ccc' : 'white', 
            color: 'black', 
            borderRadius: '8px',
            cursor: (isLanternsLoading || newlyReleasedLantern) ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          {isLanternsLoading ? '準備中...' : 'ランタンを飛ばす'}
        </button>
      </div>
    </div>
  );
}