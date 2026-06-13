import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { blogService } from '@/services/blogService'
import BlogForm from '@/components/blog/BlogForm'
import Spinner from '@/components/common/Spinner'
import toast from 'react-hot-toast'

export default function EditBlog() {
  const { id }    = useParams()
  const { user, isAdmin } = useAuth()
  const navigate  = useNavigate()

  const [post,    setPost]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)

  useEffect(() => {
    blogService.getPostById(id).then(({ data, error }) => {
      if (error || !data) {
        toast.error('Post not found')
        navigate('/manage-blogs')
        return
      }
      // Only owner or admin can edit
      if (data.author_id !== user.id && !isAdmin) {
        toast.error('Not authorised to edit this post')
        navigate('/manage-blogs')
        return
      }
      setPost(data)
      setLoading(false)
    })
  }, [id, user.id, isAdmin, navigate])

  const handleSave = async (payload, status) => {
    setSaving(true)
    const { data, error } = await blogService.updatePost(id, { ...payload, status })
    setSaving(false)

    if (error) {
      toast.error(error.message || 'Failed to update post')
      return
    }

    toast.success(status === 'published' ? 'Post published! 🎉' : 'Draft saved')
    navigate(status === 'published' ? `/blogs/${data.slug}` : '/manage-blogs')
  }

  if (loading) return <Spinner fullPage />

  return (
    <div className="section page-py">
      <BlogForm initialData={post} onSave={handleSave} saving={saving} />
    </div>
  )
}
