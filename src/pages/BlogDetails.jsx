import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, Eye, Tag } from 'lucide-react'
import { usePost } from '@/hooks/useBlogs'
import { formatDate } from '@/utils/helpers'
import Avatar from '@/components/common/Avatar'
import Spinner from '@/components/common/Spinner'
import CommentSection from '@/components/blog/CommentSection'

export default function BlogDetails() {
  const { slug }           = useParams()
  const { post, loading, error } = usePost(slug)

  if (loading) return <Spinner fullPage />

  if (error || !post) {
    return (
      <div className="section page-py text-center">
        <p className="text-5xl mb-4">😕</p>
        <h2 className="font-display text-2xl font-bold text-ink-900 mb-2">Post not found</h2>
        <p className="text-ink-500 mb-6">This post may have been removed or the URL is incorrect.</p>
        <Link to="/blogs" className="btn-primary">← Back to Blog</Link>
      </div>
    )
  }

  return (
    <article className="section page-py">
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <Link to="/blogs" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800 transition-colors mb-8">
          <ArrowLeft size={15} /> All posts
        </Link>

        {/* Category */}
        {post.category && (
          <span className="badge-brand mb-4">{post.category.name}</span>
        )}

        {/* Title */}
        <h1 className="font-display text-4xl md:text-5xl font-bold text-ink-900 leading-tight mb-5">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xl text-ink-500 leading-relaxed mb-6">{post.excerpt}</p>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-500 mb-8 pb-8 border-b border-ink-100">
          <div className="flex items-center gap-2">
            <Avatar profile={post.author} size={36} />
            <span className="font-medium text-ink-800">{post.author?.full_name}</span>
          </div>
          <span className="flex items-center gap-1"><Calendar size={13} /> {formatDate(post.published_at)}</span>
          {post.read_time && <span className="flex items-center gap-1"><Clock size={13} /> {post.read_time} min read</span>}
          {post.views != null && <span className="flex items-center gap-1"><Eye size={13} /> {post.views} views</span>}
        </div>

        {/* Cover image */}
        {post.cover_image && (
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full rounded-2xl mb-10 aspect-video object-cover shadow-sm"
          />
        )}

        {/* Content */}
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Author card */}
        {post.author && (
          <div className="mt-14 card p-6 flex items-start gap-4">
            <Avatar profile={post.author} size={56} />
            <div>
              <p className="font-display font-bold text-ink-900 text-lg">{post.author.full_name}</p>
              {post.author.bio && <p className="text-sm text-ink-500 mt-1 leading-relaxed">{post.author.bio}</p>}
            </div>
          </div>
        )}

        {/* Comments */}
        <CommentSection postId={post.id} />
      </div>
    </article>
  )
}
