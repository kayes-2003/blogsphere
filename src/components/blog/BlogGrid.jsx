import BlogCard from './BlogCard'
import Spinner from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import { BookOpen } from 'lucide-react'

export default function BlogGrid({ posts, loading, featured = false }) {
  if (loading) return <Spinner />

  if (!posts?.length) {
    return (
      <EmptyState
        icon={<BookOpen size={28} />}
        title="No posts yet"
        description="Be the first to publish something amazing."
      />
    )
  }

  if (featured) {
    const [first, ...rest] = posts
    return (
      <div className="space-y-6">
        <BlogCard post={first} featured />
        {rest.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map(p => <BlogCard key={p.id} post={p} />)}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map(p => <BlogCard key={p.id} post={p} />)}
    </div>
  )
}
