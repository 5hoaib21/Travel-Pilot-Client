'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#F97316', '#0EA5E9', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF']

export default function AIUsageChart({ data }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 shadow-sm p-5">
      <h3 className="text-base font-heading font-bold text-[--text-heading] mb-4">AI Usage</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
          <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--text-secondary)" allowDecimals={false} />
          <YAxis type="category" dataKey="feature" tick={{ fontSize: 11 }} stroke="var(--text-secondary)" width={100} />
          <Tooltip
            contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 12 }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
