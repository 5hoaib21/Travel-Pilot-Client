'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function MonthlyTripsChart({ data }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 shadow-sm p-5">
      <h3 className="text-base font-heading font-bold text-[--text-heading] mb-4">Monthly Trips</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--text-secondary)" />
          <YAxis tick={{ fontSize: 11 }} stroke="var(--text-secondary)" allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 12 }}
          />
          <Line type="monotone" dataKey="trips" stroke="#F97316" strokeWidth={2} dot={{ fill: '#F97316', r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
