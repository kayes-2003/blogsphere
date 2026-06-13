import { NavLink, Outlet, Link } from 'react-router-dom'
import { LayoutDashboard, FileText, Users, MessageSquare, PenLine, ArrowLeft, LogOut } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { authService } from '@/services/authService'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Avatar from '@/components/common/Avatar'

const navItems = [
  { to: '/admin',          label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/posts',    label: 'Posts',     icon: FileText },
  { to: '/admin/users',    label: 'Users',     icon: Users },
  { to: '/admin/comments', label: 'Comments',  icon: MessageSquare },
]

export default function AdminLayout() {
  const { profile } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await authService.signOut()
    toast.success('Signed out')
    navigate('/')
  }

  return (
    <div className="min-h-screen flex bg-ink-50">
      {/* ── Sidebar ── */}
      <aside className="w-60 bg-ink-900 flex flex-col flex-shrink-0 fixed inset-y-0 left-0 z-30">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-ink-800">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <PenLine size={15} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg text-white">BlogSphere</span>
          </Link>
          <p className="text-xs text-ink-500 mt-1 ml-10">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-ink-400 hover:bg-ink-800 hover:text-ink-100'
                }`
              }
            >
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-ink-800 space-y-3">
          <div className="flex items-center gap-2.5">
            <Avatar profile={profile} size={34} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{profile?.full_name || 'Admin'}</p>
              <p className="text-xs text-ink-500">Administrator</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/" className="flex items-center gap-1 text-xs text-ink-500 hover:text-ink-300 transition-colors">
              <ArrowLeft size={12} /> Site
            </Link>
            <span className="text-ink-700">·</span>
            <button onClick={handleSignOut} className="flex items-center gap-1 text-xs text-ink-500 hover:text-red-400 transition-colors">
              <LogOut size={12} /> Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
