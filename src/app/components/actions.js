// frontend/src/app/components/actions.js
'use server';

import { redirect } from 'next/navigation';
// 新しい絶対パスに修正

const API_BASE_URL = 'http://127.0.0.1:8000'; // FastAPIサーバーのアドレス

export async function saveMood(prevState, formData) {
  try {
    const answers = Array.from(formData.entries())
      .filter(([key, value]) => key.startsWith('question-'))
      .map(([key, value]) => parseInt(value, 10));

    // FastAPIの /mood/save エンドポイントを呼び出す
    const response = await fetch(`${API_BASE_URL}/mood/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: "user_01", // MVPでは固定のユーザーID
        answers: answers,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { message: `エラーが発生しました: ${errorData.detail}` };
    }
    
    // 成功したら、結果ページ（メインの3Dシーン）にリダイレクト
  } catch (error) {
    return { message: 'サーバーとの通信に失敗しました。' };
  }
  redirect('/'); // メインページにリダイレクト
}


// 過去のランタンを取得する関数
export async function getPastLanterns() {
    try {
        const response = await fetch(`${API_BASE_URL}/mood/week?user_id=user_01`);
        if (!response.ok) throw new Error("Failed to fetch lanterns");
        const data = await response.json();
        return data.colors;
    } catch (error) {
        console.error("Error fetching past lanterns:", error);
        return [];
    }
}