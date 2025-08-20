'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import { FloatingLanterns } from './FLoatingLanterns';
import { useFrame } from '@react-three/fiber';

// カメラをゆっくり動かすコンポーネント
function Rig() {
    useFrame((state, delta) => {
        state.camera.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 2;
        state.camera.position.z = Math.cos(state.clock.elapsedTime * 0.1) * 2 + 13;
        state.camera.lookAt(0, 2, 0);
    });
    return null;
}

export default function LanternScene({ lanterns }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 2, 15]} fov={60} />
        <ambientLight intensity={0.8} />
        <Environment
          background
          files={[
            '/textures/nightsky/px.jpg', '/textures/nightsky/nx.jpg',
            '/textures/nightsky/py.jpg', '/textures/nightsky/ny.jpg',
            '/textures/nightsky/pz.jpg', '/textures/nightsky/nz.jpg',
          ]}
        />
        <Suspense fallback={null}>
          <FloatingLanterns lanterns={lanterns} />
          <Rig />
        </Suspense>
      </Canvas>
    </div>
  );
}