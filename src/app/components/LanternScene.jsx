'use client';

import { Suspense,useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera,PerformanceMonitor } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { FloatingLanterns } from './FLoatingLanterns'; // 背景ランタン
import { ReleasedLantern } from './ReleasedLantern';  // 新しく飛ばすランタン
import { useFrame } from '@react-three/fiber';

function Rig() {
    useFrame((state) => {
        state.camera.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 5;
        state.camera.position.z = 10 + Math.cos(state.clock.elapsedTime * 0.1) * 5;
        state.camera.lookAt(0, 5, 0);
    });
    return null;
}

export default function LanternScene({ pastLanterns = [], newlyReleasedLantern = null  }) {
  const [dpr, setDpr] = useState(1.5);
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}>
      <Canvas dpr={dpr}>
        <PerspectiveCamera makeDefault position={[0, 2, 15]} fov={75} />
        <ambientLight intensity={0.2} />
                {/* ✨ PerformanceMonitorでシーン全体を囲みます */}
        <PerformanceMonitor 
            // パフォーマンスが良い場合（FPSが高い）、解像度を上げる
            onIncline={() => setDpr(2)} 
            // パフォーマンスが悪い場合（FPSが低い）、解像度を落として負荷を軽減する
            onDecline={() => setDpr(1)}
        >
          <Environment
            background
            files={[
              '/textures/nightsky/px.jpg', '/textures/nightsky/nx.jpg',
              '/textures/nightsky/py.jpg', '/textures/nightsky/ny.jpg',
              '/textures/nightsky/pz.jpg', '/textures/nightsky/nz.jpg',
            ]}
          />
          <Suspense fallback={null}>
            {/* 1. 背景用の5個のランタンを常に表示 */}
            <FloatingLanterns />

            {/* 2. DBから取得した過去の静的なランタンを描画 */}
            {pastLanterns.map((lantern) => (
              <ReleasedLantern 
              key={`past-${lantern.lantan_id}`} 
              colorId={lantern.lantan_color}
              isStatic={true} // 静的オブジェクトとして設定
              />
            ))}

            {/* 3. ボタンで新しく飛ばされたアニメーション付きランタンを描画 */}
            {newlyReleasedLantern && (
              <ReleasedLantern 
              key={`new-${newlyReleasedLantern.lantan_id}`}
              colorId={newlyReleasedLantern.lantan_color}
              isStatic={false} // アニメーションさせるオブジェクトとして設定
              />
            )}

            <Rig />
          </Suspense>

          <EffectComposer>
            <Bloom 
            luminanceThreshold={0.3}
            luminanceSmoothing={0.9} 
            height={300} 
            intensity={1.0}
            />
           </EffectComposer>
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}