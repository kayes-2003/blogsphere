import { useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import { LayoutDashboard, FileText, Users, MessageSquare, PenLine, ArrowLeft, LogOut, UserCog, Menu, X } from 'lucide-react'
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
  { to: '/admin/team',     label: 'Team',      icon: UserCog },
]

export default function AdminLayout() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    await authService.signOut()
    toast.success('Signed out')
    navigate('/')
  }

  return (
    <div className="min-h-screen flex bg-ink-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-ink-900/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          w-64 bg-ink-900 flex flex-col flex-shrink-0 fixed inset-y-0 left-0 z-50
          transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="px-5 py-5 border-b border-ink-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5" onClick={() => setSidebarOpen(false)}>
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <PenLine size={15} className="text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-lg text-white block leading-tight">BlogSphere</span>
              <span className="text-xs text-ink-500">Admin Panel</span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-ink-400 hover:text-white p-1">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to} to={to} end={end}
              onClick={() => setSidebarOpen(false)}
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

        <div className="px-4 py-4 border-t border-ink-800 space-y-3">
          <div className="flex items-center gap-2.5">
            <Avatar profile={profile} size={34} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{profile?.full_name || 'Admin'}</p>
              <p className="text-xs text-ink-500">Administrator</p>
            </div>
          </div>
          <div className="flex gap-3">
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

      {/* ── Main ── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen w-full min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-ink-100 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-ink-700 hover:bg-ink-50 rounded-lg">
            <Menu size={20} />
          </button>
          <span className="font-display font-bold text-ink-900">Admin Panel</span>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}