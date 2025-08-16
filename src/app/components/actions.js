// frontend/src/app/components/actions.js
'use server';

import { redirect } from 'next/navigation';

// 新しい絶対パスに修正

const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT; // FastAPIサーバーのアドレス

export async function saveMood(prevState, formData) {
  // ★ 1. 現在ログインしているユーザーのセッション情報を取得
  const session = await auth();

  // ログインしていない場合はエラー
  if (!session?.user?.id) {
    return { message: 'ログインが必要です。' };
  }
    const answers = Array.from(formData.entries())
    .filter(([key]) => key.startsWith('question-'))
    .map(([, value]) => parseInt(value, 10));
  try {
    // FastAPIの /mood/save エンドポイントを呼び出す
    const response = await fetch(`${API_BASE_URL}/mood/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({answers, user_id: session.user.id }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { message: `エラーが発生しました: ${errorData.detail}` };
    }
    
    // 成功したら、結果ページ（メインの3Dシーン）にリダイレクト
  } catch (error) {
    return { message: 'サーバーとの通信に失敗しました。' };
  }
  redirect('/lanterns'); // メインページにリダイレクト
}
 
export async function getWeeklyColors() {
  // ★ 1. 現在ログインしているユーザーのセッション情報を取得します
  const session = await auth();

  // ★ 2. ログインしていない場合、何もせず空の配列を返します
  if (!session?.user?.id) {
    return []; 
  }

  // ★ 3. サーバーとの通信エラーに備えます
  try {
    // ★ 4. バックエンドAPIを呼び出します。URLに動的なユーザーIDを含めます
    const response = await fetch(`${BACKEND_URL}/mood/week?user_id=${session.user.id}`, {
      // 常に最新のデータを取得するため、キャッシュを無効化します
      cache: 'no-store' 
    });

    // ★ 5. バックエンドからの応答がエラーだった場合、処理を中断します
    if (!response.ok) {
      throw new Error('Failed to fetch colors from backend');
    }

    // ★ 6. 正常な応答からJSONデータを取り出します
    const data = await response.json();

    // ★ 7. JSONデータの中から、'colors'の配列を関数の結果として返します
    return data.colors;

  } catch (error) {
    // ★ 8. 通信エラーなどが発生した場合、ログに記録し、安全な空の配列を返します
    console.error('Error fetching weekly colors:', error);
    return [];
  }
}

// 過去のランタンを取得する関数
export async function getPastLanterns(userId) {
  if (!userId) return [];
  try {
    const response = await fetch(`${API_BASE_URL}/lanterns?user_id=${userId}`); // 仮のAPIエンドポイント
    if (!response.ok) {
      throw new Error("Failed to fetch past lanterns");
    }
    const data = await response.json();
    return data; // バックエンドから返されるランタンのリスト
  } catch (error) {
    console.error("Error fetching past lanterns:", error);
    return [];
  }
}