'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import Header from "../components/Header";

export default function Page() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const [resultData, setResultData] = useState(null);
    const [selectedAction, setSelectedAction] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // 日曜日かどうかを判定する関数を追加（useEffect の前あたりに）
    const isSunday = () => {
        const today = new Date();
        // return today.getDay() === 0; // 0が日曜日
        return true; // デバッグ用に常にtrueを返す
    };

    // スコアに基づく説明文
    const getScoreDescription = (score, color) => {
        if (score == 1) return <p>あなたの心の色は深い赤です。<br />少し休息が必要かもしれません。</p>;
        if (score == 2) return <p>あなたの心の色は温かいオレンジです。<br />ゆっくりとした時間を過ごしましょう。</p>;
        if (score == 3) return <p>あなたの心の色は明るい緑です。<br />バランスの取れた状態です。</p>;
        if (score == 4) return <p>あなたの心の色は爽やかな青緑です。<br />とても良い状態ですね。</p>;
        return <p>あなたの心の色は美しい青です。<br />素晴らしいコンディションです！</p>;
    };

    // バックエンドから提案行動を取得する関数
    const fetchSuggestedActions = async (score) => {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + '/recommendations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    score: score
                })
            });

            if (response.ok) {
                const data = await response.json();
                // バックエンドのデータ構造に対応したマッピング
                return data.map(item => ({
                    id: item.recommend_id,
                    title: item.action_recommend,
                    detail: item.recommend_detail,
                    effect: 'リラックス効果、心の安定', // バックエンドにeffectがない場合のデフォルト
                    image: './images/default.png', // バックエンドにimageがない場合のデフォルト
                    color_id: item.color_id
                }));
            } else {
                console.error('Failed to fetch suggested actions');
                return getDefaultActions(score);
            }
        } catch (error) {
            console.error('Error fetching suggested actions:', error);
            return getDefaultActions(score);
        }
    };

    useEffect(() => {
        const loadResultData = async () => {
            const color = searchParams.get('color');
            const score = parseInt(searchParams.get('score'));

            if (!color || !score) {
                // パラメータがない場合はホームに戻る
                router.push('/home');
                return;
            }

            // 提案行動を取得
            const actions = await fetchSuggestedActions(score);

            setResultData({
                color: color,
                score: score,
                description: getScoreDescription(score, color),
                actions: actions
            });

            setIsLoading(false);
        };

        loadResultData();
    }, [searchParams, router]);

    if (isLoading) {
        return (
            <div className="max-w-[393px] mx-auto h-screen relative bg-[#dde7c7]">
                <Header />
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-600">結果を読み込み中...</div>
                </div>
            </div>
        );
    }

    if (!resultData) {
        return (
            <div className="max-w-[393px] mx-auto h-screen relative bg-[#dde7c7]">
                <Header />
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-600">結果データが見つかりません</div>
                </div>
            </div>
        );
    }

    return(
         <div className="max-w-[393px] mx-auto h-screen relative bg-[#dde7c7]">
            <Header />
            <main className="flex flex-col items-center mt-8 mx-2 pb-20">
                {/* 落ち着いたオシャレな結果色の表示 */}
                <div className="relative mb-6">
                    {/* 外側の薄い影 */}
                    <div className="absolute inset-0 w-40 h-40 rounded-full bg-gray-300 opacity-20 blur-md transform translate-y-2"></div>
                    
                    {/* メインの色の円 */}
                    <div
                        className="w-40 h-40 rounded-full relative overflow-hidden"
                        style={{
                            backgroundColor: resultData.color,
                            background: `
                                radial-gradient(circle at 30% 30%, 
                                    rgba(255,255,255,0.4) 0%, 
                                    rgba(255,255,255,0.1) 30%, 
                                    ${resultData.color} 70%
                                )
                            `,
                            boxShadow: `
                                0 4px 20px rgba(0,0,0,0.15),
                                0 1px 3px rgba(0,0,0,0.1),
                                inset 0 1px 0 rgba(255,255,255,0.3)
                            `,
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}
                    >
                        {/* 内側のソフトなハイライト */}
                        <div
                            className="absolute top-3 left-6 w-12 h-12 rounded-full opacity-30"
                            style={{
                                background: 'radial-gradient(circle, rgba(255,255,255,0.8), transparent 70%)',
                                filter: 'blur(4px)'
                            }}
                        />
                        
                        {/* 底部の微細なシャドウ */}
                        <div
                            className="absolute bottom-0 left-0 right-0 h-8 rounded-b-full opacity-20"
                            style={{
                                background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.3))'
                            }}
                        />
                    </div>
                </div>

                <p className="text-center mb-8 text-lg px-4 leading-relaxed text-gray-700">
                    {resultData.description}
                </p>

                {/* 行動提案カード */}
                <div className="w-full px-2">
                    <h3 className="text-lg font-bold mb-4 text-center text-gray-800">おすすめの行動</h3>
                    {resultData.actions.map((action) => (
                        <div
                            key={action.id}
                            onClick={() => setSelectedAction(action)}
                            className="flex justify-between items-center bg-white p-4 mb-3 rounded-2xl shadow-lg cursor-pointer transform transition-all duration-200"
                            style={{
                                background: 'linear-gradient(135deg, #ffffff, #f8f9fa)',
                                border: '1px solid rgba(0,0,0,0.05)'
                            }}
                        >
                            <span className="text-base font-semibold text-gray-800 flex-1 mr-4">
                                {action.title}
                            </span>
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <span className="text-gray-600 font-bold">{'>'}</span>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* 日曜日限定のランタン開放ボタン */}
                {isSunday() && (
                    <div className="w-full px-2 mt-4">
                        <Link href="./lanterns">
                            <button className="w-full border-3 border-orange-400 rounded-lg p-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-bold hover:from-orange-500 hover:to-yellow-500 transition-all duration-200 transform hover:scale-105 shadow-lg">
                                🏮 ランタンを開放する
                            </button>
                        </Link>
                    </div>
                )}


                {/* ホームに戻るボタン */}
                <div className="w-full px-2 mt-6">
                    <Link href="./home">
                        <button className="w-full border-3 border-[#155D27] rounded-lg p-3 bg-[#155D27] text-white font-bold hover:bg-[#134a22] transition-colors duration-200">
                            ホームに戻る
                        </button>
                    </Link>
                </div>
            </main>

            {/* 詳細モーダル - 背景を透明に変更 */}
            {selectedAction && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50 p-4"
                    style={{
                        background: 'rgba(0, 0, 0, 0.4)',
                        backdropFilter: 'blur(2px)'
                    }}
                    onClick={() => setSelectedAction(null)}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
                        style={{
                            background: 'linear-gradient(135deg, #ffffff, #f8f9fa)',
                            maxHeight: '80vh',
                            overflowY: 'auto'
                        }}
                    >
                        {/* 行動のイメージ画像 */}
                        <div className="w-full h-32 mb-4 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                            <img 
                                src={selectedAction.image} 
                                alt={selectedAction.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    // 画像が見つからない場合のフォールバック
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center" style={{display: 'none'}}>
                                <span className="text-4xl">🌿</span>
                            </div>
                        </div>

                        {/* 行動名 */}
                        <h2 className="text-xl font-bold mb-3 text-center text-gray-800">
                            {selectedAction.title}
                        </h2>

                        {/* 行動の詳細 */}
                        <div className="mb-4">
                            <h3 className="text-sm font-semibold text-gray-600 mb-2">詳細</h3>
                            <p className="text-gray-700 leading-relaxed">
                                {selectedAction.detail}
                            </p>
                        </div>

                        {/* 効果 */}
                        {/* {selectedAction.effect && (
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-2">期待される効果</h3>
                                <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                                    <p className="text-green-800 text-sm">
                                        {selectedAction.effect}
                                    </p>
                                </div>
                            </div>
                        )} */}

                        {/* 閉じるボタン */}
                        <button
                            onClick={() => setSelectedAction(null)}
                            className="w-full py-3 px-4 bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-lg font-semibold hover:from-red-500 hover:to-pink-500 transition-all duration-200 transform hover:scale-105"
                        >
                            閉じる
                        </button>
                    </div>
                </div>
            )}

            {/* チームロゴの右下配置 */}
            <img src="./images/source.png" alt="チームロゴ" width={60} height={60} className="absolute bottom-0 right-0 mb-4 mr-4 z-50"/>
        </div>
    );
}