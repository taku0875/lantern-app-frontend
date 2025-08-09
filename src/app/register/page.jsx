'use client';
import Link from "next/link";
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { useUser } from '../contexts/UserContext'; // Context API の import を追加

export default function Register() {
    const formRef = useRef();
    const router = useRouter();
    
    // Context API からログイン関数と認証状態を取得
    const { login, isAuthenticated, isLoading: userLoading } = useUser();
    
    // 都道府県リスト
    const prefectures = [
        '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
        '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
        '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県',
        '岐阜県', '静岡県', '愛知県', '三重県',
        '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
        '鳥取県', '島根県', '岡山県', '広島県', '山口県',
        '徳島県', '香川県', '愛媛県', '高知県',
        '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
    ];
    
    // フォームの状態管理
    const [formData, setFormData] = useState({
        user_id: '',
        password: '',
        age: '',
        gender: '',
        prefecture: '', // address から prefecture に変更
        phone_number: '',
        email: ''
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // 既にログイン済みの場合はホームにリダイレクト
    useEffect(() => {
        if (!userLoading && isAuthenticated) {
            router.push('/home');
        }
    }, [isAuthenticated, userLoading, router]);

    // フォームのバリデーション: すべてのフィールドが入力されているかチェック
    const isFormValid = Object.values(formData).every(value => value.trim() !== '');

    // 入力値の変更処理
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 新規会員登録処理
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // フォームが無効な場合は何もしない
        if (!isFormValid) return;

        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            // FastAPIバックエンドへの登録リクエスト
            const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + '/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: formData.user_id.trim(),
                    password: formData.password.trim(),
                    age: parseInt(formData.age),
                    gender: formData.gender,
                    prefecture: formData.prefecture, // 都道府県情報
                    phone_number: formData.phone_number.trim(),
                    email: formData.email.trim()
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // 登録成功時の処理
                setSuccessMessage('会員登録が完了しました！');
                
                // ユーザー情報をContextに保存
                const userData = {
                    id: data.user.id,
                    username: data.user.user_id || data.user.username,
                    email: data.user.email,
                    name: data.user.name || data.user.user_id, // 表示名がない場合はuser_idを使用
                    age: data.user.age,
                    gender: data.user.gender,
                    prefecture: data.user.prefecture,
                    phone_number: data.user.phone_number
                };

                // 登録と同時にログイン状態にする
                login(userData, data.token);
                
                // 2秒後にホーム画面に遷移
                setTimeout(() => {
                    router.push('/home');
                }, 2000);
                
            } else {
                // 登録失敗時のエラーメッセージを表示
                setError(data.detail || data.message || '登録に失敗しました');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('ネットワークエラーが発生しました');
        } finally {
            setIsLoading(false);
        }

        // 開発用の一時的な処理（実際のAPI連携前）
        // setTimeout(() => {
        //     setSuccessMessage('会員登録が完了しました！');
            
        //     // テスト用のユーザーデータ
        //     const testUserData = {
        //         id: `user_${Date.now()}`, // 一意のID生成
        //         username: formData.user_id,
        //         email: formData.email,
        //         name: formData.user_id,
        //         age: parseInt(formData.age),
        //         gender: formData.gender,
        //         prefecture: formData.prefecture,
        //         phone_number: formData.phone_number
        //     };
            
        //     // Context経由でログイン状態にする
        //     login(testUserData, `test-token-${Date.now()}`);
            
        //     setTimeout(() => {
        //         router.push('/home');
        //     }, 1000);
        //     setIsLoading(false);
        // }, 1000);
    };

    // ユーザー情報ローディング中
    if (userLoading) {
        return (
            <div className="max-w-[393px] mx-auto h-screen bg-[#dde7c7] flex items-center justify-center">
                <div className="text-gray-500">初期化中...</div>
            </div>
        );
    }

    return(
        <div className="max-w-[393px] mx-auto h-screen relative bg-white">
            <img src="./images/name.png" alt="アプリロゴ"/>
            <div className="mx-4 mt-10">
                <form ref={formRef} onSubmit={handleSubmit}>
                    
                    {/* エラーメッセージ表示 */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-sm">
                            {error}
                        </div>
                    )}
                    
                    {/* 成功メッセージ表示 */}
                    {successMessage && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-sm">
                            {successMessage}
                        </div>
                    )}

                    <div className="flex flex-wrap">
                        <div className="mb-4 w-full h-15">
                            <p>ユーザー名</p>
                            <input 
                                type="text" 
                                name="user_id" 
                                value={formData.user_id}
                                onChange={handleInputChange}
                                placeholder="ユーザー名" 
                                className="border border-gray-400 w-full h-1/2 px-2 bg-transparent rounded-sm text-[12px] font-[Inter]"
                                disabled={isLoading}
                                required
                            />
                        </div>
                        <div className="mb-4 w-full h-15">
                            <p>パスワード</p>
                            <input 
                                type="password" 
                                name="password" 
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="パスワード" 
                                className="border border-gray-400 w-full h-1/2 px-2 bg-transparent rounded-sm text-[12px] font-[Inter]"
                                disabled={isLoading}
                                required
                            />
                        </div>
                        <div className=" mb-4 w-2/5 h-15">
                            <p>年齢</p>
                            <input 
                                type="number" 
                                name="age" 
                                value={formData.age}
                                onChange={handleInputChange}
                                placeholder="年齢" 
                                className="border border-gray-400 w-full h-1/2 px-2 bg-transparent rounded-sm text-[12px] font-[Inter]"
                                disabled={isLoading}
                                min="0"
                                max="150"
                                required
                            />
                        </div>
                        <div className="w-[10%] h-15"></div>
                        <div className="mb-4 w-2/5 h-15">
                            <p>性別</p>
                            <select 
                                name="gender" 
                                value={formData.gender}
                                onChange={handleInputChange}
                                className="border border-gray-400 w-full h-1/2 px-2 bg-transparent rounded-sm text-[12px] font-[Inter]"
                                disabled={isLoading}
                                required
                            >
                                <option value="">選択してください</option>
                                <option value="male">男性</option>
                                <option value="female">女性</option>
                                <option value="other">その他</option>
                            </select>
                        </div>
                        <div className="mb-4 w-full h-15">
                            <p>都道府県</p>
                            <select 
                                name="prefecture" 
                                value={formData.prefecture}
                                onChange={handleInputChange}
                                className="border border-gray-400 w-full h-1/2 px-2 bg-transparent rounded-sm text-[12px] font-[Inter]"
                                disabled={isLoading}
                                required
                            >
                                <option value="">選択してください</option>
                                {prefectures.map((prefecture, index) => (
                                    <option key={index} value={prefecture}>
                                        {prefecture}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4 w-full h-15">
                            <p>電話番号</p>
                            <input 
                                type="tel" 
                                name="phone_number" 
                                value={formData.phone_number}
                                onChange={handleInputChange}
                                placeholder="電話番号（ハイフンなし）" 
                                className="border border-gray-400 w-full h-1/2 px-2 bg-transparent rounded-sm text-[12px] font-[Inter]"
                                disabled={isLoading}
                                pattern="[0-9]{10,11}"
                                required
                            />
                        </div>
                        <div className="mb-4 w-full h-15">
                            <p>メールアドレス</p>
                            <input 
                                type="email" 
                                name="email" 
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="メールアドレス" 
                                className="border border-gray-400 w-full h-1/2 px-2 bg-transparent rounded-sm text-[12px] font-[Inter]"
                                disabled={isLoading}
                                required
                            />
                        </div>
                    </div>
                    
                    {/* 新規会員登録ボタン */}
                    <div className="mt-4">
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
                            {isLoading ? '登録中...' : '新規会員登録'}
                        </button>
                    </div>

                    {/* ログインページへのリンク */}
                    <div className="mt-4 text-center">
                        <Link href="/" className="text-[#155D27] text-sm underline hover:text-[#134a22]">
                            既にアカウントをお持ちの方はこちら
                        </Link>
                    </div>
                </form>
            </div>

            {/* チームロゴの右下配置 */}
            <img src="./images/source.png" alt="チームロゴ" width={60} height={60} className="absolute bottom-0 right-0 mb-4 mr-4 z-50"/>            
        </div>
    );
}