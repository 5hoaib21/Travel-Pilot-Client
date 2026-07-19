'use client'

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = {
  Accommodation: '#0088FE',
  Food: '#00C49F',
  Activities: '#FFBB28',
  Transport: '#FF8042',
  Miscellaneous: '#A28DFF',
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload[0]) return null
  const entry = payload[0].payload
  return (
    <div className="bg-white dark:bg-slate-800 border border-warm-200 dark:border-slate-700 rounded-lg shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-[--text-heading] mb-0.5">{entry.category}</p>
      <p className="text-[--text-body]">${entry.amount.toLocaleString()}</p>
      <p className="text-[--text-secondary]">{entry.percentage}%</p>
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

export default function BudgetChart({ budgetBreakdown }) {
  if (!budgetBreakdown || budgetBreakdown.length === 0) return null

  const data = budgetBreakdown.map((item) => ({
    category: item.category,
    amount: item.amount,
    percentage: item.percentage,
  }))

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 shadow-sm p-5">
      <h3 className="text-base font-heading font-bold text-[--text-heading] mb-4">Budget Overview</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={90}
            paddingAngle={2}
            dataKey="amount"
            nameKey="category"
          >
            {data.map((entry) => (
              <Cell
                key={entry.category}
                fill={COLORS[entry.category] || '#8884d8'}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
