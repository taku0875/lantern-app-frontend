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
        return today.getDay() === 0; // 0が日曜日
    };

    // 固定の提案行動データ（スコア別）
    const allActions = {
        low: [ // 5-12点：要注意〜やや心配
            { 
                id: 1,
                title: '深呼吸をする', 
                detail: 'ゆっくりと深呼吸をすることで、心を落ち着かせることができます。',
                effect: 'ストレス軽減、リラックス効果',
                image: './images/breathing.png'
            },
            { 
                id: 2,
                title: '温かい飲み物を飲む', 
                detail: 'ハーブティーや温かいココアで、心と体を温めましょう。',
                effect: 'リラックス効果、心の安定',
                image: './images/warm-drink.png'
            },
            { 
                id: 3,
                title: '誰かに話を聞いてもらう', 
                detail: '信頼できる人に気持ちを話すことで、心が軽くなります。',
                effect: 'ストレス解消、気持ちの整理',
                image: './images/talk.png'
            },
            { 
                id: 4,
                title: '軽いストレッチをする', 
                detail: '体をほぐすことで、心の緊張も和らげることができます。',
                effect: '血行促進、リラックス効果',
                image: './images/stretch.png'
            }
        ],
        medium: [ // 13-16点：普通
            { 
                id: 5,
                title: '散歩に出かける', 
                detail: '自然の中を歩くことで、気分がさらに穏やかになります。',
                effect: '気分転換、運動効果',
                image: './images/walk.png'
            },
            { 
                id: 6,
                title: '音楽を聴く', 
                detail: 'お気に入りの音楽が、あなたの気持ちをサポートします。',
                effect: 'リラックス効果、感情調整',
                image: './images/music.png'
            },
            { 
                id: 7,
                title: '読書をする', 
                detail: '好きな本を読んで、心を豊かにする時間を過ごしましょう。',
                effect: 'リラックス効果、知的刺激',
                image: './images/reading.png'
            },
            { 
                id: 8,
                title: 'お風呂にゆっくり入る', 
                detail: '温かいお風呂で、一日の疲れを癒やしましょう。',
                effect: 'リラックス効果、疲労回復',
                image: './images/bath.png'
            }
        ],
        high: [ // 17-25点：良好〜非常に良好
            { 
                id: 9,
                title: '新しいことに挑戦する', 
                detail: '今の良い状態を活かして、新しいことにチャレンジしてみましょう。',
                effect: '成長促進、達成感',
                image: './images/challenge.png'
            },
            { 
                id: 10,
                title: '友人と過ごす時間を作る', 
                detail: '大切な人との時間を楽しみ、さらに幸福感を高めましょう。',
                effect: '社交性向上、幸福感増加',
                image: './images/friends.png'
            },
            { 
                id: 11,
                title: '趣味の時間を充実させる', 
                detail: '好きなことにより多くの時間を使い、充実感を味わいましょう。',
                effect: '満足感、創造性向上',
                image: './images/hobby.png'
            },
            { 
                id: 12,
                title: '運動を楽しむ', 
                detail: '体を動かすことで、さらに活力を高めることができます。',
                effect: '体力向上、ストレス解消',
                image: './images/exercise.png'
            }
        ]
    };

    // スコアに基づく説明文
    const getScoreDescription = (score, color) => {
        if (score <= 8) return `あなたの心の色は深い赤です。少し休息が必要かもしれません。`;
        if (score <= 12) return `あなたの心の色は温かいオレンジです。ゆっくりとした時間を過ごしましょう。`;
        if (score <= 16) return `あなたの心の色は明るい黄色です。バランスの取れた状態です。`;
        if (score <= 20) return `あなたの心の色は爽やかな黄緑です。とても良い状態ですね。`;
        return `あなたの心の色は美しい緑です。素晴らしいコンディションです！`;
    };

    // バックエンドから提案行動を取得する関数（コメントアウト）
    const fetchSuggestedActions = async (score) => {
        /*
        // 実際のバックエンド連携処理（一時的にコメントアウト）
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + '/suggested-actions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    score: score,
                    count: 2
                })
            });

            if (response.ok) {
                const data = await response.json();
                return data.actions;
            } else {
                console.error('Failed to fetch suggested actions');
                return getDefaultActions(score);
            }
        } catch (error) {
            console.error('Error fetching suggested actions:', error);
            return getDefaultActions(score);
        }
        */

        // 一時的に固定データからランダム選択
        return getDefaultActions(score);
    };

    // スコアに基づくデフォルト行動を取得
    const getDefaultActions = (score) => {
        let actionPool;
        if (score <= 12) {
            actionPool = allActions.low;
        } else if (score <= 16) {
            actionPool = allActions.medium;
        } else {
            actionPool = allActions.high;
        }

        // ランダムに2つ選択
        const shuffled = [...actionPool].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 2);
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
                    {resultData.actions.map((action, index) => (
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
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-600 mb-2">期待される効果</h3>
                            <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                                <p className="text-green-800 text-sm">
                                    {selectedAction.effect}
                                </p>
                            </div>
                        </div>

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