import { useState, useEffect } from 'react'
import { FileText, Users, MessageSquare, TrendingUp, Eye, Clock } from 'lucide-react'
import { adminService } from '@/services/adminService'
import Spinner from '@/components/common/Spinner'

export default function AdminDashboard() {
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminService.getStats().then(s => { setStats(s); setLoading(false) })
  }, [])

  if (loading) return <Spinner />

  const cards = [
    { label: 'Total Posts',      value: stats.totalPosts,      sub: `${stats.publishedPosts} published`,  icon: <FileText size={20} />,      color: 'text-blue-500',   bg: 'bg-blue-50' },
    { label: 'Draft Posts',      value: stats.draftPosts,      sub: 'Awaiting publish',                   icon: <Clock size={20} />,         color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { label: 'Total Users',      value: stats.totalUsers,      sub: 'Registered members',                 icon: <Users size={20} />,         color: 'text-green-500',  bg: 'bg-green-50' },
    { label: 'Comments',         value: stats.totalComments,   sub: `${stats.pendingComments} pending`,   icon: <MessageSquare size={20} />, color: 'text-purple-500', bg: 'bg-purple-50' },
  ]

  return (
    <div>
      {/* Page title */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-ink-900">Dashboard</h1>
        <p className="text-ink-500 text-sm mt-1">Overview of your BlogSphere platform</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {cards.map(({ label, value, sub, icon, color, bg }) => (
          <div key={label} className="card p-5">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center ${color}`}>
                {icon}
              </div>
            </div>
            <p className="font-display text-3xl font-bold text-ink-900">{value}</p>
            <p className="text-xs font-semibold text-ink-600 uppercase tracking-wide mt-1">{label}</p>
            <p className="text-xs text-ink-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="card p-6">
        <h2 className="font-display font-semibold text-ink-900 mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { label: 'Review pending comments', to: '/admin/comments', icon: <MessageSquare size={16} /> },
            { label: 'Manage all posts',        to: '/admin/posts',    icon: <FileText size={16} /> },
            { label: 'Manage users',            to: '/admin/users',    icon: <Users size={16} /> },
          ].map(({ label, to, icon }) => (
            <a key={to} href={to}
              className="flex items-center gap-2.5 p-3 rounded-xl border border-ink-100 hover:border-brand-300 hover:bg-brand-50 text-sm text-ink-700 font-medium transition-all">
              <span className="text-brand-500">{icon}</span>
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
