'use client';
import Link from "next/link";
import { useEffect, useState } from "react";

import Header from "../components/Header";
import WeeklySummary from "../components/WeeklySummary";
import DayResultModal from "../components/DayResultModal";

export default function Page() {
    const [weeklyData, setWeeklyData] = useState([]);
    const [weekDateRange, setWeekDateRange] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dayResult, setDayResult] = useState(null);

    // color_idと色のマッピング
    const COLOR_MAP = {
        1: '#ed735b', // 赤
        2: '#f18c30', // 黄
        3: '#57b658', // 緑  
        4: '#0a9994', // 青緑
        5: '#1c5dab' // 青
    };

    // 今週の日付範囲を計算する関数
    const getCurrentWeekRange = () => {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0: 日曜日, 1: 月曜日, ...
        
        // 月曜日を週の開始として計算
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const monday = new Date(today);
        monday.setDate(today.getDate() + mondayOffset);
        
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}/${month}/${day}`;
        };
        
        return `${formatDate(monday)}〜${formatDate(sunday)}`;
    };

    // データベースから週間データを取得する関数（コメントアウト）
    const fetchWeeklyData = async () => {
        
        // 実際のデータベース連携処理（一時的にコメントアウト）
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + '/mood/week', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}` // 認証トークンがある場合
                }
            });

            if (response.ok) {
                const data = await response.json();
                // 7日間の完全なデータを作成（データがない日はグレー）
                const dayNames = ["月", "火", "水", "木", "金", "土", "日"];
                const formattedData = dayNames.map((dayName, index) => {
                    // APIデータが存在し、かつ該当インデックスにデータがある場合
                    const colorId = data.color_ids && data.color_ids[index] !== undefined ? data.color_ids[index] : null;
                    return {
                        day: dayName,
                        color: colorId ? COLOR_MAP[colorId] || "#CCCCCC" : "#CCCCCC", // データがない場合はグレー
                        colorId: colorId
                    };
                });
                setWeeklyData(formattedData);
            } else {
                console.error('Failed to fetch weekly data');
                // エラー時はデフォルトデータを使用
                setWeeklyData(getDefaultWeeklyData());
            }
        } catch (error) {
            console.error('Error fetching weekly data:', error);
            // エラー時はデフォルトデータを使用
            setWeeklyData(getDefaultWeeklyData());
        }
        
    };

    // デフォルトの週間データ（直接色指定）
    const getDefaultWeeklyData = () => {
        return [
            { day: "月", color: "#FF6B6B" },
            { day: "火", color: "#FFD93D" },
            { day: "水", color: "#6BCB77" },
            { day: "木", color: "#6BCB77" },
            { day: "金", color: "#CCCCCC" },
            { day: "土", color: "#CCCCCC" },
            { day: "日", color: "#CCCCCC" },
        ];
    };

    // 日付クリック時の処理
    const handleDayClick = async (dayData) => {
        setSelectedDay(dayData);
        setIsModalOpen(true);
        
        // APIからデータを取得
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + `/daily-result?day=${dayData.day}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                setDayResult(result);
            } else {
                setDayResult(null);
            }
        } catch (error) {
            console.error('Error fetching day result:', error);
            setDayResult(null);
        }
    };

    // モーダルを閉じる処理
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDay(null);
        setDayResult(null);
    };

    useEffect(() => {
        // 週の日付範囲を設定
        setWeekDateRange(getCurrentWeekRange());
        
        // 週間データを取得
        const loadWeeklyData = async () => {
            setIsLoading(true);
            await fetchWeeklyData();
            setIsLoading(false);
        };
        
        loadWeeklyData();
    }, []);

    return(
         <div className="max-w-[393px] mx-auto h-screen relative bg-[#dde7c7]">
            <Header />

            <div className="mx-8 min-h-screen flex items-center justify-center px-[2px]">
                <div className="card w-full bg-white rounded-md shadow-sm">
                    <div className="card-body text-center p-4">
                        {/* 今週の記録タイトル */}
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-center">
                                今週の記録
                            </h2>
                            <p className="text-sm text-gray-600 text-center mt-1">
                                （{weekDateRange}）
                            </p>
                        </div>

                        {/* ローディング表示 */}
                        {isLoading ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="text-gray-500">読み込み中...</div>
                            </div>
                        ) : (
                            <div>
                                <WeeklySummary data={weeklyData} onDayClick={handleDayClick} />
                            </div>
                        )}

                        {/* キャラクター画像 */}
                        <div className="flex justify-center my-6">
                            <img 
                                src="./images/character.png" 
                                alt="てがきですの！β" 
                                className="max-w-full h-auto w-[200px]"
                            />
                        </div>

                        {/* 診断開始ボタン */}
                        <div className="mt-4">
                            <Link href="./check">
                                <button 
                                    type="submit" 
                                    className="border-3 border-[#155D27] rounded-sm p-2 bg-[#155D27] text-white font-bold w-full hover:bg-[#134a22] transition-colors duration-200"
                                >
                                    今日の状態をチェック
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>          
            </div>
            
            {/* チームロゴの右下配置 */}
            <img src="./images/source.png" alt="チームロゴ" width={60} height={60} className="absolute bottom-0 right-0 mb-4 mr-4 z-50"/>
            
            {/* モーダル */}
            <DayResultModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                dayData={selectedDay}
                dayResult={dayResult}
            />
        </div>
    );
}