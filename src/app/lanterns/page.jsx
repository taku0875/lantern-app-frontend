import dynamic from 'next/dynamic';

// LanternsClientコンポーネントを、ブラウザ側でのみ読み込むように設定します。
// これにより、サーバーサイドレンダリング（SSR）が無効になります。
const LanternsClient = dynamic(
  () => import('../components/LanternsClient'),
  { ssr: false } 
);

export default function LanternsPage() {
    // これまでの<main>タグは不要です
    return (
        <LanternsClient />
    )
}