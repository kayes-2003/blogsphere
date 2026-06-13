import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Pencil, Eye, CheckCircle, XCircle, Search, RefreshCw } from 'lucide-react'
import { adminService } from '@/services/adminService'
import { formatDate } from '@/utils/helpers'
import Spinner from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import ConfirmModal from '@/components/common/ConfirmModal'
import Pagination from '@/components/common/Pagination'
import toast from 'react-hot-toast'

export default function AdminPosts() {
  const [posts,    setPosts]    = useState([])
  const [count,    setCount]    = useState(0)
  const [page,     setPage]     = useState(1)
  const [search,   setSearch]   = useState('')
  const [loading,  setLoading]  = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [delLoad,  setDelLoad]  = useState(false)

  const limit = 20

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    const { data, count: c } = await adminService.getAllPosts({ page, limit })
    setPosts(data || [])
    setCount(c || 0)
    setLoading(false)
  }, [page])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  const filtered = search
    ? posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
    : posts

  const handleToggleStatus = async (post) => {
    const next = post.status === 'published' ? 'draft' : 'published'
    const { error } = await adminService.updatePostStatus(post.id, next)
    if (error) toast.error('Failed to update status')
    else { toast.success(`Post ${next}`); fetchPosts() }
  }

  const handleDelete = async () => {
    setDelLoad(true)
    const { error } = await adminService.deletePost(deleting)
    setDelLoad(false)
    setDeleting(null)
    if (error) toast.error('Delete failed')
    else { toast.success('Post deleted'); fetchPosts() }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">All Posts</h1>
          <p className="text-ink-500 text-sm mt-0.5">{count} total posts</p>
        </div>
        <button onClick={fetchPosts} className="btn-outline btn-sm"><RefreshCw size={13} /> Refresh</button>
      </div>

      {/* Search */}
      <div className="relative max-w-xs mb-5">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Filter by title…"
          className="input pl-8 text-sm"
        />
      </div>

      {loading ? <Spinner /> : filtered.length === 0 ? (
        <EmptyState icon={null} title="No posts found" />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ink-50 border-b border-ink-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wide">Title</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wide hidden sm:table-cell">Author</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wide hidden md:table-cell">Status</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wide hidden lg:table-cell">Date</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wide hidden lg:table-cell">Views</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {filtered.map(post => (
                <tr key={post.id} className="hover:bg-ink-50/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-ink-900 truncate max-w-[220px]">{post.title}</p>
                    <p className="text-xs text-ink-400 mt-0.5 sm:hidden">{post.author?.full_name}</p>
                  </td>
                  <td className="px-3 py-3.5 text-ink-600 hidden sm:table-cell truncate max-w-[140px]">{post.author?.full_name}</td>
                  <td className="px-3 py-3.5 hidden md:table-cell">
                    <span className={`badge ${post.status === 'published' ? 'badge-green' : 'badge-yellow'}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 text-ink-500 hidden lg:table-cell whitespace-nowrap">
                    {formatDate(post.created_at)}
                  </td>
                  <td className="px-3 py-3.5 text-ink-500 hidden lg:table-cell">{post.views ?? 0}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 justify-end">
                      {post.status === 'published' && (
                        <Link to={`/blogs/${post.slug}`} target="_blank"
                          className="p-1.5 rounded-lg text-ink-400 hover:text-brand-600 hover:bg-brand-50 transition-colors" title="View">
                          <Eye size={14} />
                        </Link>
                      )}
                      <button onClick={() => handleToggleStatus(post)}
                        className="p-1.5 rounded-lg text-ink-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                        title={post.status === 'published' ? 'Unpublish' : 'Publish'}>
                        {post.status === 'published' ? <XCircle size={14} /> : <CheckCircle size={14} />}
                      </button>
                      <Link to={`/blogs/${post.id}/edit`}
                        className="p-1.5 rounded-lg text-ink-400 hover:text-ink-700 hover:bg-ink-100 transition-colors" title="Edit">
                        <Pencil size={14} />
                      </Link>
                      <button onClick={() => setDeleting(post.id)}
                        className="p-1.5 rounded-lg text-ink-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} totalPages={Math.ceil(count / limit)} onChange={p => { setPage(p); fetchPosts() }} />

      <ConfirmModal
        isOpen={!!deleting}
        title="Delete Post"
        message="This will permanently delete the post and all its comments."
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        loading={delLoad}
      />
    </div>
  )
}
