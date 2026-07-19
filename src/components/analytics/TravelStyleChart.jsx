'use client'

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = { Relaxed: '#00C49F', Balanced: '#FFBB28', Adventure: '#FF8042' }

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.[0]) return null
  const entry = payload[0].payload
  return (
    <div className="bg-white dark:bg-slate-800 border border-warm-200 dark:border-slate-700 rounded-lg shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-[--text-heading]">{entry.style}</p>
      <p className="text-[--text-body]">{entry.count} trips</p>
    </div>
  )
}

function CustomLegend({ payload }) {
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-3">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-xs text-[--text-body]">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function TravelStyleChart({ data }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 shadow-sm p-5">
      <h3 className="text-base font-heading font-bold text-[--text-heading] mb-4">Travel Style</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2} dataKey="count" nameKey="style">
            {data.map((entry) => (
              <Cell key={entry.style} fill={COLORS[entry.style] || '#8884d8'} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
