import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { blogService } from '@/services/blogService'
import BlogForm from '@/components/blog/BlogForm'
import toast from 'react-hot-toast'

export default function AddBlog() {
  const { user } = useAuth()
  const navigate  = useNavigate()
  const [saving, setSaving] = useState(false)

  const handleSave = async (payload, status) => {
    setSaving(true)
    const { data, error } = await blogService.createPost({
      ...payload,
      author_id: user.id,
      status,
    })
    setSaving(false)

    if (error) {
      toast.error(error.message || 'Failed to save post')
      return
    }

    toast.success(status === 'published' ? 'Post published! 🎉' : 'Draft saved')
    navigate(status === 'published' ? `/blogs/${data.slug}` : '/manage-blogs')
  }

  return (
    <div className="section page-py">
      <BlogForm onSave={handleSave} saving={saving} />
    </div>
  )
}
