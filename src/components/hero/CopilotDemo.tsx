"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Detecting top gaps…",
  "Engineering gap 8.2% (High).",
  "Suggest +5% raise for IC2–IC4 → new gap 2.1%.",
  "Exporting Pay Transparency Brief… ✓",
];

export default function CopilotDemo(){
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  useEffect(()=>{
    let t1:any, t2:any;
    const msg = MESSAGES[i];
    let j = 0;
    t1 = setInterval(()=>{
      setText(msg.slice(0, j++));
      if(j > msg.length){
        clearInterval(t1);
        t2 = setTimeout(()=> setI(p => (p+1)%MESSAGES.length), 1400);
      }
    }, 18);
    return ()=>{ clearInterval(t1); clearTimeout(t2); };
  }, [i]);

  return (
    <div className="rounded-xl border px-3 py-2 text-sm shadow-lg backdrop-blur border-[var(--ring)] bg-[var(--panel)] text-[var(--text)]">
      <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-indigo-500" />
      {text}
    </div>
  );
}


