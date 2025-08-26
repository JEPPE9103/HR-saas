"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";

function SphereMesh(){
  const ref = useRef<any>(null);
  useFrame((_, t)=>{
    if(!ref.current) return;
    ref.current.rotation.y = t * 0.15;
    ref.current.rotation.x = Math.sin(t * 0.15) * 0.1;
  });
  return (
    <group ref={ref}>
      <mesh>
        <icosahedronGeometry args={[1.2, 2]} />
        <meshStandardMaterial color="#2563EB" metalness={0.6} roughness={0.2} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.25, 2]} />
        <meshBasicMaterial color="#14B8A6" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

export default function Hero3D(){
  return (
    <div className="relative h-72 w-full overflow-hidden rounded-2xl ring-1 ring-white/10 md:h-96">
      <Canvas camera={{ position:[0,0,3] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2,2,2]} intensity={0.8} />
        <SphereMesh />
      </Canvas>
      <span className="sr-only">Animated AI sphere</span>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.15),transparent_60%)]" />
    </div>
  );
}


