const API_BASE_URL = 'http://127.0.0.1:8000'; // FastAPIサーバーのURL

// 新しいランタンをリリースするAPI
export const releaseNewLanternAPI = async (token) => {
  const response = await fetch(`${API_BASE_URL}/lantan/release`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || 'サーバーエラーが発生しました。');
  }
  return data;
};

// (参考) 将来的に過去のランタンを取得するAPIもここに追加できます
// export const getPastLanternsAPI = async (token) => { ... };