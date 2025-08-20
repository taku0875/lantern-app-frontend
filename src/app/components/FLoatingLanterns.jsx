'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function Lantern({ color, isStatic }) {
  const ref = useRef();
  const hasReachedTarget = useRef(isStatic);

  const { initialPosition, targetY } = useMemo(() => ({
    initialPosition: isStatic 
      ? [(Math.random() - 0.5) * 20, 1 + Math.random() * 5, (Math.random() - 0.5) * 20] 
      : [0, -10, 0],
    targetY: 1 + Math.random() * 3,
  }), [isStatic]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const time = state.clock.getElapsedTime();
    ref.current.position.x = initialPosition[0] + Math.sin(time * 0.3 + initialPosition[0]) * 1.5;
    ref.current.position.z = initialPosition[2] + Math.cos(time * 0.2 + initialPosition[2]) * 1.5;

    if (!hasReachedTarget.current) {
      ref.current.position.y += 0.03;
      if (ref.current.position.y >= targetY) hasReachedTarget.current = true;
    } else {
      ref.current.position.y = targetY + Math.sin(time * 0.7 + initialPosition[0]) * 0.08;
    }
  });

  return (
    <group position={initialPosition} ref={ref}>
      <mesh>
        <cylinderGeometry args={[0.3, 0.35, 0.6, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
}

export function FloatingLanterns({ lanterns }) {
  return (
    <>
      {lanterns && lanterns.map((lanternData) => (
        <Lantern key={lanternData.id} {...lanternData} />
      ))}
    </>
  );
}