// frontend/app/components/LanternScene.jsx

'use client';

import React, { Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

const SkyboxContent = () => {
  // ↓↓↓ このログがターミナルに表示されるか確認するための「目印」です！ ↓↓↓
  console.log("--- CORRECT LanternScene.jsx code is running ---"); 

  const texture = useLoader(THREE.CubeTextureLoader, [ 
    '/textures/nightsky/px.jpg', // 1. 右
    '/textures/nightsky/nx.jpg', // 2. 左
    '/textures/nightsky/py.jpg', // 3. 上
    '/textures/nightsky/ny.jpg', // 4. 下
    '/textures/nightsky/pz.jpg', // 5. 奥
    '/textures/nightsky/nz.jpg'  // 6. 手前
  ]);

  return <primitive attach="background" object={texture} />;
};

export function LanternScene({ colors }) {
  return (
    <Canvas>
      <Suspense fallback={null}>
        <SkyboxContent />
      </Suspense>
    </Canvas>
  );
}