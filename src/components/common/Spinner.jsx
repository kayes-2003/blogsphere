export default function Spinner({ size = 'md', fullPage = false }) {
  const sizes = { sm: 'w-5 h-5 border-2', md: 'w-9 h-9 border-4', lg: 'w-14 h-14 border-4' }
  const sizes1 = { sm: 'w-3 h-3 border-2', md: 'w-7 h-7 border-4', lg: 'w-12 h-12 border-4' }

  const el = (
    <div className={`${sizes[size]} border-brand-100 border-t-brand-800 bg-green-100 rounded-full animate-spin`} />
      
  )

  if (fullPage) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        {el}
        <p className="text-ink-400 text-sm font-body">Loading…</p>
      </div>
    )
  }

  return <div className="flex justify-center py-10">{el}</div>
}
