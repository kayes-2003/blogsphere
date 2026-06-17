import { useState, useEffect } from 'react'
import { Image, Eye, Save, Send, X } from 'lucide-react'
import { useCategories } from '@/hooks/useCategories'
import { blogService } from '@/services/blogService'
import { toSlug } from '@/utils/helpers'
import RichEditor from './RichEditor'
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

  useEffect(() => {
    if (!initialData && form.title) {
      setForm(f => ({ ...f, slug: toSlug(f.title) }))
    }
  }, [form.title, initialData])

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))
  const handleContent = (html) => setForm(f => ({ ...f, content: html }))

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

  const wordCount = form.content.replace(/<[^>]+>/g, '').trim().split(/\s+/).filter(Boolean).length
  const readTime  = Math.max(1, Math.round(wordCount / 100))

  const handleSubmit = (status) => {
    if (!form.title.trim()) { toast.error('Title is required'); return }
    if (!form.content.replace(/<[^>]+>/g, '').trim()) { toast.error('Content is required'); return }
    onSave({
      ...form, status, read_time: readTime,
      published_at: status === 'published'
        ? (form.published_at || new Date().toISOString())
        : form.published_at || null,
    }, status)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl font-bold text-ink-900">
            {initialData ? 'Edit Post' : 'New Post'}
          </h1>
          {wordCount > 0 && (
            <span className="badge-ink text-xs">{wordCount} words · {readTime} min read</span>
          )}
        </div>
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
        <div className="card p-8 lg:p-12">
          {form.cover_image && (
            <img src={form.cover_image} alt="Cover" className="w-full rounded-xl mb-8 aspect-video object-cover" />
          )}
          {form.category_id && (
            <span className="badge-brand mb-4 inline-block">
              {categories.find(c => c.id === form.category_id)?.name}
            </span>
          )}
          <h1 className="font-display text-4xl font-bold text-ink-900 mb-4 leading-tight">
            {form.title || 'Untitled'}
          </h1>
          {form.excerpt && (
            <p className="text-lg text-ink-500 mb-8 italic border-l-4 border-brand-300 pl-4">
              {form.excerpt}
            </p>
          )}
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: form.content }} />
        </div>
      ) : (
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
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-ink-200 hover:border-brand-400 rounded-xl p-10 text-center transition-colors group">
                  <Image size={32} className="mx-auto mb-2 text-ink-300 group-hover:text-brand-400 transition-colors" />
                  <p className="text-sm text-ink-500 font-medium">
                    {uploading ? 'Uploading…' : 'Click to upload cover image'}
                  </p>
                  <p className="text-xs text-ink-400 mt-1">PNG, JPG, WebP · max 5 MB</p>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
            )}
          </div>

          {/* Title */}
          <textarea
            value={form.title}
            onChange={set('title')}
            placeholder="Your post title…"
            rows={2}
            className="w-full font-display text-3xl font-bold text-ink-900 placeholder-ink-200 border-0 border-b-2 border-ink-100 focus:border-brand-400 focus:outline-none resize-none py-2 bg-transparent transition-colors leading-snug"
          />

          {/* Slug */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-ink-400 flex-shrink-0">/blogs/</span>
            <input value={form.slug} onChange={set('slug')} placeholder="post-slug" className="input flex-1 text-sm font-mono" />
          </div>

          {/* Excerpt */}
          <div>
            <label className="label">Excerpt <span className="text-ink-400 font-normal">(shown in post cards)</span></label>
            <textarea value={form.excerpt} onChange={set('excerpt')} placeholder="A short summary…" rows={2} maxLength={200} className="input resize-none" />
            <p className="text-xs text-ink-400 mt-1 text-right">{form.excerpt.length}/200</p>
          </div>

          {/* Category */}
          <div>
            <label className="label">Category</label>
            <select value={form.category_id} onChange={set('category_id')} className="input">
              <option value="">— Select a category —</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* Rich editor */}
          <div>
            <label className="label mb-2">Content <span className="text-ink-400 font-normal">— use the toolbar to format</span></label>
            <RichEditor
              value={form.content}
              onChange={handleContent}
              placeholder="Start writing… use the toolbar for headings, bold, lists, links and more."
            />
          </div>
        </div>
      )}
    </div>
  )
}