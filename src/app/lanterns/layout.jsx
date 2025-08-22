// ヘッダーコンポーネントをインポートします
import Header from "../components/Header";

export default function LanternsLayout({ children }) {
  return (
    // 背景色を設定
    <div className="bg-gray-100">
      {/* スマホ画面を想定した中央のコンテナ */}
      <div className="relative mx-auto flex h-screen max-w-md flex-col overflow-hidden bg-white shadow-lg">
        
        {/* ヘッダーをレイアウトに含めます */}
        <Header />

        {/* ページコンテンツは残りの領域をすべて使います */}
        <main className="flex-grow">
          {children}
        </main>

      </div>
    </div>
  );
}