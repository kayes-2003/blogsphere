import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, PenLine, UserPlus } from 'lucide-react'
import { authService } from '@/services/authService'
import toast from 'react-hot-toast'

export default function Register() {
  const navigate  = useNavigate()
  const [form,    setForm]    = useState({ fullName: '', email: '', password: '', confirm: '' })
  const [show,    setShow]    = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.fullName.trim()) { toast.error('Name is required'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }

    setLoading(true)
    const { error } = await authService.signUp(form.email, form.password, form.fullName.trim())
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Account created! Check your email to confirm.')
      navigate('/login')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-ink-900 rounded-xl flex items-center justify-center">
              <PenLine size={18} className="text-white" />
            </div>
          </Link>
          <h1 className="font-display text-3xl font-bold text-ink-900">Create your account</h1>
          <p className="text-ink-500 mt-1 text-sm">Join BlogSphere — free forever</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-group">
              <label className="label">Full name</label>
              <input
                type="text"
                value={form.fullName}
                onChange={set('fullName')}
                placeholder="Jane Smith"
                className="input"
                autoComplete="name"
                required
              />
            </div>

            <div className="form-group">
              <label className="label">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="you@example.com"
                className="input"
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Min. 6 characters"
                  className="input pr-10"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="label">Confirm password</label>
              <input
                type={show ? 'text' : 'password'}
                value={form.confirm}
                onChange={set('confirm')}
                placeholder="••••••••"
                className="input"
                autoComplete="new-password"
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full justify-center py-2.5" disabled={loading}>
              <UserPlus size={16} /> {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-xs text-ink-400 mt-4">
            By signing up you agree to our{' '}
            <a href="#" className="underline hover:text-ink-700">Terms</a> and{' '}
            <a href="#" className="underline hover:text-ink-700">Privacy Policy</a>.
          </p>

          <p className="text-center text-sm text-ink-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
