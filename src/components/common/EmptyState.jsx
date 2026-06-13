export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-ink-50 flex items-center justify-center mb-4 text-ink-300">
          {icon}
        </div>
      )}
      <h3 className="font-display text-xl font-semibold text-ink-800 mb-2">{title}</h3>
      {description && <p className="text-sm text-ink-400 max-w-xs mb-6">{description}</p>}
      {action}
    </div>
  )
}
