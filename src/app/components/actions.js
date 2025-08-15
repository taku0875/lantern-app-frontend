// frontend/src/app/components/actions.js
'use server';

import { redirect } from 'next/navigation';
// 新しい絶対パスに修正
import { questions } from '@/lib/questions';

// ...以下は変更なし
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';


export async function saveMood(prevState, formData) {
  // ...（残りのコードは変更なし）
  const answers = questions.map((_, index) => {
    return parseInt(formData.get(`q-${index}`), 10);
  });

  try {
    const response = await fetch(`${API_BASE_URL}/mood/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, user_id: 'user1' }),
    });

    if (!response.ok) {
      throw new Error('Failed to save mood');
    }
  } catch (error) {
    console.error('Error saving mood:', error);
    return { message: 'データの保存に失敗しました。時間をおいて再度お試しください。' };
  }

  redirect('/lanterns');
}

export async function getWeeklyColors() {
   // ...（残りのコードは変更なし）
  try {
    const response = await fetch(`${API_BASE_URL}/mood/week?user_id=user1`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch colors');
    }
    const data = await response.json();
    return data.colors;
  } catch (error) {
    console.error('Error fetching colors:', error);
    return [];
  }
}
