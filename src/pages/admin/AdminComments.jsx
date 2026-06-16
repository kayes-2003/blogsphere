import { useState, useEffect, useCallback } from 'react'
import { CheckCircle, Trash2, Search, MessageSquare, RefreshCw, Clock } from 'lucide-react'
import { adminService } from '@/services/adminService'
import { timeAgo } from '@/utils/helpers'
import Avatar from '@/components/common/Avatar'
import Spinner from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import ConfirmModal from '@/components/common/ConfirmModal'
import Pagination from '@/components/common/Pagination'
import toast from 'react-hot-toast'

export default function AdminComments() {
  const [comments,  setComments]  = useState([])
  const [count,     setCount]     = useState(0)
  const [page,      setPage]      = useState(1)
  const [search,    setSearch]    = useState('')
  const [filter,    setFilter]    = useState('all')  // 'all' | 'pending' | 'approved'
  const [loading,   setLoading]   = useState(true)
  const [deleting,  setDeleting]  = useState(null)
  const [delLoad,   setDelLoad]   = useState(false)

  const limit = 20

  const fetchComments = useCallback(async () => {
    setLoading(true)
    const { data, count: c } = await adminService.getAllComments({ page, limit })
    setComments(data || [])
    setCount(c || 0)
    setLoading(false)
  }, [page])

  useEffect(() => { fetchComments() }, [fetchComments])

  const filtered = comments.filter(c => {
    const matchFilter =
      filter === 'all'      ? true :
      filter === 'pending'  ? !c.approved :
      filter === 'approved' ? c.approved : true
    const matchSearch = search
      ? c.content?.toLowerCase().includes(search.toLowerCase()) ||
        c.author?.full_name?.toLowerCase().includes(search.toLowerCase())
      : true
    return matchFilter && matchSearch
  })

  const handleApprove = async (id) => {
    const { error } = await adminService.approveComment(id)
    if (error) toast.error('Failed to approve')
    else { toast.success('Comment approved'); fetchComments() }
  }

  const handleDelete = async () => {
    setDelLoad(true)
    const { error } = await adminService.deleteComment(deleting)
    setDelLoad(false)
    setDeleting(null)
    if (error) toast.error('Delete failed')
    else { toast.success('Comment deleted'); fetchComments() }
  }

  const pendingCount  = comments.filter(c => !c.approved).length
  const approvedCount = comments.filter(c =>  c.approved).length

  const tabs = [
    { key: 'all',      label: 'All',      count: comments.length },
    { key: 'pending',  label: 'Pending',  count: pendingCount },
    { key: 'approved', label: 'Approved', count: approvedCount },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Comments</h1>
          <p className="text-ink-500 text-sm mt-0.5">
            {pendingCount > 0 && <span className="text-yellow-600 font-medium">{pendingCount} pending approval · </span>}
            {count} total
          </p>
        </div>
        <button onClick={fetchComments} className="btn-outline btn-sm"><RefreshCw size={13} /> Refresh</button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-5">
        <div className="flex gap-1 p-1 bg-ink-50 rounded-lg self-start">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                filter === t.key ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-700'
              }`}
            >
              {t.label}
              {t.key === 'pending' && t.count > 0 && (
                <span className="ml-1.5 w-4 h-4 inline-flex items-center justify-center bg-yellow-400 text-white text-[10px] rounded-full font-bold">
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search comments…"
            className="input pl-8 text-sm"
          />
        </div>
      </div>

      {/* List */}
      {loading ? <Spinner /> : filtered.length === 0 ? (
        <EmptyState
          icon={<MessageSquare size={28} />}
          title="No comments found"
          description={filter === 'pending' ? 'All caught up! No comments awaiting review.' : 'No comments yet.'}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map(comment => (
            <div key={comment.id} className={`card p-5 ${!comment.approved ? 'border-yellow-200 bg-yellow-50/30' : ''}`}>
              <div className="flex items-start gap-3">
                <Avatar profile={comment.author} size={36} />
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-ink-800">{comment.author?.full_name || 'Unknown'}</span>
                    <span className="text-xs text-ink-400 flex items-center gap-1">
                      <Clock size={10} /> {timeAgo(comment.created_at)}
                    </span>
                    {comment.approved
                      ? <span className="badge badge-green">approved</span>
                      : <span className="badge badge-yellow">pending</span>
                    }
                    {comment.post && (
                      <span className="text-xs text-ink-400">
                        on <a href={`/blogs/${comment.post.slug}`} className="text-brand-600 hover:underline" target="_blank" rel="noreferrer">
                          {comment.post.title}
                        </a>
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <p className="text-sm text-ink-700 leading-relaxed">{comment.content}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-1 flex-shrink-0">
                  {!comment.approved && (
                    <button
                      onClick={() => handleApprove(comment.id)}
                      className="p-1.5 rounded-lg text-ink-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                      title="Approve"
                    >
                      <CheckCircle size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => setDeleting(comment.id)}
                    className="p-1.5 rounded-lg text-ink-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={Math.ceil(count / limit)} onChange={setPage} />

      <ConfirmModal
        isOpen={!!deleting}
        title="Delete Comment"
        message="This will permanently delete the comment."
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        loading={delLoad}
      />
    </div>
  )
}
