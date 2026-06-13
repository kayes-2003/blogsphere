import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="font-display text-[120px] font-bold text-ink-100 leading-none select-none">404</p>
        <h1 className="font-display text-3xl font-bold text-ink-900 -mt-4 mb-3">Page not found</h1>
        <p className="text-ink-500 mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/"     className="btn-primary"><ArrowLeft size={15} /> Go home</Link>
          <Link to="/blogs" className="btn-outline">Browse posts</Link>
        </div>
      </div>
    </div>
  )
}
