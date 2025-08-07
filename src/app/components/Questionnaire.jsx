// frontend/src/app/components/Questionnaire.jsx
'use client'; 
import React from 'react';
// 新しい絶対パスに修正
import { questions } from '@/lib/questions'; 
export function Questionnaire() {
// ...以下は変更なし
  return (
    <div className="questionnaire-container">
      <h1 className="questionnaire-title">今日の心のチェックイン</h1>
      {questions.map((q, i) => (
        <div key={i} className="question-item">
          <p>{i + 1}. {q}</p>
          <div className="radio-group">
            {[1, 2, 3, 4, 5].map(value => (
              <label key={value} className="radio-label">
                <input
                  type="radio"
                  name={`q-${i}`}
                  value={value}
                  defaultChecked={value === 3}
                  required
                />
                <span className="radio-text">{value}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}