import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, PenLine, Users, BookOpen, Zap } from 'lucide-react'
import { useBlogs } from '@/hooks/useBlogs'
import BlogGrid from '@/components/blog/BlogGrid'

const features = [
  { icon: <PenLine size={22} />,  title: 'Beautiful Writing',  desc: 'A distraction-free editor that gets out of your way.' },
  { icon: <Users size={22} />,    title: 'Grow Your Audience', desc: 'Reach readers who care about what you write.' },
  { icon: <Zap size={22} />,      title: 'Lightning Fast',     desc: 'Built on modern technology for a seamless experience.' },
  { icon: <BookOpen size={22} />, title: 'Discover Stories',   desc: 'Find inspiring content across every category.' },
]

export default function Home() {
  const { posts, loading } = useBlogs({ page: 1, limit: 7 })

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-ink-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#e6941f20,_transparent_60%)]" />
        <div className="section page-py relative">
          <div className="max-w-2xl">
            <span className="badge bg-brand-500/20 text-brand-300 border border-brand-500/30 mb-6 text-xs uppercase tracking-wider">
              Modern Blogging Platform
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-6">
              Ideas deserve a{' '}
              <span className="text-brand-400">beautiful</span>{' '}
              home
            </h1>
            <p className="text-ink-300 text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
              BlogSphere is where thoughtful writers publish, grow an audience, and connect with readers who care.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register" className="btn-brand btn-lg border border-ink-700">
                Start writing free <ArrowRight size={18} />
              </Link>
              <Link to="/blogs" className="btn btn-lg border border-ink-700 text-ink-200 hover:bg-ink-800">
                Browse posts
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative blobs */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute right-20 bottom-0 w-64 h-64 bg-ink-700/40 rounded-full blur-2xl pointer-events-none" />
      </section>

      {/* ── Features ── */}
      <section className="section py-16 border-b border-ink-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map(({ icon, title, desc }) => (
            <div key={title} className="flex flex-col gap-3">
              <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center text-black">
                {icon}
              </div>
              <div>
                <h3 className="font-display font-semibold text-ink-900 mb-1">{title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Latest Posts ── */}
      <section className="section page-py">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl font-bold text-ink-900">Latest Stories</h2>
            <p className="text-ink-500 mt-1 text-sm">Fresh perspectives from our community</p>
          </div>
          <Link to="/blogs" className="btn-outline btn-sm hidden sm:flex">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <BlogGrid posts={posts} loading={loading} featured />

        <div className="mt-10 text-center sm:hidden">
          <Link to="/blogs" className="btn-outline">View all posts <ArrowRight size={15} /></Link>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-green-700">
        <div className="section py-14 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to share your story?
          </h2>
          <p className="text-brand-100 mb-7 max-w-md mx-auto">
            Join thousands of writers who trust BlogSphere to reach their audience.
          </p>
          <Link to="/register" className="btn bg-white text-brand-700 hover:bg-green-400 btn-lg">
            Create free account <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
