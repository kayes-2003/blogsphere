import { Link } from 'react-router-dom'
import { PenLine, BookOpen, Eye, TrendingUp, ArrowRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useMyPosts } from '@/hooks/useBlogs'
import { formatDate } from '@/utils/helpers'
import Spinner from '@/components/common/Spinner'
import Avatar from '@/components/common/Avatar'

export default function Dashboard() {
  const { user, profile } = useAuth()
  const { posts, count, loading } = useMyPosts(user?.id)

  const published = posts.filter(p => p.status === 'published')
  const drafts    = posts.filter(p => p.status === 'draft')
  const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0)

  const stats = [
    { label: 'Total Posts',  value: count,          icon: <BookOpen size={20} /> },
    { label: 'Published',    value: published.length, icon: <TrendingUp size={20} /> },
    { label: 'Drafts',       value: drafts.length,    icon: <PenLine size={20} /> },
    { label: 'Total Views',  value: totalViews,       icon: <Eye size={20} /> },
  ]

  return (
    <div className="section page-py max-w-5xl mx-auto">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
        <Avatar profile={profile} size={56} />
        <div className="flex-1">
          <h1 className="font-display text-3xl font-bold text-ink-900">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'Writer'} 👋
          </h1>
          <p className="text-ink-500 mt-1 text-sm">{user?.email}</p>
        </div>
        <Link to="/blogs/add" className="btn-brand self-start sm:self-center">
          <PenLine size={15} /> New Post
        </Link>
      </div>

      {/* Stats */}
      {loading ? <Spinner /> : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {stats.map(({ label, value, icon }) => (
              <div key={label} className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-ink-500 uppercase tracking-wide">{label}</span>
                  <div className="text-brand-500">{icon}</div>
                </div>
                <p className="font-display text-3xl font-bold text-ink-900">{value}</p>
              </div>
            ))}
          </div>

          {/* Recent posts */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-ink-100">
              <h2 className="font-display font-semibold text-ink-900">Recent Posts</h2>
              <Link to="/manage-blogs" className="text-sm text-brand-600 hover:underline flex items-center gap-1">
                Manage all <ArrowRight size={13} />
              </Link>
            </div>

            {posts.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <PenLine size={32} className="mx-auto mb-3 text-ink-300" />
                <p className="text-ink-500 text-sm mb-4">You haven't written anything yet.</p>
                <Link to="/blogs/add" className="btn-brand btn-sm">Write your first post</Link>
              </div>
            ) : (
              <div className="divide-y divide-ink-50">
                {posts.slice(0, 8).map(post => (
                  <div key={post.id} className="flex items-center gap-4 px-6 py-4 hover:bg-ink-50 transition-colors">
                    {post.cover_image && (
                      <img src={post.cover_image} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink-900 truncate">{post.title}</p>
                      <p className="text-xs text-ink-400 mt-0.5">{formatDate(post.published_at || post.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`badge ${post.status === 'published' ? 'badge-green' : 'badge-yellow'}`}>
                        {post.status}
                      </span>
                      <div className="flex gap-2">
                        <Link to={`/blogs/${post.slug}`} className="text-xs text-ink-500 hover:text-brand-600">View</Link>
                        <Link to={`/blogs/${post.id}/edit`} className="text-xs text-ink-500 hover:text-brand-600">Edit</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
