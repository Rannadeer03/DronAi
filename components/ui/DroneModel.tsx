"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function DroneMesh({ scrollY }: { scrollY: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.3 + scrollY * 0.5;
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.08;
  });

  return (
    <group ref={groupRef}>
      {/* Main Body */}
      <mesh ref={bodyRef} castShadow>
        <boxGeometry args={[1.2, 0.2, 0.8]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.95}
          roughness={0.1}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Camera dome */}
      <mesh position={[0, -0.18, 0.2]}>
        <sphereGeometry args={[0.18, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#111"
          metalness={0.9}
          roughness={0.05}
          envMapIntensity={2}
        />
      </mesh>
      {/* Camera lens */}
      <mesh position={[0, -0.28, 0.2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.04, 32]} />
        <meshStandardMaterial color="#0a0a0a" metalness={1} roughness={0} />
      </mesh>

      {/* 4 Arms */}
      {[
        [0.7, 0, 0.5],
        [-0.7, 0, 0.5],
        [0.7, 0, -0.5],
        [-0.7, 0, -0.5],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          {/* Arm */}
          <mesh rotation={[0, i < 2 ? Math.PI / 4 : -Math.PI / 4, 0]}>
            <boxGeometry args={[0.6, 0.06, 0.06]} />
            <meshStandardMaterial color="#222" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Motor housing */}
          <mesh position={[0, 0.04, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.08, 32]} />
            <meshStandardMaterial color="#111" metalness={1} roughness={0.05} />
          </mesh>
          {/* Propeller */}
          <PropellerMesh index={i} />
          {/* LED glow */}
          <pointLight
            position={[0, 0.1, 0]}
            color={i < 2 ? "#22c55e" : "#ef4444"}
            intensity={0.5}
            distance={1}
          />
        </group>
      ))}

      {/* Sensor bar front */}
      <mesh position={[0, -0.08, 0.42]}>
        <boxGeometry args={[0.6, 0.08, 0.04]} />
        <meshStandardMaterial color="#0d1f0d" metalness={0.5} roughness={0.3} emissive="#22c55e" emissiveIntensity={0.3} />
      </mesh>

      {/* Landing legs */}
      {[
        [0.4, -0.2, 0.3],
        [-0.4, -0.2, 0.3],
        [0.4, -0.2, -0.3],
        [-0.4, -0.2, -0.3],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.02, 0.02, 0.25, 8]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function PropellerMesh({ index }: { index: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.4;
  });
  return (
    <group ref={ref} position={[0, 0.06, 0]}>
      {[0, Math.PI / 2].map((rot, i) => (
        <mesh key={i} rotation={[0, rot, 0]}>
          <boxGeometry args={[0.45, 0.01, 0.06]} />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function DroneModel({ scrollY = 0 }: { scrollY?: number }) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 1.5, 3.5], fov: 45 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={2}
            castShadow
            color="#ffffff"
          />
          <pointLight position={[-3, 2, -3]} intensity={1} color="#22c55e" />
          <pointLight position={[3, -1, 3]} intensity={0.5} color="#1d4ed8" />
          <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
            <DroneMesh scrollY={scrollY} />
          </Float>
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}
