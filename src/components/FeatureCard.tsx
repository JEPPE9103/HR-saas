"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function FeatureCard({
  icon, title, children,
}:{ icon: ReactNode; title: string; children: ReactNode; }){
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-lg"
    >
      <div className="mb-2 flex items-center gap-2 text-slate-200">
        {icon}<h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-sm text-slate-400">{children}</p>
    </motion.div>
  );
}


