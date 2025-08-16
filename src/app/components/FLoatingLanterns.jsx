// frontend/app/components/FloatingLanterns.jsx

'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei'; // 画像テクスチャを読み込むために必要

// 1から5の数値を特定の色に変換するマッピングを定義
const answerToColorMap = {
  1: '#ed735b', // 赤系
  2: '#f18c30', // オレンジ系
  3: '#57b658', // 黄色
  4: '#0a9994', // 明るい緑
  5: '#1c5dab', // 明るい青
};

// 数値を色に変換するヘルパー関数
const mapAnswersToColors = (answers) => {
  if (!answers || answers.length === 0) return [];
  return answers.map(answer => answerToColorMap[answer] || '#ffffff'); // マップにない場合は白
};
// 個々のランタンコンポーネント
function Lantern({ color, initialPosition, isStatic }) {
    const lanternRef = useRef();
    const lightRef = useRef();
    // 和紙のようなテクスチャ画像を読み込みます
    const texture = useTexture('/lantern_texture.png'); 

    const targetY = useMemo(() => isStatic ? initialPosition[1] : 1 + Math.random() * 3, [isStatic, initialPosition]);
    const hasReachedTarget = useRef(isStatic);

    useFrame(({ clock }) => {
        if (!lanternRef.current) return;
        const time = clock.getElapsedTime();

        // 横揺れの動き
        const swayX = initialPosition[0] + Math.sin(time * 0.3 + initialPosition[0]) * 1.5;
        lanternRef.current.position.x = swayX;
        const driftZ = initialPosition[2] + Math.cos(time * 0.2 + initialPosition[2]) * 1.5;
        lanternRef.current.position.z = driftZ;
        
        // 縦の動き
        if (!hasReachedTarget.current) {
            lanternRef.current.position.y += 0.03;
            if (lanternRef.current.position.y >= targetY) {
                hasReachedTarget.current = true;
                lanternRef.current.position.y = targetY;
            }
        } else {
            const bobY = targetY + Math.sin(time * 0.7 + initialPosition[0]) * 0.08;
            lanternRef.current.position.y = bobY;
        }

        // 光のゆらぎ
        if (lightRef.current) {
            lightRef.current.intensity = 1.0 + Math.sin(clock.getElapsedTime() * 5 + initialPosition[0]) * 0.2;
        }
    });

    return (
        <group ref={lanternRef} position={initialPosition} scale={0.8}> {/* 少し小ぶりに */}
            {/* ★ 1. ランタンの光る本体部分（少し縦長の箱に） */}
            <mesh>
                <boxGeometry args={[0.6, 0.8, 0.6]} />
                <meshStandardMaterial
                    map={texture}
                    color={color}
                    emissive={color}
                    emissiveIntensity={1.8}
                    transparent={true}
                    opacity={0.95}
                    toneMapped={false}
                />
            </mesh>
            {/* ★ 2. ランタンの上部のフチ（木枠） */}
            <mesh position={[0, 0.42, 0]}>
                <boxGeometry args={[0.65, 0.05, 0.65]} />
                <meshStandardMaterial color="#5c3d2e" />
            </mesh>
             {/* ★ 3. ランタンの下部のフチ（木枠） */}
            <mesh position={[0, -0.42, 0]}>
                <boxGeometry args={[0.65, 0.05, 0.65]} />
                <meshStandardMaterial color="#5c3d2e" />
            </mesh>
            <pointLight ref={lightRef} color={"#ffc975"} intensity={1.0} distance={3.0} decay={2} />
        </group>
    );
}
// 複数のランタンを管理するコンポーネント
export function FloatingLanterns({ lanterns }) {
    return (
        <group>
            {lanterns.map((lanternData) => (
                <Lantern
                    key={lanternData.id}
                    color={lanternData.color}
                    isStatic={lanternData.isStatic}
                    initialPosition={[
                        lanternData.isStatic ? (Math.random() - 0.5) * 20 : 0,
                        lanternData.isStatic ? 1 + Math.random() * 3 : -10,
                        lanternData.isStatic ? (Math.random() - 0.5) * 20 : 0,
                    ]}
                />
            ))}
        </group>
    );
}

