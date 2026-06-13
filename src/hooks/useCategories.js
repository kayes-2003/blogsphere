import { useState, useEffect } from 'react'
import { blogService } from '@/services/blogService'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    blogService.getCategories().then(({ data }) => {
      setCategories(data || [])
      setLoading(false)
    })
  }, [])

  return { categories, loading }
}
