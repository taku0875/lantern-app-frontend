import React from "react";

const WeeklySummary = ({ data, onDayClick }) => {
  return (
    <div className="flex flex-col items-center">
      {/* 曜日ラベル */}
      <div className="flex justify-between w-full px-4">
        {data.map((item, index) => (
          <div key={index} className="w-8 text-center text-sm text-gray-600">
            {item.day}
          </div>
        ))}
      </div>

      {/* 色付きの丸 */}
      <div className="flex justify-between w-full px-4 mt-2">
        {data.map((item, index) => (
          <div
            key={index}
            className="w-6 h-6 rounded-full cursor-pointer hover:scale-110 transition-transform duration-200"
            style={{ backgroundColor: item.color }}
            onClick={() => onDayClick && onDayClick(item, index)}
          />
        ))}
      </div>
    </div>
  );
};

export default WeeklySummary;