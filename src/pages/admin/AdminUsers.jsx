import { useState, useEffect, useCallback } from 'react'
import { Search, Shield, User, BookOpen, RefreshCw, Trash2 } from 'lucide-react'
import { adminService } from '@/services/adminService'
import { formatDate } from '@/utils/helpers'
import Avatar from '@/components/common/Avatar'
import Spinner from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import ConfirmModal from '@/components/common/ConfirmModal'
import Pagination from '@/components/common/Pagination'
import toast from 'react-hot-toast'

const ROLES = ['reader', 'author', 'admin']

export default function AdminUsers() {
  const [users,    setUsers]    = useState([])
  const [count,    setCount]    = useState(0)
  const [page,     setPage]     = useState(1)
  const [search,   setSearch]   = useState('')
  const [loading,  setLoading]  = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [delLoad,  setDelLoad]  = useState(false)

  const limit = 20

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    const { data, count: c } = await adminService.getAllUsers({ page, limit })
    setUsers(data || [])
    setCount(c || 0)
    setLoading(false)
  }, [page])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const filtered = search
    ? users.filter(u =>
        u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
      )
    : users

  const handleRoleChange = async (userId, role) => {
    const { error } = await adminService.updateUserRole(userId, role)
    if (error) toast.error('Failed to update role')
    else { toast.success(`Role updated to ${role}`); fetchUsers() }
  }

  const handleDelete = async () => {
    setDelLoad(true)
    const { error } = await adminService.deleteUser(deleting)
    setDelLoad(false)
    setDeleting(null)
    if (error) toast.error('Delete failed')
    else { toast.success('User removed'); fetchUsers() }
  }

  const roleIcon = (role) => {
    if (role === 'admin')  return <Shield size={12} className="text-red-500" />
    if (role === 'author') return <BookOpen size={12} className="text-brand-500" />
    return <User size={12} className="text-ink-400" />
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Users</h1>
          <p className="text-ink-500 text-sm mt-0.5">{count} registered members</p>
        </div>
        <button onClick={fetchUsers} className="btn-outline btn-sm"><RefreshCw size={13} /> Refresh</button>
      </div>

      {/* Search */}
      <div className="relative max-w-xs mb-5">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search users…"
          className="input pl-8 text-sm"
        />
      </div>

      {loading ? <Spinner /> : filtered.length === 0 ? (
        <EmptyState icon={<User size={28} />} title="No users found" />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ink-50 border-b border-ink-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wide">User</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wide hidden md:table-cell">Joined</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wide">Role</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {filtered.map(user => (
                <tr key={user.id} className="hover:bg-ink-50/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar profile={user} size={34} />
                      <div className="min-w-0">
                        <p className="font-medium text-ink-900 truncate">{user.full_name || '—'}</p>
                        <p className="text-xs text-ink-400 truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-ink-500 hidden md:table-cell whitespace-nowrap">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="relative inline-flex items-center gap-1.5">
                      {roleIcon(user.role)}
                      <select
                        value={user.role || 'reader'}
                        onChange={e => handleRoleChange(user.id, e.target.value)}
                        className="text-xs border border-ink-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-brand-400 cursor-pointer"
                      >
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => setDeleting(user.id)}
                      className="p-1.5 rounded-lg text-ink-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Remove user"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} totalPages={Math.ceil(count / limit)} onChange={p => { setPage(p) }} />

      <ConfirmModal
        isOpen={!!deleting}
        title="Remove User"
        message="This will permanently remove the user profile. Their posts will remain but be unlinked."
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        loading={delLoad}
      />
    </div>
  )
}
