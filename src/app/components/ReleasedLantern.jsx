'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export function ReleasedLantern({ color, isStatic }) {
  const ref = useRef();
  const lightRef = useRef();
  const hasReachedTarget = useRef(isStatic);

  const texture = useTexture('/lantern_texture.png');
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  const { initialPosition, targetY } = useMemo(() => ({
    // X軸方向の出現位置を少しだけランダムにする
    initialPosition: [ (Math.random() - 0.5) * 3, -10, (Math.random() - 0.5) * 2 ],
    // 最終的に留まる高さを調整
    targetY: 4 + Math.random() * 4,
  }), []);

  useFrame((state) => {
    if (!ref.current || !lightRef.current) return;
    const time = state.clock.getElapsedTime();

    // XとZ方向の揺れ幅を小さくして、まっすぐ上がりやすくする
    ref.current.position.x = initialPosition[0] + Math.sin(time * 0.3 + initialPosition[0]) * 0.4;
    ref.current.position.z = initialPosition[2] + Math.cos(time * 0.2 + initialPosition[2]) * 0.4;

    if (!hasReachedTarget.current) {
      ref.current.position.y += 0.02;
      if (ref.current.position.y >= targetY) {
        hasReachedTarget.current = true;
      }
    } else {
      ref.current.position.y = targetY + Math.sin(time * 0.7 + initialPosition[0]) * 0.1;
    }

    const flicker = Math.sin(time * 5 + initialPosition[0]) * 0.3 + Math.random() * 0.2;
    lightRef.current.material.emissiveIntensity = 5 + flicker * 2;
  });

  return (
    <group position={initialPosition} ref={ref} scale={1.0}>
      <mesh>
        <cylinderGeometry args={[0.7, 0.4, 1.8, 16, 5, false]} />
        <meshStandardMaterial
          map={texture}
          emissiveMap={texture}
          emissive={"#ffddaa"}
          emissiveIntensity={1.1}
          transparent={true}
          opacity={0.85}
          side={THREE.DoubleSide}
          roughness={0.6}
        />
      </mesh>
      <mesh ref={lightRef} position={[0, -0.4, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          emissive="#ffaa55"
          emissiveIntensity={5}
          toneMapped={false}
          transparent={true}
          opacity={0.7}
        />
      </mesh>
    </group>
  );
}