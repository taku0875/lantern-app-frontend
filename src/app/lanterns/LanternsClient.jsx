// frontend/app/lanterns/LanternsClient.jsx

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useUser } from '../UserContext'; // 認証情報を取得
import { getPastLanterns, saveMood } from '../actions'; // API通信関数
import { LanternScene } from '../components/LanternScene';
import Questionnaire from '../components/Questionnaire';
import Header from '../components/Header'; // ログアウトボタンなどを含むヘッダー

// 週の始まり（月曜日）の日付を取得するヘルパー関数
function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay(); // 日曜日 = 0, 月曜日 = 1, ...
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // 月曜日を週の始まりとする
    const startOfWeek = new Date(d.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0); // 時刻をリセット
    return startOfWeek;
}

// ★ 新しい四半期の開始日を取得するヘルパー関数
function getStartOfCustomQuarter(date) {
    const currentMonth = date.getMonth(); // 0 = 1月, 1 = 2月, ...
    let startMonth;

    if (currentMonth >= 0 && currentMonth <= 2) { // 1月〜3月の場合
        startMonth = 0; // 1月
    } else if (currentMonth >= 3 && currentMonth <= 5) { // 4月〜6月の場合
        startMonth = 3; // 4月
    } else if (currentMonth >= 6 && currentMonth <= 8) { // 7月〜9月の場合
        startMonth = 6; // 7月
    } else { // 10月〜12月の場合
        startMonth = 9; // 10月
    }

    const startDate = new Date(date.getFullYear(), startMonth, 1);
    return startDate;
}
export default function LanternsClient() {
  const { user } = useUser();
  const [lanterns, setLanterns] = useState([]);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- ★ ボタンの状態とメッセージを管理 ---
  const [canFlyToday, setCanFlyToday] = useState(false);
  const [buttonMessage, setButtonMessage] = useState("読み込み中...");

  // ログインユーザーが確定したら、そのユーザーの過去のランタンをAPIから取得
useEffect(() => {
    if (user?.id) {
      setIsLoading(true);
      getPastLanterns(user.id).then(pastData => {
        const today = new Date();
        const startOfQuarter = getStartOfCustomQuarter(today);
        
        const lanternsThisQuarter = pastData.filter(item => {
            const lanternDate = new Date(item.diagnosis_date);
            return lanternDate >= startOfQuarter;
        });        

        // 1. 今週すでにランタンを飛ばしたかチェック
        const hasFlownThisWeek = pastData.some(item => {
          const lanternDate = new Date(item.diagnosis_date);
          return lanternDate >= startOfWeek;
        });

        // 2. 今日が日曜日かチェック (getDay()で日曜日は0)
        const isSunday = today.getDay() === 0;

        // 3. 状態に応じてボタンのメッセージと操作可否を決定
        if (hasFlownThisWeek) {
          setCanFlyToday(false);
          setButtonMessage("今週のランタンは飛ばしました");
        } else if (isSunday) {
          setCanFlyToday(true);
          setButtonMessage("今週の自分と向き合う");
        } else {
          setCanFlyToday(false);
          setButtonMessage("ランタンを飛ばせるのは日曜日です");
        }
        // --- チェックここまで ---

        const formatted = pastData.map((item, index) => ({
          id: `past-${item.diagnosis_id || index}`,
          color: item.color_code,
          isStatic: true,
        }));
        setLanterns(formatted);
        setIsLoading(false);
      });
    }
  }, [user]);
  
  // 診断が完了したときに呼ばれる関数
  const handleQuestionnaireComplete = async (answers) => {
    if (!user?.id) return;
    
    // 1. 回答をバックエンドに送信し、新しい色を取得
    const result = await saveMood(user.id, answers);
    
    // 2. 新しいランタンの情報を現在のリストに追加
    const newLantern = {
      id: `new-${Date.now()}`,
      color: result.color_code,
      isStatic: false, // 新しいランタンはアニメーションあり
    };
    setLanterns(currentLanterns => [...currentLanterns, newLantern]);

    // ★ 飛ばした後はボタンを無効化し、メッセージを更新
    setCanFlyToday(false);
    setButtonMessage("今週のランタンは飛ばしました");
    setShowQuestionnaire(false);
  };

  // 質問画面を表示する場合
  if (showQuestionnaire) {
    return <Questionnaire onComplete={handleQuestionnaireComplete} />;
  }

  // 3Dシーンを表示する場合
  return (
    <>
      <Header /> {/* ログアウトボタンやユーザー名表示用のヘッダー */}
      <div style={{ position: 'absolute', top: '80px', left: '20px', zIndex: 10 }}>
        <button
          onClick={() => setShowQuestionnaire(true)}
          className="submit-button" // globals.cssで定義したスタイル
        >
          {buttonMessage}
        </button>
      </div>
      
      {isLoading ? (
        <div className="loading-screen">読み込み中...</div>
      ) : (
        <Suspense fallback={null}>
          <LanternScene lanterns={lanterns} />
        </Suspense>
      )}
    </>
  )
}
