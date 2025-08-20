'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Header from "../components/Header";

export default function Page() {
    const router = useRouter();
    const [questions, setQuestions] = useState([]);
    const [scores, setScores] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // カテゴリ定義
    const categories = {
        1: "睡眠・身体面",
        2: "感情・気分面", 
        3: "認知・集中面",
        4: "社会・人間関係面",
        5: "自己肯定・将来面"
    };

    // フォールバック用の質問リスト（API取得失敗時に使用）
    /*
    const allQuestions = [
        // 睡眠・身体面（カテゴリID: 1）
        { id: 1, categoryId: 1, text: "夜はぐっすりと眠れていますか？" },
        { id: 2, categoryId: 1, text: "朝、スッキリと目覚めることができますか？" },
        { id: 3, categoryId: 1, text: "体調が良好だと感じますか？" },
        { id: 4, categoryId: 1, text: "日中、適度な活力を感じますか？" },
        
        // 感情・気分面（カテゴリID: 2）
        { id: 5, categoryId: 2, text: "心が穏やかで安定していると感じますか？" },
        { id: 6, categoryId: 2, text: "日々の生活に満足感を感じますか？" },
        { id: 7, categoryId: 2, text: "自分の気持ちをうまくコントロールできていますか？" },
        { id: 8, categoryId: 2, text: "ポジティブな気持ちで過ごせる時間が多いですか？" },
        { id: 9, categoryId: 2, text: "笑ったり微笑んだりすることが多いですか？" },
        
        // 認知・集中面（カテゴリID: 3）
        { id: 10, categoryId: 3, text: "物事に集中して取り組むことができますか？" },
        { id: 11, categoryId: 3, text: "頭がクリアで思考がまとまっていると感じますか？" },
        { id: 12, categoryId: 3, text: "新しいことを学んだり覚えたりするのに意欲的ですか？" },
        
        // 社会・人間関係面（カテゴリID: 4）
        { id: 13, categoryId: 4, text: "人との会話を楽しめていますか？" },
        { id: 14, categoryId: 4, text: "家族や友人との時間を心地よく感じますか？" },
        { id: 15, categoryId: 4, text: "困った時に相談できる人がいると感じますか？" },
        { id: 16, categoryId: 4, text: "他の人とのコミュニケーションがスムーズにとれていますか？" },
        
        // 自己肯定・将来面（カテゴリID: 5）
        { id: 17, categoryId: 5, text: "自分の価値や能力を認めることができますか？" },
        { id: 18, categoryId: 5, text: "将来に対して希望や期待を持てていますか？" },
        { id: 19, categoryId: 5, text: "自分らしく生活できていると感じますか？" },
        { id: 20, categoryId: 5, text: "日々の小さな成功や達成感を味わえていますか？" }
    ];
    */

    // スコアごとの補足テキスト
    const scoreLabels = {
        1: "そう感じない",
        3: "どちらとも\nいえない", 
        5: "非常に\nそう感じる",
    };

    // カテゴリごとに1問ずつランダム選択する関数
    const getQuestionsByCategory = (questionList) => {
        // カテゴリごとにグループ化
        const questionsByCategory = {};
        questionList.forEach(question => {
            if (!questionsByCategory[question.categoryId]) {
                questionsByCategory[question.categoryId] = [];
            }
            questionsByCategory[question.categoryId].push(question);
        });

        // 各カテゴリから1問ずつランダム選択
        const selectedQuestions = [];
        Object.keys(categories).forEach(categoryId => {
            const categoryQuestions = questionsByCategory[parseInt(categoryId)];
            if (categoryQuestions && categoryQuestions.length > 0) {
                const randomIndex = Math.floor(Math.random() * categoryQuestions.length);
                selectedQuestions.push(categoryQuestions[randomIndex]);
            }
        });

        return selectedQuestions;
    };

    // バックエンドから質問を取得する関数
    const fetchQuestions = async () => {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + '/questions', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                // バックエンドから取得した質問をそのまま使用（既にカテゴリごとに選択済み）
                setQuestions(data.questions);
                setScores(Array(data.questions.length).fill(0));
            } else {
                console.error('Failed to fetch questions');
                // エラー時はエラーメッセージを表示
                alert('質問の取得に失敗しました。しばらく経ってから再度お試しください。');
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
            // エラー時はエラーメッセージを表示
            alert('ネットワークエラーが発生しました。しばらく経ってから再度お試しください。');
        }
    };

    // すべての質問に回答されているかチェック
    const isAllAnswered = scores.length > 0 && scores.every(score => score > 0);

    // ラジオボタンの変更時に呼ばれる関数
    const handleChange = (questionIndex, score) => {
        const newScores = [...scores];
        newScores[questionIndex] = score;
        setScores(newScores);
    };

    // 診断結果を送信する関数
    const handleSubmit = async () => {
        if (!isAllAnswered) return;

        setIsSubmitting(true);

        const totalScore = scores.reduce((acc, curr) => acc + curr, 0);

        /*
        // 実際のバックエンド連携処理（一時的にコメントアウト）
        try {
            const response = await fetch('/api/submit-diagnosis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    answers: scores.map((score, index) => ({
                        questionId: questions[index].question_id,
                        categoryId: questions[index].category.category_id,
                        score: score
                    })),
                    totalScore: totalScore,
                    date: new Date().toISOString()
                })
            });

            if (response.ok) {
                const result = await response.json();
                // 結果の色情報と共に結果画面に遷移
                router.push(`/result?color=${result.resultColor}&score=${totalScore}`);
            } else {
                console.error('Failed to submit diagnosis');
                alert('診断の送信に失敗しました');
            }
        } catch (error) {
            console.error('Error submitting diagnosis:', error);
            alert('ネットワークエラーが発生しました');
        } finally {
            setIsSubmitting(false);
        }
        */

        // 一時的にローカルで色を計算して結果画面に遷移
        const resultColor = calculateResultColor(totalScore);
        setTimeout(() => {
            router.push(`/result?color=${encodeURIComponent(resultColor)}&score=${totalScore}`);
        }, 500);
    };

    // スコアに基づいて結果の色を計算する関数
    const calculateResultColor = (score) => {
        // 5点〜25点を5色のグラデーションで表現
        const colors = [
            "#ed735b", 
            "#f18c30", 
            "#57b658", 
            "#0a9994", 
            "#1c5dab", 
        ];

        // スコアを0-4のインデックスに変換
        const index = Math.min(Math.max(Math.floor((score - 5) / 4), 0), 4);
        return colors[index];
    };

    useEffect(() => {
        let isMounted = true;
        
        const loadQuestions = async () => {
            if (!isMounted) return;
            
            setIsLoading(true);
            await fetchQuestions();
            
            if (isMounted) {
                setIsLoading(false);
            }
        };

        loadQuestions();
        
        return () => {
            isMounted = false;
        };
    }, []);

    // ローディング中の表示
    if (isLoading) {
        return (
            <div className="max-w-[393px] mx-auto h-screen relative bg-white">
                <Header />
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-500">質問を読み込み中...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[393px] mx-auto h-screen relative bg-white">
            <Header />

            <div className="mx-4 mt-8">
                {/* 質問ごとの表示 */}
                {questions.map((q, qIndex) => (
                    <div key={q.question_id} className="mb-8">
                        <p className="mb-4 font-medium text-center">{q.question_text}</p>

                        {/* 開発用：カテゴリ表示（本番では削除） */}
                        {/* {process.env.NODE_ENV === 'development' && (
                            <p className="text-xs text-gray-400 text-center mb-2">
                                [{q.category.category_name}]
                            </p>
                        )} */}

                        <div className="flex justify-between gap-2">
                            {[1, 2, 3, 4, 5].map((score) => (
                                <label key={score} className="flex flex-col items-center flex-1">
                                    <input
                                        type="radio"
                                        name={`question-${qIndex}`}
                                        className="radio radio-accent"
                                        value={score}
                                        onChange={() => handleChange(qIndex, score)}
                                        checked={scores[qIndex] === score}
                                        disabled={isSubmitting}
                                    />

                                    {/* 補足テキスト（1,3,5点のみ、2行対応） */}
                                    {scoreLabels[score] && (
                                        <span className="text-[8px] text-center text-gray-500 mt-1 leading-tight whitespace-pre-line">
                                            {scoreLabels[score]}
                                        </span>
                                    )}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}

                {/* 合計スコア（開発用、本番では削除） */}
                {/* {process.env.NODE_ENV === 'development' && (
                    <div className="mt-6 text-right text-sm text-gray-400">
                        合計スコア（開発用）: {scores.reduce((acc, curr) => acc + curr, 0)} 点
                        <br />
                        選択された質問数: {questions.length} 問
                    </div>
                )} */}

                {/* 診断結果ボタン */}
                <div className="mt-6 mb-8">
                    <button 
                        onClick={handleSubmit}
                        disabled={!isAllAnswered || isSubmitting}
                        className={`
                            border-3 rounded-sm p-2 font-bold w-full transition-colors duration-200
                            ${isAllAnswered && !isSubmitting
                                ? 'border-[#155D27] bg-[#155D27] text-white hover:bg-[#134a22] cursor-pointer'
                                : 'border-gray-300 bg-gray-300 text-gray-500 cursor-not-allowed'
                            }
                        `}
                    >
                        {isSubmitting ? '診断中...' : '今日の状態を確認する'}
                    </button>
                </div>
            </div>

            {/* チームロゴの右下配置 */}
            <div className="flex justify-end mt-4 mr-4">
                <img src="./images/source.png" alt="チームロゴ" width={60} height={60}/>
            </div>
        </div>
    );
}