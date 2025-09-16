"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type Row = { role: string; male: number; female: number };

export function RoleCompare({ data }: { data: Row[] }) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="role" tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
          <YAxis tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
          <Tooltip formatter={(v: number) => `${Math.round(v).toLocaleString('sv-SE')} SEK`} />
          <Legend />
          <Bar dataKey="male" name="Male" fill="#60a5fa" radius={[6,6,0,0]} />
          <Bar dataKey="female" name="Female" fill="#f472b6" radius={[6,6,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}


