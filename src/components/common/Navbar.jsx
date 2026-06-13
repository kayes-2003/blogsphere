import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, PenLine, User, LayoutDashboard, Settings, LogOut, ChevronDown, BookOpen } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { authService } from '@/services/authService'
import toast from 'react-hot-toast'
import Avatar from './Avatar'

export default function Navbar() {
  const { user, profile, isAdmin, isAuthor } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropOpen,   setDropOpen]   = useState(false)
  const dropRef  = useRef(null)
  const navigate = useNavigate()

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSignOut = async () => {
    await authService.signOut()
    toast.success('See you next time!')
    setDropOpen(false)
    navigate('/')
  }

  const linkClass = ({ isActive }) =>
    `font-body font-medium text-sm transition-colors duration-150 ${
      isActive ? 'text-brand-600' : 'text-ink-600 hover:text-ink-900'
    }`

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-ink-100">
      <div className="section">
        <nav className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-ink-900 rounded-lg flex items-center justify-center group-hover:bg-brand-600 transition-colors">
              <PenLine size={15} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-ink-900">BlogSphere</span>
          </Link>

          {/* ── Desktop links ── */}
          <div className="hidden md:flex items-center gap-7">
            <NavLink to="/"      className={linkClass} end>Home</NavLink>
            <NavLink to="/blogs" className={linkClass}>Blog</NavLink>
            <NavLink to="/about" className={linkClass}>About</NavLink>
          </div>

          {/* ── Desktop actions ── */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {isAuthor && (
                  <Link to="/blogs/add" className="btn-brand btn-sm">
                    <PenLine size={14} /> Write
                  </Link>
                )}

                {/* User dropdown */}
                <div className="relative" ref={dropRef}>
                  <button
                    onClick={() => setDropOpen(!dropOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-ink-50 transition-colors"
                  >
                    <Avatar profile={profile} size={32} />
                    <span className="text-sm font-medium text-ink-700 max-w-[110px] truncate">
                      {profile?.full_name || user.email?.split('@')[0]}
                    </span>
                    <ChevronDown size={14} className={`text-ink-400 transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropOpen && (
                    <div className="absolute right-0 mt-2 w-52 card shadow-xl py-1.5 fade-up">
                      <DropItem to="/dashboard"    icon={<LayoutDashboard size={14} />} onClick={() => setDropOpen(false)}>Dashboard</DropItem>
                      <DropItem to="/manage-blogs" icon={<BookOpen size={14} />}        onClick={() => setDropOpen(false)}>My Blogs</DropItem>
                      <DropItem to="/profile"      icon={<User size={14} />}            onClick={() => setDropOpen(false)}>Profile</DropItem>
                      {isAdmin && (
                        <DropItem to="/admin" icon={<Settings size={14} />} onClick={() => setDropOpen(false)} className="text-brand-600">
                          Admin Panel
                        </DropItem>
                      )}
                      <div className="my-1 mx-2 border-t border-ink-100" />
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={14} /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login"    className="btn-ghost btn-sm">Sign in</Link>
                <Link to="/register" className="btn-primary btn-sm">Get started</Link>
              </>
            )}
          </div>

          {/* ── Mobile toggle ── */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-ink-50 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} className="text-ink-700" /> : <Menu size={22} className="text-ink-700" />}
          </button>
        </nav>

        {/* ── Mobile menu ── */}
        {mobileOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-ink-100 space-y-1 fade-up">
            <MobileLink to="/"      onClick={() => setMobileOpen(false)} end>Home</MobileLink>
            <MobileLink to="/blogs" onClick={() => setMobileOpen(false)}>Blog</MobileLink>
            <MobileLink to="/about" onClick={() => setMobileOpen(false)}>About</MobileLink>
            {user ? (
              <>
                <div className="my-2 border-t border-ink-100" />
                <MobileLink to="/dashboard"    onClick={() => setMobileOpen(false)}>Dashboard</MobileLink>
                <MobileLink to="/manage-blogs" onClick={() => setMobileOpen(false)}>My Blogs</MobileLink>
                <MobileLink to="/profile"      onClick={() => setMobileOpen(false)}>Profile</MobileLink>
                {isAuthor && <MobileLink to="/blogs/add" onClick={() => setMobileOpen(false)}>Write Post</MobileLink>}
                {isAdmin  && <MobileLink to="/admin"     onClick={() => setMobileOpen(false)}>Admin Panel</MobileLink>}
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2.5 text-sm text-red-500 font-medium rounded-lg hover:bg-red-50 transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <MobileLink to="/login"    onClick={() => setMobileOpen(false)}>Sign in</MobileLink>
                <MobileLink to="/register" onClick={() => setMobileOpen(false)}>Get started</MobileLink>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

function DropItem({ to, icon, children, onClick, className = '' }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-2.5 px-4 py-2 text-sm text-ink-700 hover:bg-ink-50 transition-colors ${className}`}
    >
      {icon} {children}
    </Link>
  )
}

function MobileLink({ to, children, onClick, end }) {
  return (
    <NavLink
      to={to} end={end} onClick={onClick}
      className={({ isActive }) =>
        `block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
          isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:bg-ink-50'
        }`
      }
    >
      {children}
    </NavLink>
  )
}
