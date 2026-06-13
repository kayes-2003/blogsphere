import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const visible = pages.filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)

  let rendered = []
  let prev = null
  for (const p of visible) {
    if (prev && p - prev > 1) rendered.push('...')
    rendered.push(p)
    prev = p
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="btn-outline btn-sm !px-2 disabled:opacity-40"
        aria-label="Previous"
      >
        <ChevronLeft size={16} />
      </button>

      {rendered.map((item, i) =>
        item === '...'
          ? <span key={`ellipsis-${i}`} className="px-2 text-ink-400 text-sm">…</span>
          : (
            <button
              key={item}
              onClick={() => onChange(item)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                item === page
                  ? 'bg-ink-900 text-white'
                  : 'text-ink-600 hover:bg-ink-100'
              }`}
            >
              {item}
            </button>
          )
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="btn-outline btn-sm !px-2 disabled:opacity-40"
        aria-label="Next"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
