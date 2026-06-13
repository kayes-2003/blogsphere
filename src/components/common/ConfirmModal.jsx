import { AlertTriangle, X } from 'lucide-react'

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, danger = true, loading = false }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative card w-full max-w-sm p-6 shadow-2xl fade-up">
        <button onClick={onCancel} className="absolute top-4 right-4 text-ink-400 hover:text-ink-700">
          <X size={18} />
        </button>

        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${danger ? 'bg-red-50' : 'bg-brand-50'}`}>
          <AlertTriangle size={22} className={danger ? 'text-red-500' : 'text-brand-500'} />
        </div>

        <h3 className="font-display text-lg font-bold text-ink-900 mb-2">{title}</h3>
        <p className="text-sm text-ink-500 mb-6">{message}</p>

        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-outline flex-1" disabled={loading}>Cancel</button>
          <button
            onClick={onConfirm}
            className={`flex-1 btn ${danger ? 'btn-danger' : 'btn-brand'}`}
            disabled={loading}
          >
            {loading ? 'Processing…' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}
