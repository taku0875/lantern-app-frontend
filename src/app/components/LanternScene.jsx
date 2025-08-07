// frontend/app/components/LanternScene.jsx

'use client';

import React, { Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

const SkyboxContent = () => {
  // ↓↓↓ このログがターミナルに表示されるか確認するための「目印」です！ ↓↓↓
  console.log("--- CORRECT LanternScene.jsx code is running ---"); 

  const texture = useLoader(THREE.CubeTextureLoader, [ 
    '/textures/nightsky/nx.jpg', 
    '/textures/nightsky/ny.jpg', 
    '/textures/nightsky/nz.jpg',
    '/textures/nightsky/px.jpg', 
    '/textures/nightsky/py.jpg', 
    '/textures/nightsky/pz.jpg'
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