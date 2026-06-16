import { useState, useEffect } from 'react'
import { supabase } from '@/services/supabase'

/**
 * Fetches live platform statistics from Supabase.
 * Writers        → count of profiles
 * Posts          → count of published posts
 * Monthly views  → sum of views on posts published in last 30 days
 * Countries      → stored in a manually-updated `site_stats` table (see README)
 */
export function useStats() {
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const [writersRes, postsRes, viewsRes] = await Promise.all([
        // Total registered users
        supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true }),

        // Total published posts
        supabase
          .from('posts')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'published'),

        // Sum of views on posts published in last 30 days
        supabase
          .from('posts')
          .select('views')
          .eq('status', 'published')
          .gte('published_at', thirtyDaysAgo.toISOString()),
      ])

      const monthlyViews = (viewsRes.data || []).reduce(
        (sum, p) => sum + (p.views || 0), 0
      )

      setStats({
        writers:      writersRes.count  || 0,
        posts:        postsRes.count    || 0,
        monthlyViews,
      })
      setLoading(false)
    }

    fetchStats()
  }, [])

  return { stats, loading }
}
