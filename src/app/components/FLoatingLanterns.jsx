'use client';

import * as THREE from 'three';
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

const texture = new THREE.TextureLoader().load('/lantern_texture.png');
texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

const shadeMaterial = new THREE.MeshStandardMaterial({
  map: texture,
  emissiveMap: texture,
  emissive: "#ffddaa",
  emissiveIntensity: 1.1,
  transparent: true,
  opacity: 0.85,
  side: THREE.DoubleSide,
  roughness: 0.6,
});

const lightMaterial = new THREE.MeshStandardMaterial({
  emissive: "#ffaa55",
  emissiveIntensity: 5,
  toneMapped: false,
  transparent: true,
  opacity: 0.7,
});

const shadeGeometry = new THREE.CylinderGeometry(0.7, 0.4, 1.8, 16, 5, false);
const lightGeometry = new THREE.SphereGeometry(0.3, 16, 16);

export function FloatingLanterns() {
  const shadeRef = useRef();
  const lightRef = useRef();
  const COUNT = 5; // 背景ランタンの数を5個に調整

  const particles = useMemo(() => {
    return Array.from({ length: COUNT }, () => ({
      position: [
        (Math.random() - 0.5) * 25, // X方向の範囲
        2 + Math.random() * 20,     // Y方向の初期高さを少し上げる
        (Math.random() - 0.5) * 15, // Z方向（奥行き）の範囲を狭める
      ],
      offset: Math.random() * 100,
    }));
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const dummy = new THREE.Object3D();

    particles.forEach((particle, i) => {
      let [x, y, z] = particle.position;
      y += 0.015; // 上昇速度を少しゆっくりに
      if (y > 30) y = -5;
      particle.position[1] = y;

      const sway = Math.sin(time * 0.15 + particle.offset) * 0.4;
      
      dummy.position.set(x + sway, y, z + sway);
      dummy.updateMatrix();

      shadeRef.current.setMatrixAt(i, dummy.matrix);
      lightRef.current.setMatrixAt(i, dummy.matrix);
    });

    shadeRef.current.instanceMatrix.needsUpdate = true;
    lightRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={shadeRef} args={[shadeGeometry, shadeMaterial, COUNT]} />
      <instancedMesh ref={lightRef} args={[lightGeometry, lightMaterial, COUNT]} position={[0, -0.4, 0]} />
    </>
  );
}