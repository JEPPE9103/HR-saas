"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";

type Node = { r: number; speed: number; phase: number; color: string; label: "Gap"|"Outlier"|"Compliance" };

function OrbitingNode({ n }: { n: Node }){
  const ref = useRef<any>(null);
  useFrame((_, t) => {
    if (!ref.current) return;
    const a = t * n.speed + n.phase;
    ref.current.position.x = Math.cos(a) * n.r;
    ref.current.position.y = Math.sin(a) * n.r * 0.6;
    ref.current.position.z = Math.sin(a) * 0.2;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.045, 16, 16]} />
      <meshBasicMaterial color={n.color} />
    </mesh>
  );
}

function Radar(){
  const ref = useRef<any>(null);
  useFrame((_, t) => { if (ref.current) ref.current.rotation.z = t * 0.6; });
  return (
    <mesh ref={ref} rotation={[0,0,0]}>
      <ringGeometry args={[1.0, 1.02, 64]} />
      <meshBasicMaterial color="#2563EB" transparent opacity={0.2} />
    </mesh>
  );
}

function Core(){
  const ref = useRef<any>(null);
  useFrame((_, t) => {
    if (!ref.current) return;
    ref.current.rotation.y = t * 0.25;
    ref.current.rotation.x = Math.sin(t * 0.25) * 0.1;
  });
  return (
    <group ref={ref}>
      <mesh>
        <icosahedronGeometry args={[0.9, 2]} />
        <meshStandardMaterial color="#1F3AA6" metalness={0.5} roughness={0.25} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.98, 2]} />
        <meshBasicMaterial color="#14B8A6" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

export default function AISphere(){
  const nodes: Node[] = useMemo(() => {
    const arr: Node[] = [];
    const colors = { Gap: "#2563EB", Outlier: "#F59E0B", Compliance: "#10B981" } as const;
    const labels: Node["label"][] = ["Gap", "Outlier", "Compliance"];
    for (let i = 0; i < 18; i++){
      const label = labels[i % labels.length];
      arr.push({ r: 1.15 + ((i % 3) * 0.08), speed: 0.3 + (i % 5) * 0.05, phase: i * 0.6, color: colors[label], label });
    }
    return arr;
  }, []);

  const [msgIndex, setMsgIndex] = useState(0);
  const messages = ["Analyzing pay gaps…", "Detecting outliers…", "Checking compliance guardrails…", "Generating report preview…"];
  useEffect(() => { const t = setInterval(() => setMsgIndex(i => (i + 1) % messages.length), 1800); return () => clearInterval(t); }, []);

  return (
    <div className="relative h-72 w-full overflow-hidden rounded-2xl ring-1 ring-white/10 md:h-96">
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2,2,2]} intensity={0.8} />
        <Core />
        <Radar />
        {nodes.map((n, i) => <OrbitingNode key={i} n={n} />)}
      </Canvas>
      <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#2563EB]" /> Gaps</span>
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#F59E0B]" /> Outliers</span>
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#10B981]" /> Compliance</span>
        </div>
        <div className="rounded-md bg-white/10 px-2 py-1 backdrop-blur">
          {messages[msgIndex]}
        </div>
      </div>
      <span className="sr-only">Animated AI sphere with orbiting data points representing gaps (indigo), outliers (amber), and compliance checks (teal).</span>
    </div>
  );
}


