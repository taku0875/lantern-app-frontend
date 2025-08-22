'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera } from '@react-three/drei';
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

export default function LanternScene({ lanterns }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 2, 15]} fov={75} />
        <ambientLight intensity={0.2} />
        <Environment
          background
          files={[
            '/textures/nightsky/px.jpg', '/textures/nightsky/nx.jpg',
            '/textures/nightsky/py.jpg', '/textures/nightsky/ny.jpg',
            '/textures/nightsky/pz.jpg', '/textures/nightsky/nz.jpg',
          ]}
        />
        <Suspense fallback={null}>
          {/* 1. 背景用の10個のランタンを常に表示 */}
          <FloatingLanterns />

          {/* 2. ボタンで新しく飛ばされたランタンをここに追加して描画 */}
          {lanterns.map((lanternData) => (
            <ReleasedLantern key={lanternData.id} {...lanternData} />
          ))}

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
      </Canvas>
    </div>
  );
}