// frontend/app/lanterns/page.jsx

'use client';

import React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Questionnaire } from './components/Questionnaire';
import { saveMood } from './components/actions';
import { useUser } from './UserContext';
import LanternsClient from './lanterns/LanternsClient';
import { useRouter } from 'next/navigation';
const initialState = {
  message: null,
};
export default async function LanternsPage() {
  const colors = await getWeeklyColors();
  
  return <LanternsClient colors={colors} />;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className="submit-button">
      {pending ? '送信中...' : '回答を完了してランタンを見る'}
    </button>
  );
}

export default function QuestionnairePage() {
  const [state, formAction] = useFormState(saveMood, initialState);

  return (
    <form action={formAction}>
      <Questionnaire />
      <SubmitButton />
      {state?.message && (
        <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>
          {state.message}
        </p>
      )}
    </form>
  );
}

//8/15たく追加
export default function HomePage() {
  const { user, loading } = useUser();
  const router = useRouter();
  useEffect(() => {
    // 読み込みが完了し、かつユーザーがログインしていない場合
    if (!loading && !user) {
      // ログインページへリダイレクト
      router.push('/login');
    }
  }, [user, loading, router]); // user, loading, routerの状態が変わるたびに実行

  // 読み込み中、またはリダイレクト待機中は、ローディング画面などを表示
  if (loading || !user) {
    return <div>読み込み中...</div>;
  }

  // ログインしているユーザーにのみ、メインコンテンツを表示
  return (
    <main>
      <LanternsClient />
    </main>
  );
}