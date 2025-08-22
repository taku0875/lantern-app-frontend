'use client';

import { useState, useCallback } from 'react';

// 色の定義
const COLOR_MAP = {
  1: '#ed735b', 2: '#f18c30', 3: '#57b658', 4: '#59b6c0', 5: '#4b8aed',
};

export const useLanternData = () => {
  // 飛ばしたランタンのリストを管理する
  const [lanterns, setLanterns] = useState([]);

  // 「新しいランタンを1つリストに追加する」という機能だけを持つ関数
  const releaseNewLantern = useCallback(() => {
    // 1〜5の中からランダムな色IDを決定
    const randomColorId = Math.floor(Math.random() * 5) + 1;
    
    // 新しいランタンのデータを作成
    const newLantern = {
      id: `released-${Date.now()}`, // 時間を元にユニークなIDを作成
      color: COLOR_MAP[randomColorId],
      isStatic: false, // isStatic: falseは「新しく飛ばすランタン」の目印
    };

    // 現在のランタンリストの末尾に、新しいランタンを1つ追加する
    setLanterns(prevLanterns => [...prevLanterns, newLantern]);
  }, []); // useCallbackの第二引数は空でOK

  return { lanterns, releaseNewLantern };
};