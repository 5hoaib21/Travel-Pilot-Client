'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function DurationDistributionChart({ data }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 shadow-sm p-5">
      <h3 className="text-base font-heading font-bold text-[--text-heading] mb-4">Trip Duration</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
          <XAxis dataKey="range" tick={{ fontSize: 11 }} stroke="var(--text-secondary)" />
          <YAxis tick={{ fontSize: 11 }} stroke="var(--text-secondary)" allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 12 }}
          />
          <Bar dataKey="count" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
