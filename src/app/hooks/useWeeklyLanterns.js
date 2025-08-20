'use client';

import { useState, useEffect, useCallback } from 'react';
import { getPastLanternsAPI, saveNewLantanAPI } from '../lib/api';

const COLOR_MAP = {
  1: '#ed735b', 2: '#f18c30', 3: '#57b658',
  4: '#0a9994', 5: '#1c5dab',
};

export function useLanternData(userId) {
  const [pastLanterns, setPastLanterns] = useState([]);
  const [newlyReleasedLantern, setNewlyReleasedLantern] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPastLanterns = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    
    // ★ 本物のAPI呼び出しに変更
    const pastData = await getPastLanternsAPI(userId);
    
    const lanterns = pastData.map(data => ({
      id: data.lantan_id,
      color: COLOR_MAP[data.color_id] || '#cccccc',
      isStatic: true,
    }));

    setPastLanterns(lanterns);
    setIsLoading(false);
  }, [userId]);

  const releaseNewLantern = useCallback(async (answers) => {
    if (!userId) return;
    
    // ★ 本物のAPI呼び出しに変更
    const newLantanData = await saveNewLantanAPI(userId, answers);
    
    if (newLantanData) {
        const newLantern = {
            id: newLantanData.lantan_id,
            color: COLOR_MAP[newLantanData.color_id] || '#cccccc',
            isStatic: false,
        };
        // 過去のランタンリストも更新して、次回リロード時に表示されるようにする
        setPastLanterns(prev => [...prev, {...newLantern, isStatic: true}]);
        setNewlyReleasedLantern(newLantern);
    }
  }, [userId]);

  useEffect(() => {
    fetchPastLanterns();
  }, [fetchPastLanterns]);

  const allLanterns = [...pastLanterns];
  if (newlyReleasedLantern) {
    allLanterns.push(newlyReleasedLantern);
  }

  return { allLanterns, isLoading, releaseNewLantern };
}