import { Link } from 'react-router-dom'
import { Clock, Calendar, Eye } from 'lucide-react'
import { formatDate } from '@/utils/helpers'
import Avatar from '@/components/common/Avatar'

export default function BlogCard({ post, featured = false }) {
  const date = formatDate(post.published_at)
  const href = `/blogs/${post.slug}`

  if (featured) {
    return (
      <article className="group relative overflow-hidden rounded-2xl min-h-[440px] flex flex-col justify-end bg-ink-900">
        {post.cover_image && (
          <>
            <img
              src={post.cover_image}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:opacity-55 transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/50 to-transparent" />
          </>
        )}
        <div className="relative p-8 md:p-10">
          {post.category && (
            <span className="badge bg-brand-500/20 text-brand-300 border border-brand-500/30 mb-3">
              {post.category.name}
            </span>
          )}
          <Link to={href}>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white group-hover:text-brand-300 transition-colors line-clamp-2 mb-3">
              {post.title}
            </h2>
          </Link>
          {post.excerpt && (
            <p className="text-ink-300 text-sm md:text-base line-clamp-2 mb-6">{post.excerpt}</p>
          )}
          <div className="flex items-center gap-3">
            <Avatar profile={post.author} size={38} />
            <div>
              <p className="text-sm font-medium text-white">{post.author?.full_name}</p>
              <div className="flex items-center gap-3 text-xs text-ink-400 mt-0.5">
                <span className="flex items-center gap-1"><Calendar size={11} /> {date}</span>
                {post.read_time && <span className="flex items-center gap-1"><Clock size={11} /> {post.read_time} min read</span>}
              </div>
            </div>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="card-hover group flex flex-col overflow-hidden">
      {/* Cover */}
      <Link to={href} className="block overflow-hidden aspect-video">
        {post.cover_image ? (
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-50 to-ink-100 flex items-center justify-center">
            <span className="font-display text-4xl text-ink-200">{post.title?.[0]}</span>
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        {post.category && (
          <span className="badge-brand mb-3 self-start">{post.category.name}</span>
        )}
        <Link to={href} className="flex-1 group">
          <h3 className="font-display text-xl font-bold text-ink-900 group-hover:text-brand-700 transition-colors line-clamp-2 mb-2">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-ink-500 text-sm line-clamp-3 leading-relaxed">{post.excerpt}</p>
          )}
        </Link>

        {/* Footer */}
        <div className="flex items-center gap-2.5 mt-5 pt-4 border-t border-ink-50">
          <Avatar profile={post.author} size={30} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-ink-700 truncate">{post.author?.full_name}</p>
            <div className="flex items-center gap-2 text-xs text-ink-400 mt-0.5">
              <span>{date}</span>
              {post.read_time && <><span>·</span><span>{post.read_time} min</span></>}
              {post.views != null && <><span>·</span><span className="flex items-center gap-0.5"><Eye size={10}/>{post.views}</span></>}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
