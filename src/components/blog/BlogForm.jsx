import { useState, useEffect } from 'react'
import { Image, Eye, Save, Send, X } from 'lucide-react'
import { useCategories } from '@/hooks/useCategories'
import { blogService } from '@/services/blogService'
import { toSlug, calcReadTime } from '@/utils/helpers'
import toast from 'react-hot-toast'

export default function BlogForm({ initialData = null, onSave, saving = false }) {
  const { categories } = useCategories()

  const [form, setForm] = useState({
    title:       '',
    slug:        '',
    excerpt:     '',
    content:     '',
    cover_image: '',
    category_id: '',
    status:      'draft',
    ...initialData,
  })
  const [uploading, setUploading] = useState(false)
  const [preview,   setPreview]   = useState(false)

  // Auto-generate slug from title (only when creating)
  useEffect(() => {
    if (!initialData && form.title) {
      setForm(f => ({ ...f, slug: toSlug(f.title) }))
    }
  }, [form.title, initialData])

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5 MB'); return }
    setUploading(true)
    const { url, error } = await blogService.uploadCoverImage(file)
    if (error) toast.error('Upload failed')
    else setForm(f => ({ ...f, cover_image: url }))
    setUploading(false)
  }

  const handleSubmit = (status) => {
    if (!form.title.trim())   { toast.error('Title is required');   return }
    if (!form.content.trim()) { toast.error('Content is required'); return }

    const readTime = calcReadTime(form.content)
    const payload  = {
      ...form,
      status,
      read_time:    readTime,
      published_at: status === 'published' ? new Date().toISOString() : form.published_at || null,
    }
    onSave(payload, status)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-ink-900">
          {initialData ? 'Edit Post' : 'New Post'}
        </h1>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setPreview(!preview)} className="btn-outline btn-sm">
            <Eye size={14} /> {preview ? 'Edit' : 'Preview'}
          </button>
          <button type="button" onClick={() => handleSubmit('draft')} className="btn-outline btn-sm" disabled={saving}>
            <Save size={14} /> Save Draft
          </button>
          <button type="button" onClick={() => handleSubmit('published')} className="btn-brand btn-sm" disabled={saving}>
            <Send size={14} /> {saving ? 'Publishing…' : 'Publish'}
          </button>
        </div>
      </div>

      {preview ? (
        /* ── Preview ── */
        <div className="card p-8">
          {form.cover_image && (
            <img src={form.cover_image} alt="Cover" className="w-full rounded-xl mb-6 aspect-video object-cover" />
          )}
          <h1 className="font-display text-4xl font-bold text-ink-900 mb-3">{form.title || 'Untitled'}</h1>
          {form.excerpt && <p className="text-lg text-ink-500 mb-6 italic">{form.excerpt}</p>}
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: form.content.replace(/\n/g, '<br/>') }} />
        </div>
      ) : (
        /* ── Edit form ── */
        <div className="space-y-5">
          {/* Cover image */}
          <div>
            {form.cover_image ? (
              <div className="relative rounded-xl overflow-hidden aspect-video bg-ink-100">
                <img src={form.cover_image} alt="Cover" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, cover_image: '' }))}
                  className="absolute top-3 right-3 w-8 h-8 bg-ink-900/70 hover:bg-ink-900 rounded-full flex items-center justify-center text-white"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="block">
                <div className="border-2 border-dashed border-ink-200 hover:border-brand-400 rounded-xl p-10 text-center cursor-pointer transition-colors group">
                  <Image size={32} className="mx-auto mb-2 text-ink-300 group-hover:text-brand-400 transition-colors" />
                  <p className="text-sm text-ink-500 font-medium">{uploading ? 'Uploading…' : 'Click to upload cover image'}</p>
                  <p className="text-xs text-ink-400 mt-1">PNG, JPG, WebP · max 5 MB</p>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
            )}
          </div>

          {/* Title */}
          <div>
            <textarea
              value={form.title}
              onChange={set('title')}
              placeholder="Your post title…"
              rows={2}
              className="w-full font-display text-3xl font-bold text-ink-900 placeholder-ink-300 border-0 border-b-2 border-ink-100 focus:border-brand-400 focus:outline-none resize-none py-2 bg-transparent transition-colors"
            />
          </div>

          {/* Slug */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-ink-400">/blogs/</span>
            <input
              value={form.slug}
              onChange={set('slug')}
              placeholder="post-slug"
              className="input flex-1 text-sm font-mono"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="label">Excerpt <span className="text-ink-400 font-normal">(shown in cards)</span></label>
            <textarea
              value={form.excerpt}
              onChange={set('excerpt')}
              placeholder="A short summary of your post…"
              rows={2}
              className="input resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="label">Category</label>
            <select value={form.category_id} onChange={set('category_id')} className="input">
              <option value="">— Select a category —</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div>
            <label className="label">Content <span className="text-ink-400 font-normal">(HTML or plain text supported)</span></label>
            <textarea
              value={form.content}
              onChange={set('content')}
              placeholder="Write your post here…"
              rows={20}
              className="input font-mono text-sm resize-y leading-relaxed"
            />
          </div>
        </div>
      )}
    </div>
  )
}
