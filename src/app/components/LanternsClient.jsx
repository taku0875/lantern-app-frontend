'use client';

import { useState } from 'react';
import LanternScene from './LanternScene';
import { Questionnaire } from './Questionnaire';
import { useLanternData } from '../hooks/useLanternData';
import { useUser } from '../contexts/UserContext'; // 仮の認証情報

export default function LanternsClient() {
  const { user, token, isLoading: isUserLoading } = useUser();
  const { lanterns, isLoading: isLanternsLoading, releaseNewLantern } = useLanternData(user, token);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  const handleQuestionnaireComplete = (answers) => {
    releaseNewLantern(answers);
    setShowQuestionnaire(false);
  };

  if (isUserLoading || isLanternsLoading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div>
      <LanternScene lanterns={lanterns} />
      
      {showQuestionnaire ? (
        <Questionnaire onComplete={handleQuestionnaireComplete} />
      ) : (
        <div style={{ position: 'absolute', bottom: '5vh', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
          <button
            onClick={() => setShowQuestionnaire(true)}
            style={{ padding: '15px 30px', fontSize: '1.1rem', background: 'white', color: 'black', borderRadius: '8px' }}
          >
            ランタンを飛ばす
          </button>
        </div>
      )}
    </div>
  );
}