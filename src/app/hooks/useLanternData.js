'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // ✨ routerをインポート

// 色の定義（ご要望により残します）
const COLOR_MAP = {
  1: '#ed735b', 2: '#f18c30', 3: '#57b658', 4: '#59b6c0', 5: '#4b8aed',
};

export const useLanternData = (user, token) => {
  const router = useRouter(); // ✨ routerインスタンスを取得

  // ✨ 管理するstateを「新しくリリースされたランタン」のみにする
  const [pastLanterns, setPastLanterns] = useState([]);
  const [newlyReleasedLantern, setNewlyReleasedLantern] = useState(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✨ --- pastLanterns と fetchPastLanterns、および関連するuseEffectはすべて削除 ---

  // 新しいランタンのリリース機能
  const releaseNewLantern = useCallback(async () => {
    if (!token) {
        throw new Error('ログインが必要です。');
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/lantan/release`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      // ✨ 認証エラー(401)の場合、ログインページにリダイレクト
      if (response.status === 401) {
        localStorage.removeItem('authToken'); // 古いトークンを削除
        router.push('/'); // ログインページへ
        throw new Error('セッションが切れました。再度ログインしてください。');
      }

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'ランタンのリリースに失敗しました');
      }
      
      const data = await response.json();

            // ✨ 1. ここでランタンの最終的な位置を一度だけ計算する
      const targetPosition = [
        (Math.random() - 0.5) * 6, // 横の広がりを少し大きく
        4 + Math.random() * 4,     // 最終的な高さ
        (Math.random() - 0.5) * 4      // 奥行き
      ];
      // ✨ 2. 計算した位置情報を、新しいランタンのデータに含める
      const newLanternWithPosition = { ...data.lantan, targetPosition };

      setNewlyReleasedLantern(newLanternWithPosition); 
      
      // ✨ 7秒後、アニメーションが終わったランタンを過去のリストに追加
      setTimeout(() => {
        // 2. 過去ランタンのリストに、今リリースしたものを追加
        setPastLanterns(prevLanterns => [...prevLanterns, data.lantan]);
        // 3. アニメーション用のstateを空にする
        setNewlyReleasedLantern(null);
      }, 60000); // アニメーション時間に合わせて調整
    } catch (e) {
      setError(e.message);
      console.error(e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [token, router]); // ✨ 依存配列を更新

  // ✨ pastLanterns を返さないようにする
  return { pastLanterns, newlyReleasedLantern, releaseNewLantern, isLoading, error };
};