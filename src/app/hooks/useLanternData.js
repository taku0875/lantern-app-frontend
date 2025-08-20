'use client';

import { useState, useEffect, useCallback } from 'react';
import { getPastLanternsAPI, saveNewLantanAPI } from '..src/lib/api';

const COLOR_MAP = {
  1: '#ed735b', 2: '#f18c30', 3: '#57b658',
  4: '#0a9994', 5: '#1c5dab',
};


export function useLanternData(user, token) {
  const [lanterns, setLanterns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPastLanterns = useCallback(async () => {
    if (!user || !token) { setIsLoading(false); return; };
    setIsLoading(true);
    const pastData = await getPastLanternsAPI(user.id, token);
    const formattedLanterns = pastData.map(data => ({
      id: data.lantan_id,
      color: COLOR_MAP[data.color_id] || '#cccccc',
      isStatic: true,
    }));
    setLanterns(formattedLanterns);
    setIsLoading(false);
  }, [user, token]);

  const releaseNewLantern = useCallback(async (answers) => {
    if (!user || !token) return;
    const newLantanData = await saveNewLantanAPI(user.id, answers, token);
    if (newLantanData) {
      const newLantern = {
        id: newLantanData.lantan_id,
        color: COLOR_MAP[newLantanData.color_id] || '#cccccc',
        isStatic: false,
      };
      setLanterns(prev => [...prev, newLantern]);
    }
  }, [user, token]);

  useEffect(() => {
    fetchPastLanterns();
  }, [fetchPastLanterns]);

  return { lanterns, isLoading, releaseNewLantern };
}