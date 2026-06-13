import { useState, useEffect } from 'react'
import { MessageCircle, Send } from 'lucide-react'
import { blogService } from '@/services/blogService'
import { useAuth } from '@/context/AuthContext'
import Avatar from '@/components/common/Avatar'
import { timeAgo } from '@/utils/helpers'
import toast from 'react-hot-toast'

export default function CommentSection({ postId }) {
  const { user, profile } = useAuth()
  const [comments, setComments] = useState([])
  const [text,     setText]     = useState('')
  const [loading,  setLoading]  = useState(false)
  const [sending,  setSending]  = useState(false)

  useEffect(() => {
    if (!postId) return
    setLoading(true)
    blogService.getComments(postId).then(({ data }) => {
      setComments(data || [])
      setLoading(false)
    })
  }, [postId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setSending(true)
    const { error } = await blogService.addComment({ postId, authorId: user.id, content: text.trim() })
    if (error) toast.error('Failed to post comment')
    else {
      toast.success('Comment submitted — awaiting approval')
      setText('')
    }
    setSending(false)
  }

  return (
    <section className="mt-14 pt-10 border-t border-ink-100">
      <h3 className="font-display text-2xl font-bold text-ink-900 mb-8 flex items-center gap-2">
        <MessageCircle size={22} className="text-brand-500" />
        {loading ? 'Comments' : `${comments.length} Comment${comments.length !== 1 ? 's' : ''}`}
      </h3>

      {/* Comment list */}
      {loading ? (
        <div className="space-y-4">
          {[1,2].map(i => <div key={i} className="h-20 skeleton rounded-xl" />)}
        </div>
      ) : (
        <div className="space-y-5 mb-10">
          {comments.map(c => (
            <div key={c.id} className="flex gap-3">
              <Avatar profile={c.author} size={38} />
              <div className="flex-1 min-w-0">
                <div className="card px-4 py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-ink-800">{c.author?.full_name}</span>
                    <span className="text-xs text-ink-400">{timeAgo(c.created_at)}</span>
                  </div>
                  <p className="text-sm text-ink-700 leading-relaxed">{c.content}</p>
                </div>
              </div>
            </div>
          ))}
          {!loading && comments.length === 0 && (
            <p className="text-center text-ink-400 text-sm py-8">No comments yet. Be the first!</p>
          )}
        </div>
      )}

      {/* Comment form */}
      {user ? (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Avatar profile={profile} size={38} />
          <div className="flex-1">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Share your thoughts…"
              rows={3}
              className="input resize-none"
              disabled={sending}
            />
            <div className="mt-2 flex justify-end">
              <button type="submit" className="btn-brand btn-sm" disabled={sending || !text.trim()}>
                <Send size={14} /> {sending ? 'Posting…' : 'Post comment'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="text-center py-6 card bg-ink-50">
          <p className="text-sm text-ink-500 mb-3">Sign in to leave a comment</p>
          <a href="/login" className="btn-primary btn-sm">Sign in</a>
        </div>
      )}
    </section>
  )
}
