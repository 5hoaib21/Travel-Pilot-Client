'use client'

import { DollarSign } from 'lucide-react'

const categoryColors = {
  Accommodation: 'bg-sky-100 dark:bg-sky-900',
  Food: 'bg-amber-100 dark:bg-amber-900',
  Activities: 'bg-orange-100 dark:bg-orange-900',
  Transport: 'bg-purple-100 dark:bg-purple-900',
  Miscellaneous: 'bg-red-100 dark:bg-red-900',
}

const categoryDotColors = {
  Accommodation: 'bg-sky-500',
  Food: 'bg-amber-500',
  Activities: 'bg-orange-500',
  Transport: 'bg-purple-500',
  Miscellaneous: 'bg-red-500',
}

export default function BudgetTable({ budgetBreakdown }) {
  if (!budgetBreakdown || budgetBreakdown.length === 0) return null

  const total = budgetBreakdown.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-warm-200 dark:border-slate-700 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-5 h-5 text-orange-500" strokeWidth={1.5} />
        <h3 className="text-base font-heading font-bold text-[--text-heading]">Budget Breakdown</h3>
      </div>

      <div className="space-y-3">
        {budgetBreakdown.map((item) => (
          <div key={item.category}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${categoryDotColors[item.category] || 'bg-warm-400'}`} />
                <span className="text-sm font-medium text-[--text-heading]">{item.category}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-[--text-heading]">${item.amount}</span>
                <span className="text-xs text-[--text-secondary] ml-1">({item.percentage}%)</span>
              </div>
            </div>
            <div className="w-full h-2 rounded-full bg-warm-100 dark:bg-slate-700 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${categoryColors[item.category] || 'bg-warm-400'}`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
            {item.items && item.items.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {item.items.map((line, i) => (
                  <span key={i} className="text-[10px] text-[--text-secondary] bg-warm-50 dark:bg-slate-700/50 px-1.5 py-0.5 rounded">
                    {line}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-warm-100 dark:border-slate-700 flex items-center justify-between">
        <span className="text-sm font-semibold text-[--text-heading]">Total</span>
        <span className="text-base font-heading font-bold text-[--text-heading]">${total}</span>
      </div>
    </div>
  )
}
