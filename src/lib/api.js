const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://127.0.0.1:8000';

/**
 * 過去のランタンデータを取得する
 * @param {number} userId ユーザーID
 * @param {string} token 認証トークン
 * @returns {Promise<Array>} ランタンデータの配列
 */
export async function getPastLanternsAPI(userId, token) {
  // バックエンドの @app.get("/users/{user_id}/lantans/") に合わせる
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/lantans/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch past lanterns');
    return await response.json();
  } catch (error) {
    console.error("API Error (getPastLanternsAPI):", error);
    return [];
  }
}

/**
 * 新しいランタンを保存する
 * @param {number} userId ユーザーID
 * @param {Array<number>} answers 回答の配列
 * @param {string} token 認証トークン
 * @returns {Promise<Object|null>} 保存されたランタンデータ
 */
export async function saveNewLantanAPI(userId, answers, token) {
  // バックエンドの @app.post("/users/{user_id}/lantans/") に合わせる
  try {
    const avg = answers.reduce((a, b) => a + b, 0) / answers.length;
    const color_id = Math.round(avg);

    const response = await fetch(`${API_BASE_URL}/users/${userId}/lantans/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ color_id }),
    });
    if (!response.ok) throw new Error('Failed to save new lantan');
    return await response.json();
  } catch (error) {
    console.error("API Error (saveNewLantanAPI):", error);
    return null;
  }
}