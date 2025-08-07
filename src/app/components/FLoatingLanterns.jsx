// frontend/app/components/FloatingLanterns.jsx

'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 1から5の数値を特定の色に変換するマッピングを定義
const answerToColorMap = {
  1: '#ff6b6b', // 赤系
  2: '#ffa07a', // オレンジ系
  3: '#ffd700', // 黄色
  4: '#98fb98', // 明るい緑
  5: '#87cefa', // 明るい青
};

// 数値を色に変換するヘルパー関数
const mapAnswersToColors = (answers) => {
  if (!answers || answers.length === 0) return [];
  return answers.map(answer => answerToColorMap[answer] || '#ffffff'); // マップにない場合は白
};

export function FloatingLanterns({ colors: rawAnswers }) {
  const groupRef = useRef();

  const gradientColors = useMemo(() => {
    const mappedColors = mapAnswersToColors(rawAnswers);

    if (!mappedColors || mappedColors.length < 1) {
      return [];
    }
    if (mappedColors.length === 1) {
      return [new THREE.Color(mappedColors[0]).getHex()];
    }

    const gradient = [];
    const stepsPerSegment = 5;
    for (let i = 0; i < mappedColors.length - 1; i++) {
      const startColor = new THREE.Color(mappedColors[i]);
      const endColor = new THREE.Color(mappedColors[i + 1]);
      for (let j = 0; j < stepsPerSegment; j++) {
        const t = j / stepsPerSegment;
        gradient.push(startColor.clone().lerp(endColor, t).getHex());
      }
    }
    gradient.push(new THREE.Color(mappedColors[mappedColors.length - 1]).getHex());
    return gradient;
  }, [rawAnswers]);

  useFrame(({ clock }) => {
    if (groupRef.current && groupRef.current.children.length > 0) { 
      groupRef.current.children.forEach((lantern, index) => {
        const time = clock.getElapsedTime() + index * 0.1;
        lantern.position.y = (Math.sin(time * 0.5) * 0.5) + (index * 0.05);
        lantern.position.x = Math.sin(time * 0.7 + index * 0.1) * 2;
        lantern.rotation.z = Math.cos(time * 0.8 + index * 0.1) * 0.5;
      });
    }
  });

  if (gradientColors.length === 0) {
    return null;
  }

  return (
    <group ref={groupRef}>
      {gradientColors.map((color, i) => (
        <mesh key={i} position={[(Math.random() - 0.5) * 10, i * 0.5, (Math.random() - 0.5) * 10]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.8}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
    </group>
  );
}