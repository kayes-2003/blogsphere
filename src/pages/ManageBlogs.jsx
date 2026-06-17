import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PenLine, Pencil, Trash2, Eye, BookOpen, Plus, Search } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useMyPosts } from '@/hooks/useBlogs'
import { blogService } from '@/services/blogService'
import { formatDate } from '@/utils/helpers'
import Spinner from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import ConfirmModal from '@/components/common/ConfirmModal'
import Pagination from '@/components/common/Pagination'
import toast from 'react-hot-toast'

export default function ManageBlogs() {
  const { user } = useAuth()
  const [page,     setPage]     = useState(1)
  const [search,   setSearch]   = useState('')
  const [filter,   setFilter]   = useState('all')
  const [deleting, setDeleting] = useState(null)
  const [delLoad,  setDelLoad]  = useState(false)

  const { posts, count, loading, refetch } = useMyPosts(user?.id, { page, limit: 12 })

  const filtered = posts.filter(p => {
    const matchStatus = filter === 'all' || p.status === filter
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const handleDelete = async () => {
    setDelLoad(true)
    const { error } = await blogService.deletePost(deleting)
    setDelLoad(false)
    setDeleting(null)
    if (error) toast.error('Failed to delete post')
    else { toast.success('Post deleted'); refetch() }
  }

  const tabs = [
    { key: 'all',       label: 'All',       count: posts.length },
    { key: 'published', label: 'Published', count: posts.filter(p => p.status === 'published').length },
    { key: 'draft',     label: 'Drafts',    count: posts.filter(p => p.status === 'draft').length },
  ]

  return (
    <div className="section page-py max-w-5xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink-900">My Posts</h1>
          <p className="text-ink-500 text-sm mt-1">{count} total posts</p>
        </div>
        <Link to="/blogs/add" className="btn-brand self-start sm:self-auto">
          <Plus size={15} /> New Post
        </Link>
      </div>

      {/* Filters + search */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
        <div className="flex gap-1 p-1 bg-ink-50 rounded-lg self-start overflow-x-auto max-w-full">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                filter === t.key ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-700'
              }`}
            >
              {t.label}
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                filter === t.key ? 'bg-brand-100 text-brand-700' : 'bg-ink-200 text-ink-500'
              }`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search posts…"
            className="input pl-8 text-sm w-full"
          />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<BookOpen size={28} />}
          title="No posts found"
          description="Start writing to see your posts here."
          action={<Link to="/blogs/add" className="btn-brand btn-sm"><PenLine size={14} /> Write your first post</Link>}
        />
      ) : (
        <>
          {/* ── Mobile: stacked cards ── */}
          <div className="sm:hidden space-y-3">
            {filtered.map(post => (
              <div key={post.id} className="card p-4">
                <div className="flex items-start gap-3">
                  {post.cover_image ? (
                    <img src={post.cover_image} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-ink-100 flex items-center justify-center flex-shrink-0">
                      <BookOpen size={18} className="text-ink-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-ink-900 text-sm leading-snug mb-1">{post.title}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`badge text-[10px] ${post.status === 'published' ? 'badge-green' : 'badge-yellow'}`}>
                        {post.status}
                      </span>
                      <span className="text-xs text-ink-400">{formatDate(post.published_at || post.created_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-ink-50">
                  {post.status === 'published' && (
                    <Link to={`/blogs/${post.slug}`} className="p-2 rounded-lg text-ink-400 hover:text-brand-600 hover:bg-brand-50">
                      <Eye size={15} />
                    </Link>
                  )}
                  <Link to={`/blogs/${post.id}/edit`} className="p-2 rounded-lg text-ink-400 hover:text-ink-700 hover:bg-ink-100">
                    <Pencil size={15} />
                  </Link>
                  <button onClick={() => setDeleting(post.id)} className="p-2 rounded-lg text-ink-400 hover:text-red-600 hover:bg-red-50">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ── Desktop: table ── */}
          <div className="hidden sm:block card overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-ink-50 border-b border-ink-100">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wide">Title</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wide hidden md:table-cell">Status</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wide hidden md:table-cell">Date</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wide hidden lg:table-cell">Views</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {filtered.map(post => (
                  <tr key={post.id} className="hover:bg-ink-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {post.cover_image ? (
                          <img src={post.cover_image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-ink-100 flex items-center justify-center flex-shrink-0">
                            <BookOpen size={14} className="text-ink-400" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-ink-900 truncate max-w-[180px] lg:max-w-[260px]">{post.title}</p>
                          {post.read_time && <p className="text-xs text-ink-400 mt-0.5">{post.read_time} min read</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 hidden md:table-cell">
                      <span className={`badge ${post.status === 'published' ? 'badge-green' : 'badge-yellow'}`}>{post.status}</span>
                    </td>
                    <td className="px-3 py-4 text-ink-500 hidden md:table-cell whitespace-nowrap">
                      {formatDate(post.published_at || post.created_at)}
                    </td>
                    <td className="px-3 py-4 text-ink-500 hidden lg:table-cell">{post.views ?? 0}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 justify-end">
                        {post.status === 'published' && (
                          <Link to={`/blogs/${post.slug}`} className="p-1.5 rounded-lg text-ink-400 hover:text-brand-600 hover:bg-brand-50 transition-colors">
                            <Eye size={15} />
                          </Link>
                        )}
                        <Link to={`/blogs/${post.id}/edit`} className="p-1.5 rounded-lg text-ink-400 hover:text-ink-700 hover:bg-ink-100 transition-colors">
                          <Pencil size={15} />
                        </Link>
                        <button onClick={() => setDeleting(post.id)} className="p-1.5 rounded-lg text-ink-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <Pagination page={page} totalPages={Math.ceil(count / 12)} onChange={setPage} />

      <ConfirmModal
        isOpen={!!deleting}
        title="Delete Post"
        message="This will permanently delete the post and all its comments. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        loading={delLoad}
      />
    </div>
  )
}