'use client';

// ReactからuseStateとuseEffectをインポートします
import { useState, useEffect } from 'react'; 
import LanternScene from './LanternScene';
import { useLanternData } from '../hooks/useLanternData';
import { useUser } from '../contexts/UserContext';

export default function LanternsClient() {
  // useUserフックからはtokenを受け取らないようにします
  const { user, isLoading: isUserLoading } = useUser();
  
  // ★★★ トークンを管理するためのstateを定義します ★★★
  const [token, setToken] = useState(null);

  // ★★★ コンポーネントが読み込まれた時にlocalStorageからトークンを取得します ★★★
  useEffect(() => {
    // ブラウザ環境でのみlocalStorageからauthTokenを取得
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []); // 空の配列を渡すことで、最初の読み込み時に一度だけ実行されます

  // 取得したtokenをuseLanternDataフックに渡します
  const { lanterns, isLoading: isLanternsLoading, releaseNewLantern } = useLanternData(user, token);

  const handleReleaseLantern = async () => {
    try {
      await releaseNewLantern();
    } catch (error) {
      alert(error.message);
    }
  };

  // ユーザー情報かランタン情報の読み込み中はローディング画面を表示
  // tokenがまだ読み込めていない場合も考慮します
  if (isUserLoading || (user && !token)) {
    return <div>読み込み中...</div>;
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <LanternScene lanterns={lanterns} />
      
      <div style={{ position: 'absolute', bottom: '5vh', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
        <button
          onClick={handleReleaseLantern}
          style={{ padding: '15px 30px', fontSize: '1.1rem', background: 'white', color: 'black', borderRadius: '8px' }}
        >
          ランタンを飛ばす
        </button>
      </div>
    </div>
  );
}