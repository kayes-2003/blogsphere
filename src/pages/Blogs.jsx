import { useState } from 'react'
import { Search, Filter } from 'lucide-react'
import { useBlogs } from '@/hooks/useBlogs'
import { useCategories } from '@/hooks/useCategories'
import BlogGrid from '@/components/blog/BlogGrid'
import Pagination from '@/components/common/Pagination'

export default function Blogs() {
  const [page,     setPage]     = useState(1)
  const [search,   setSearch]   = useState('')
  const [query,    setQuery]    = useState('')
  const [category, setCategory] = useState('')

  const { categories } = useCategories()
  const { posts, loading, totalPages, count } = useBlogs({ page, search: query, category })

  const handleSearch = (e) => {
    e.preventDefault()
    setQuery(search)
    setPage(1)
  }

  const handleCategory = (id) => {
    setCategory(id)
    setPage(1)
  }

  return (
    <div className="section page-py ">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-ink-900 mb-2">All Posts</h1>
        {!loading && (
          <p className="text-ink-500">{count} {count === 1 ? 'story' : 'stories'} published</p>
        )}
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search posts…"
              className="input pl-9"
            />
          </div>
          <button type="submit" className="btn-primary btn-sm px-4">Search</button>
        </form>

        {categories.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={20} className="text-ink-400 flex-shrink-0" />
            <button
              onClick={() => handleCategory('')}
              className={`badge cursor-pointer transition-colors ${
                category === '' ? 'bg-ink-900 text-white' : 'badge-ink hover:bg-ink-100'
              }`}
            >
              All
            </button>
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => handleCategory(c.id)}
                className={`badge cursor-pointer transition-colors ${
                  category === c.id ? 'bg-ink-900 text-white' : 'badge-ink hover:bg-ink-100'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid */}
      <BlogGrid posts={posts} loading={loading} />
      <Pagination page={page} totalPages={totalPages} onChange={p => { setPage(p); window.scrollTo({ top: 0 }) }} />
    </div>
  )
}
