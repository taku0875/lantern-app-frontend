import React from "react";

const DayResultModal = ({ isOpen, onClose, dayData, dayResult }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-auto">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            {dayData?.day}曜日の結果
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* 色の表示 */}
        <div className="flex items-center justify-center mb-4">
          <div
            className="w-16 h-16 rounded-full border-2 border-gray-200"
            style={{ backgroundColor: dayData?.color || "#CCCCCC" }}
          />
        </div>

        {/* 結果の詳細 */}
        <div className="space-y-3">
          {dayResult ? (
            <>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {dayResult.questions && dayResult.questions.map((qa, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Q{index + 1}: {qa.question}
                    </p>
                    <p className="text-sm text-gray-600 pl-4 border-l-2 border-[#155D27]">
                      {qa.answer}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="text-center text-xs text-gray-500 pt-2 border-t">
                記録日時: {dayResult.timestamp || "不明"}
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">
                この日はまだ記録がありません
              </p>
              <p className="text-sm text-gray-400 mt-2">
                「今日の状態をチェック」から記録してみましょう
              </p>
            </div>
          )}
        </div>

        {/* 閉じるボタン */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full bg-[#155D27] text-white py-2 px-4 rounded-md hover:bg-[#134a22] transition-colors duration-200"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default DayResultModal;