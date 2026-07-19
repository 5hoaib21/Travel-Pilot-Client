'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  function getPages() {
    const pages = []
    const delta = 2
    const left = Math.max(2, page - delta)
    const right = Math.min(totalPages - 1, page + delta)

    pages.push(1)
    if (left > 2) pages.push('...')
    for (let i = left; i <= right; i++) pages.push(i)
    if (right < totalPages - 1) pages.push('...')
    if (totalPages > 1) pages.push(totalPages)

    return pages
  }

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="min-w-[44px] min-h-[44px] md:w-9 md:h-9 rounded-lg flex items-center justify-center text-[--text-secondary] hover:bg-[--bg-card-hover] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
      </button>

      {getPages().map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="min-w-[44px] min-h-[44px] md:w-9 md:h-9 flex items-center justify-center text-xs text-[--text-secondary]">
            &hellip;
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`min-w-[44px] min-h-[44px] md:w-9 md:h-9 rounded-lg text-sm font-medium transition-colors ${
              p === page
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-[--text-body] hover:bg-[--bg-card-hover]'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="min-w-[44px] min-h-[44px] md:w-9 md:h-9 rounded-lg flex items-center justify-center text-[--text-secondary] hover:bg-[--bg-card-hover] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
      </button>
    </nav>
  )
}
