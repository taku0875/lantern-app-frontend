// app/result/ResultClient.jsx

'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "../components/Header";

// APIエラー時のためのフォールバック関数
const getDefaultActions = (score) => {
    console.warn("API fetch failed, returning default actions.");
    if (score <= 2) {
        return [
            { id: 999, title: '静かな音楽を聴く', detail: 'リラックスできる音楽を聴いてみてはいかがでしょうか。', image: './images/default.png' }
        ];
    }
    return [
        { id: 998, title: 'ゆっくり休む', detail: '自然の中に身を置いてリフレッシュしましょう。', image: './images/default.png' }
    ];
};

export default function ResultClient() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const [resultData, setResultData] = useState(null);
    const [selectedAction, setSelectedAction] = useState(null);

    const isSunday = () => {
        const today = new Date();
        // return today.getDay() === 0; // 0が日曜日
        return true; // デバッグ用に常にtrueを返す
    };

    const getScoreDescription = (score, color) => {
        if (score == 1) return <p>あなたの心の色は深い赤です。<br />少し休息が必要かもしれません。</p>;
        if (score == 2) return <p>あなたの心の色は温かいオレンジです。<br />ゆっくりとした時間を過ごしましょう。</p>;
        if (score == 3) return <p>あなたの心の色は明るい緑です。<br />バランスの取れた状態です。</p>;
        if (score == 4) return <p>あなたの心の色は爽やかな青緑です。<br />とても良い状態ですね。</p>;
        return <p>あなたの心の色は美しい青です。<br />素晴らしいコンディションです！</p>;
    };

    const fetchSuggestedActions = async (score) => {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + '/recommendations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
                body: JSON.stringify({ score: score })
            });

            if (response.ok) {
                const data = await response.json();
                return data.map(item => ({
                    id: item.recommend_id,
                    title: item.action_recommend,
                    detail: item.recommend_detail,
                    effect: 'リラックス効果、心の安定',
                    image: './images/default.png',
                    color_id: item.color_id
                }));
            } else {
                return getDefaultActions(score);
            }
        } catch (error) {
            return getDefaultActions(score);
        }
    };

    useEffect(() => {
        const loadResultData = async () => {
            const color = searchParams.get('color');
            const scoreParam = searchParams.get('score');
            const score = scoreParam ? parseInt(scoreParam) : null;

            if (!color || !score) {
                router.push('/home');
                return;
            }
            const actions = await fetchSuggestedActions(score);
            setResultData({
                color: color,
                score: score,
                description: getScoreDescription(score, color),
                actions: actions
            });
        };
        loadResultData();
    }, [searchParams, router]);

    if (!resultData) {
        return null; // Suspenseのfallbackが表示される
    }

    // ✨ ここから下が正しいJSXです
    return (
         <div className="max-w-[393px] mx-auto min-h-screen relative bg-[#dde7c7]">
            <Header />
            <main className="flex flex-col items-center mt-8 mx-2 pb-20">
                {/* 結果の色の円表示 */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 w-40 h-40 rounded-full bg-gray-300 opacity-20 blur-md transform translate-y-2"></div>
                    <div
                        className="w-40 h-40 rounded-full relative overflow-hidden"
                        style={{
                            backgroundColor: resultData.color,
                            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 30%, ${resultData.color} 70%)`,
                            boxShadow: `0 4px 20px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3)`,
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}
                    >
                         {/* 内側のハイライトなど */}
                    </div>
                </div>

                {/* 結果のディスクリプション */}
                <p className="text-center mb-8 text-lg px-4 leading-relaxed text-gray-700">
                    {resultData.description}
                </p>

                {/* おすすめ行動のリスト */}
                <div className="w-full px-2">
                    <h3 className="text-lg font-bold mb-4 text-center text-gray-800">おすすめの行動</h3>
                    {resultData.actions.map((action) => (
                        <div
                            key={action.id}
                            onClick={() => setSelectedAction(action)}
                            className="flex justify-between items-center bg-white p-4 mb-3 rounded-2xl shadow-lg cursor-pointer transition-all duration-200"
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
                
                {/* ランタン開放ボタン */}
                {isSunday() && (
                    <div className="w-full px-2 mt-4">
                        <Link href="./lanterns">
                            <button className="w-full border-3 border-orange-400 rounded-lg p-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-bold shadow-lg">
                                🏮 ランタンを開放する
                            </button>
                        </Link>
                    </div>
                )}

                {/* ホームに戻るボタン */}
                <div className="w-full px-2 mt-6">
                    <Link href="./home">
                        <button className="w-full border-3 border-[#155D27] rounded-lg p-3 bg-[#155D27] text-white font-bold">
                            ホームに戻る
                        </button>
                    </Link>
                </div>
            </main>

            {/* 詳細表示モーダル */}
            {selectedAction && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4" onClick={() => setSelectedAction(null)}>
                    <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                        <div className="w-full h-32 mb-4 bg-gray-100 rounded-xl overflow-hidden">
                            <img src={selectedAction.image} alt={selectedAction.title} className="w-full h-full object-cover" />
                        </div>
                        <h2 className="text-xl font-bold mb-3 text-center text-gray-800">{selectedAction.title}</h2>
                        <div className="mb-4">
                            <h3 className="text-sm font-semibold text-gray-600 mb-2">詳細</h3>
                            <p className="text-gray-700 leading-relaxed">{selectedAction.detail}</p>
                        </div>
                        <button onClick={() => setSelectedAction(null)} className="w-full py-3 px-4 bg-red-400 text-white rounded-lg font-semibold">
                            閉じる
                        </button>
                    </div>
                </div>
            )}
            
            {/* チームロゴの右下配置 */}
            <div className="flex justify-end mt-4 mr-4">
                <img src="./images/source.png" alt="チームロゴ" width={60} height={60}/>
            </div>
        </div>
    );
}