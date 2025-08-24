'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei'; // ✨ dreiからuseTextureフックをインポート
import * as THREE from 'three';

// 背景ランタン用に '#f18c30' 以外の4色を定義
const DUMMY_COLORS = ['#ed735b', '#57b658', '#59b6c0', '#4b8aed'];

// 個々のランタンを描画するためのコンポーネント
function Lantern({ initialPosition, color }) {
  const ref = useRef();
  const lightRef = useRef();
  const pointLightRef = useRef(); // ✨ PointLight用のrefを追加

  // ✨ useTextureフックを使って和紙のテクスチャを読み込む
  const texture = useTexture('/lantern_texture.png');
  // ✨ テクスチャが繰り返されるように設定
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  // 各ランタンがゆっくりと上下に揺れるアニメーション
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = initialPosition[1] + Math.sin(clock.getElapsedTime() + initialPosition[0]) * 0.5;
    }
  });

  return (
    <group position={initialPosition} ref={ref}>
      <mesh>
        <cylinderGeometry args={[0.7, 0.4, 1.8, 16]} />
        {/* ✨ より高品質なPhysicalMaterialに変更 */}
        <meshPhysicalMaterial
          map={texture}
          emissiveMap={texture}
          emissive={color}
          emissiveIntensity={1.4}
          side={THREE.DoubleSide}
          roughness={0.6}
          metalness={0}
          transmission={0.8}
          thickness={0.1}
        />
      </mesh>
      <mesh position={[0, -0.4, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          emissive={"#ffaa55"} //// 光源の色も合わせる
          toneMapped={false}
        />
      </mesh>
            {/* ✨ 実際に光を放つPointLightを追加 */}
      <pointLight
        ref={pointLightRef}
        position={[0, -0.4, 0]}
        color="#ffaa55"
        distance={5}
      />
    </group>
  );
}


// メインのコンポーネント
export function FloatingLanterns() {
  const lanterns = useMemo(() => [
    { position: [-5, 5, -2], color: DUMMY_COLORS[0] }, // 赤色
    { position: [6, 8, 0],  color: DUMMY_COLORS[1] }, // 緑色
    { position: [-4, 10, 3], color: DUMMY_COLORS[2] }, // 青緑色
    { position: [5, 3, -4],  color: DUMMY_COLORS[3] }, // 青色
  ], []);

  return (
    <group>
      {lanterns.map((lantern, index) => (
        <Lantern 
          key={index} 
          initialPosition={lantern.position} 
          color={lantern.color} 
        />
      ))}
    </group>
  );
}