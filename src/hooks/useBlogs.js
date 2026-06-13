import { useState, useEffect, useCallback } from 'react'
import { blogService } from '@/services/blogService'

/** Paginated, filterable list of published posts */
export function useBlogs({ page = 1, limit = 9, category = '', search = '' } = {}) {
  const [posts,      setPosts]      = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [count,      setCount]      = useState(0)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error, totalPages: tp, count: c } =
      await blogService.getPosts({ page, limit, category, search })
    if (error) setError(error.message)
    else { setPosts(data || []); setTotalPages(tp); setCount(c) }
    setLoading(false)
  }, [page, limit, category, search])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  return { posts, totalPages, count, loading, error, refetch: fetchPosts }
}

/** Single post by slug */
export function usePost(slug) {
  const [post,    setPost]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    blogService.getPostBySlug(slug).then(({ data, error }) => {
      if (error) setError(error.message)
      else setPost(data)
      setLoading(false)
    })
  }, [slug])

  return { post, loading, error }
}

/** Posts for current user (dashboard) */
export function useMyPosts(authorId, options = {}) {
  const [posts,   setPosts]   = useState([])
  const [count,   setCount]   = useState(0)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const fetch = useCallback(async () => {
    if (!authorId) return
    setLoading(true)
    const { data, error, count: c } = await blogService.getMyPosts(authorId, options)
    if (error) setError(error.message)
    else { setPosts(data || []); setCount(c) }
    setLoading(false)
  }, [authorId])

  useEffect(() => { fetch() }, [fetch])

  return { posts, count, loading, error, refetch: fetch }
}
