import { Link } from 'react-router-dom'
import { PenLine, Users, BookOpen, Heart, ArrowRight } from 'lucide-react'

const team = [
  { name: 'Sarah Chen',     role: 'Founder & CEO',       avatar: 'https://i.pravatar.cc/150?img=47' },
  { name: 'Marcus Webb',    role: 'Lead Engineer',        avatar: 'https://i.pravatar.cc/150?img=12' },
  { name: 'Aisha Patel',    role: 'Head of Design',       avatar: 'https://i.pravatar.cc/150?img=48' },
  { name: 'David Kim',      role: 'Community Manager',    avatar: 'https://i.pravatar.cc/150?img=15' },
]

const stats = [
  { label: 'Writers',        value: '12K+' },
  { label: 'Posts Published', value: '85K+' },
  { label: 'Monthly Readers', value: '2M+' },
  { label: 'Countries',       value: '140+' },
]

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="section page-py text-center">
        <span className="badge-brand mb-4 text-xs uppercase tracking-wider">Our Story</span>
        <h1 className="font-display text-5xl font-bold text-ink-900 mb-5 max-w-2xl mx-auto leading-tight">
          Built for writers who care about their craft
        </h1>
        <p className="text-ink-500 text-lg max-w-xl mx-auto leading-relaxed">
          BlogSphere started with a simple belief: every idea deserves a beautiful home. We built the platform we always wished existed.
        </p>
      </section>

      {/* Stats */}
      <section className="bg-ink-900">
        <div className="section py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map(({ label, value }) => (
              <div key={label}>
                <p className="font-display text-4xl font-bold text-brand-400 mb-1">{value}</p>
                <p className="text-sm text-ink-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl font-bold text-ink-900 mb-4">Our Mission</h2>
            <p className="text-ink-600 leading-relaxed mb-4">
              We believe the internet is better when people write thoughtfully, share generously, and build real communities around ideas that matter.
            </p>
            <p className="text-ink-600 leading-relaxed mb-6">
              BlogSphere gives writers everything they need — a powerful editor, a growing audience, and tools to manage and grow their presence — without getting in the way.
            </p>
            <div className="flex flex-col gap-3">
              {[
                { icon: <PenLine size={18} />,  text: 'A writing experience that respects your focus' },
                { icon: <Users size={18} />,    text: 'Community tools that build real connections' },
                { icon: <BookOpen size={18} />, text: 'Discovery that surfaces quality over quantity' },
                { icon: <Heart size={18} />,    text: 'No ads. No noise. Just great writing.' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-ink-600">
                  <div className="text-brand-500 flex-shrink-0">{icon}</div>
                  {text}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-brand-50 to-ink-50 rounded-2xl p-10 flex items-center justify-center aspect-square max-w-sm mx-auto md:mx-0 w-full">
            <PenLine size={80} className="text-brand-400 opacity-40" />
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section pb-16">
        <h2 className="font-display text-3xl font-bold text-ink-900 mb-10 text-center">Meet the Team</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {team.map(({ name, role, avatar }) => (
            <div key={name} className="text-center">
              <img src={avatar} alt={name} className="w-20 h-20 rounded-2xl object-cover mx-auto mb-3 shadow-sm" />
              <p className="font-semibold text-ink-900 text-sm">{name}</p>
              <p className="text-xs text-ink-400 mt-0.5">{role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-500">
        <div className="section py-14 text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">Join our community</h2>
          <p className="text-brand-100 mb-7 max-w-sm mx-auto">Start writing today — it's free forever.</p>
          <Link to="/register" className="btn bg-white text-brand-700 hover:bg-brand-50 btn-lg">
            Create account <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
