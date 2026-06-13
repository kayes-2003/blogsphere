import { supabase } from './supabase'

export const adminService = {
  // ─── Stats ────────────────────────────────────────────────────
  async getStats() {
    const [postsRes, usersRes, commentsRes] = await Promise.all([
      supabase.from('posts').select('id, status', { count: 'exact' }),
      supabase.from('profiles').select('id', { count: 'exact' }),
      supabase.from('comments').select('id, approved', { count: 'exact' }),
    ])

    const posts    = postsRes.data    || []
    const comments = commentsRes.data || []

    return {
      totalPosts:       postsRes.count    || 0,
      publishedPosts:   posts.filter(p => p.status === 'published').length,
      draftPosts:       posts.filter(p => p.status === 'draft').length,
      totalUsers:       usersRes.count    || 0,
      totalComments:    commentsRes.count || 0,
      pendingComments:  comments.filter(c => !c.approved).length,
    }
  },

  // ─── Posts ────────────────────────────────────────────────────
  async getAllPosts({ page = 1, limit = 20 } = {}) {
    const { data, error, count } = await supabase
      .from('posts')
      .select(
        'id, title, slug, status, published_at, created_at, views, author:profiles(full_name)',
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)
    return { data, error, count }
  },

  async updatePostStatus(id, status) {
    const updates = status === 'published'
      ? { status, published_at: new Date().toISOString() }
      : { status }
    const { data, error } = await supabase.from('posts').update(updates).eq('id', id).select().single()
    return { data, error }
  },

  async deletePost(id) {
    const { error } = await supabase.from('posts').delete().eq('id', id)
    return { error }
  },

  // ─── Users ────────────────────────────────────────────────────
  async getAllUsers({ page = 1, limit = 20 } = {}) {
    const { data, error, count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)
    return { data, error, count }
  },

  async updateUserRole(userId, role) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  },

  async deleteUser(userId) {
    const { error } = await supabase.from('profiles').delete().eq('id', userId)
    return { error }
  },

  // ─── Comments ─────────────────────────────────────────────────
  async getAllComments({ page = 1, limit = 20 } = {}) {
    const { data, error, count } = await supabase
      .from('comments')
      .select(
        '*, author:profiles(full_name), post:posts(title, slug)',
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)
    return { data, error, count }
  },

  async approveComment(id) {
    const { data, error } = await supabase
      .from('comments').update({ approved: true }).eq('id', id).select().single()
    return { data, error }
  },

  async deleteComment(id) {
    const { error } = await supabase.from('comments').delete().eq('id', id)
    return { error }
  },
}
