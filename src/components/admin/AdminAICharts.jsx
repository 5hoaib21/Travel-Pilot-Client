'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#22c55e', '#ef4444']

export function RequestsOverTime({ data }) {
  if (!data?.length) return <p className="text-sm text-[--text-secondary]">No data</p>
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <XAxis dataKey="_id" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip />
        <Line type="monotone" dataKey="total" stroke="#f97316" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function SuccessRatePie({ data }) {
  if (!data) return <p className="text-sm text-[--text-secondary]">No data</p>
  const chartData = [
    { name: 'Success', value: data.success },
    { name: 'Failed', value: data.failed },
  ]
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={chartData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
          {chartData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function AvgResponseTimeChart({ data }) {
  if (!data?.length) return <p className="text-sm text-[--text-secondary]">No data</p>
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} layout="vertical">
        <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis type="category" dataKey="_id" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={100} />
        <Tooltip formatter={(value) => `${Math.round(value)}ms`} />
        <Bar dataKey="avgMs" fill="#f97316" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function TopUsersChart({ data }) {
  if (!data?.length) return <p className="text-sm text-[--text-secondary]">No data</p>
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} layout="vertical">
        <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={120} />
        <Tooltip formatter={(value) => `${value} requests`} />
        <Bar dataKey="count" fill="#60a5fa" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
