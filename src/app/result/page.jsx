import { Suspense } from 'react';
import ResultClient from './ResultClient';

// このページはサーバーコンポーネントとして、静的な枠組みだけを提供します
export default function ResultPage() {
  return (
    // SuspenseでResultClientを囲み、fallbackにローディングUIを指定します
    <Suspense fallback={
        <div className="max-w-[393px] mx-auto h-screen relative bg-[#dde7c7]">
            {/* Headerをここにも配置すると、ローディング中も表示されます */}
            {/* <Header /> */}
            <div className="flex justify-center items-center h-full">
                <div className="text-gray-600">結果を読み込み中...</div>
            </div>
        </div>
    }>
      <ResultClient />
    </Suspense>
  );
}