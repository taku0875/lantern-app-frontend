'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from './contexts/UserContext'; // Context API の import を追加

export default function Login() {
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    
    // Context API からログイン関数と認証状態を取得
    const { login, isAuthenticated, isLoading: userLoading } = useUser();

    // フォームのバリデーション: 両方のフィールドが入力されているかチェック
    const isFormValid = loginId.trim() !== '' && password.trim() !== '';

    // 既にログイン済みの場合はホームにリダイレクト
    useEffect(() => {
        if (!userLoading && isAuthenticated) {
            router.push('/home');
        }
    }, [isAuthenticated, userLoading, router]);

    // ログイン処理
    const handleLogin = async (e) => {
        e.preventDefault();
        
        // フォームが無効な場合は何もしない
        if (!isFormValid) return;

        setIsLoading(true);
        setError('');

        try {
            // バックエンドAPIへのログインリクエスト
            const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + '/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: loginId.trim(),
                    password: password.trim(),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // ログイン成功時の処理
                const userData = {
                    id: data.user.id,           // ユーザーID
                    username: data.user.username, // ユーザー名
                    email: data.user.email,     // メールアドレス
                    name: data.user.name,       // 表示名
                    // その他必要な情報があれば追加
                };

                // Context経由でユーザー情報とトークンを保存
                login(userData, data.token);
                
                // ホーム画面に遷移
                router.push('/home');
            } else {
                // ログイン失敗時のエラーメッセージを表示
                setError(data.message || 'ログインに失敗しました');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('ネットワークエラーが発生しました');
        } finally {
            setIsLoading(false);
        }

        // 開発用の一時的な処理（実際のAPI連携前）
        // setTimeout(() => {
        //     // テスト用のユーザーデータ
        //     const testUserData = {
        //         id: 'test_user_123',
        //         username: 'testuser',
        //         email: 'test@example.com',
        //         name: 'テストユーザー'
        //     };
            
        //     // Context経由でログイン
        //     login(testUserData, 'test-token-abc123');
            
        //     // ホーム画面に遷移
        //     router.push('/home');
        //     setIsLoading(false);
        // }, 500);
    };

    // ユーザー情報ローディング中
    // if (userLoading) {
    //     return (
    //         <div className="max-w-[393px] mx-auto h-screen bg-white flex items-center justify-center">
    //             <div className="text-gray-500">初期化中...</div>
    //         </div>
    //     );
    // }

    return (
        <div className="max-w-[393px] mx-auto h-screen bg-white relative">
            <div>
                <img src="./images/logo.png" alt="アプリlogo" />
            </div>
            
            <form onSubmit={handleLogin}>
                <div className="mx-4">
                    {/* エラーメッセージ表示 */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-sm">
                            {error}
                        </div>
                    )}

                    {/* ログインID入力フィールド */}
                    <div>
                        <p className="block leading-[normal] whitespace-pre">ログインID</p>
                    </div>
                    <div className="bg-[#ffffff] h-10 rounded-sm w-full mb-4" data-name="Email address container">
                        <div
                            aria-hidden="true"
                            className="absolute border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[10px]"
                        />
                        <input
                            type="text"
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
                            placeholder="ログインIDを入力してください"
                            className="border border-gray-400 w-full h-full px-2 bg-transparent rounded-md text-[12px] font-[Inter]"
                            disabled={isLoading}
                            required
                        />
                    </div>

                    {/* パスワード入力フィールド */}
                    <div>
                        <p className="block leading-[normal] whitespace-pre">パスワード</p>
                    </div>
                    <div
                        className="bg-[#ffffff] h-10 rounded-[10px] w-full mb-8"
                        data-name="Email address container"
                        style={{left: `calc(50% - 0.5px)`}}
                    >
                        <div
                            aria-hidden="true"
                            className="absolute border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[10px]"
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="パスワードを入力してください"
                            className="border border-gray-400 w-full h-full px-2 bg-transparent rounded-md text-[12px] font-[Inter]"
                            disabled={isLoading}
                            required
                        />
                    </div>

                    {/* ログインボタン */}
                    <div className="mb-4">
                        <button
                            type="submit"
                            disabled={!isFormValid || isLoading}
                            className={`
                                border-3 rounded-sm p-2 font-bold w-full transition-colors duration-200
                                ${isFormValid && !isLoading
                                    ? 'border-[#155D27] bg-[#155D27] text-white hover:bg-[#134a22] cursor-pointer'
                                    : 'border-gray-300 bg-gray-300 text-gray-500 cursor-not-allowed'
                                }
                            `}
                        >
                            {isLoading ? 'ログイン中...' : 'ログイン'}
                        </button>
                    </div>

                    {/* 新規登録ボタン */}
                    <div>
                        <button
                            type="button"
                            onClick={() => router.push('/register')}
                            className="border-[3px] border-[#155D27] rounded-sm p-2 text-[#155D27] font-bold w-full"
                            disabled={isLoading}
                        >
                            はじめてご利用の方はこちら
                        </button>
                    </div>
                </div>
            </form>

            {/* チームロゴの右下配置 */}
            <img src="./images/source.png" alt="チームロゴ" width={60} height={60} className="absolute bottom-0 right-0 mb-4 mr-4 z-50"/>
            
        </div>
    );
}