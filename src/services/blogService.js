import { supabase } from './supabase'

// ─── Posts ──────────────────────────────────────────────────────────────────
export const blogService = {
  /** Fetch published posts for the public blog listing */
  async getPosts({ page = 1, limit = 9, category = '', search = '' } = {}) {
    let query = supabase
      .from('posts')
      .select(
        `id, title, slug, excerpt, cover_image, published_at, read_time, views,
         author:profiles(id, full_name, avatar_url),
         category:categories(id, name, slug)`,
        { count: 'exact' }
      )
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (category) query = query.eq('category_id', category)
    if (search)   query = query.ilike('title', `%${search}%`)

    const { data, error, count } = await query
    return { data, error, count, totalPages: Math.ceil((count || 0) / limit) }
  },

  /** Single post by slug — increments view count */
  async getPostBySlug(slug) {
    const { data, error } = await supabase
      .from('posts')
      .select(
        `*, author:profiles(id, full_name, avatar_url, bio),
         category:categories(id, name, slug)`
      )
      .eq('slug', slug)
      .single()

    if (data) {
      // fire-and-forget view increment
      supabase.from('posts').update({ views: (data.views || 0) + 1 }).eq('id', data.id).then(() => {})
    }

    return { data, error }
  },

  /** Posts authored by a specific user (dashboard) */
  async getMyPosts(authorId, { page = 1, limit = 12 } = {}) {
    const { data, error, count } = await supabase
      .from('posts')
      .select('id, title, slug, status, published_at, created_at, read_time, views, cover_image', { count: 'exact' })
      .eq('author_id', authorId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)
    return { data, error, count }
  },

  /** Create a new post */
  async createPost(post) {
  const { category, author, tags, ...cleanPost } = post

  const { data, error } = await supabase
    .from('posts')
    .insert(cleanPost)
    .select()
    .single()
  return { data, error }
},

  /** Update an existing post */
  async updatePost(id, updates) {
  // Remove joined relations that Supabase doesn't accept as columns
  const { category, author, tags, ...cleanUpdates } = updates

  const { data, error } = await supabase
    .from('posts')
    .update(cleanUpdates)
    .eq('id', id)
    .select()
    .single()
  return { data, error }

},
  /** Delete a post */
  async deletePost(id) {
    const { error } = await supabase.from('posts').delete().eq('id', id)
    return { error }
  },

  /** Get a single post by id (for edit form) */
  async getPostById(id) {
    const { data, error } = await supabase
      .from('posts')
      .select('*, category:categories(id, name)')
      .eq('id', id)
      .single()
    return { data, error }
  },

  // ─── Categories ──────────────────────────────────────────────────────────
  async getCategories() {
    const { data, error } = await supabase.from('categories').select('*').order('name')
    return { data, error }
  },

  async createCategory(name, slug) {
    const { data, error } = await supabase.from('categories').insert({ name, slug }).select().single()
    return { data, error }
  },

  // ─── Comments ────────────────────────────────────────────────────────────
  async getComments(postId) {
    const { data, error } = await supabase
      .from('comments')
      .select('*, author:profiles(id, full_name, avatar_url)')
      .eq('post_id', postId)
      .eq('approved', true)
      .order('created_at', { ascending: true })
    return { data, error }
  },

  async addComment({ postId, authorId, content }) {
    const { data, error } = await supabase
      .from('comments')
      .insert({ post_id: postId, author_id: authorId, content, approved: false })
      .select()
      .single()
    return { data, error }
  },

  // ─── Image upload ─────────────────────────────────────────────────────────
  async uploadCoverImage(file) {
    const ext      = file.name.split('.').pop()
    const fileName = `covers/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error } = await supabase.storage
      .from('blog-images')
      .upload(fileName, file, { cacheControl: '3600', upsert: false })

    if (error) return { url: null, error }

    const { data } = supabase.storage.from('blog-images').getPublicUrl(fileName)
    return { url: data.publicUrl, error: null }
  },
}
