import { Link } from 'react-router-dom'
import { PenLine, Users, BookOpen, Heart, ArrowRight, Twitter, Linkedin, UserPlus } from 'lucide-react'
import { useStats } from '@/hooks/useStats'
import { useTeam } from '@/hooks/useTeam'
import AnimatedCounter from '@/components/common/AnimatedCounter'
import Spinner from '@/components/common/Spinner'

const COUNTRIES_COUNT = 140

export default function About() {
  const { stats, loading: statsLoading } = useStats()
  const { members, loading: teamLoading } = useTeam()

  const statItems = [
    { label: 'Writers',         value: stats?.writers      ?? 0, suffix: '+', live: true,  tooltip: 'Total registered authors' },
    { label: 'Posts Published', value: stats?.posts        ?? 0, suffix: '+', live: true,  tooltip: 'Published articles' },
    { label: 'Monthly Readers', value: stats?.monthlyViews ?? 0, suffix: '+', live: true,  tooltip: 'Views in last 30 days' },
    { label: 'Countries',       value: COUNTRIES_COUNT,          suffix: '+', live: false, tooltip: 'Countries our readers come from' },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="section page-py text-center px-4">
        <span className="badge-brand mb-4 text-xs uppercase tracking-wider">Our Story</span>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-ink-900 mb-5 max-w-2xl mx-auto leading-tight">
          Built for writers who care about their craft
        </h1>
        <p className="text-ink-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          BlogSphere started with a simple belief: every idea deserves a beautiful home.
          We built the platform we always wished existed.
        </p>
      </section>

      {/* Live Stats */}
      <section className="bg-ink-900">
        <div className="section py-10 sm:py-12 px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 text-center">
            {statItems.map(({ label, value, suffix, live, tooltip }) => (
              <div key={label} className="relative">
                {live && (
                  <span className="absolute -top-1 right-1/2 translate-x-6 md:right-4 md:translate-x-0 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                )}
                <p className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-brand-400 mb-1 tabular-nums break-words">
                  {statsLoading
                    ? <span className="inline-block w-16 sm:w-20 h-8 sm:h-10 skeleton rounded-lg" />
                    : <AnimatedCounter value={value} suffix={suffix} />
                  }
                </p>
                <p className="text-xs sm:text-sm text-ink-400">{label}</p>
              </div>
            ))}
          </div>
          {!statsLoading && (
            <p className="text-center text-xs text-ink-600 mt-6 flex flex-wrap items-center justify-center gap-1.5 px-2">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0" />
              <span>Writers, Posts & Monthly Readers update live</span>
            </p>
          )}
        </div>
      </section>

      {/* Mission */}
      <section className="section py-12 sm:py-16 px-4">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink-900 mb-4">Our Mission</h2>
            <p className="text-ink-600 leading-relaxed mb-4 text-sm sm:text-base">
              We believe the internet is better when people write thoughtfully, share generously,
              and build real communities around ideas that matter.
            </p>
            <p className="text-ink-600 leading-relaxed mb-6 text-sm sm:text-base">
              BlogSphere gives writers everything they need — a powerful editor, a growing audience,
              and tools to manage their presence — without getting in the way.
            </p>
            <div className="flex flex-col gap-3">
              {[
                { icon: <PenLine size={18} />,  text: 'A writing experience that respects your focus' },
                { icon: <Users size={18} />,    text: 'Community tools that build real connections' },
                { icon: <BookOpen size={18} />, text: 'Discovery that surfaces quality over quantity' },
                { icon: <Heart size={18} />,    text: 'No ads. No noise. Just great writing.' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-start sm:items-center gap-3 text-sm text-ink-600">
                  <div className="text-brand-500 flex-shrink-0 mt-0.5 sm:mt-0">{icon}</div>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-brand-50 to-ink-50 rounded-2xl p-8 sm:p-10 flex items-center justify-center aspect-square max-w-sm mx-auto w-full">
            <PenLine size={64} className="sm:w-20 sm:h-20 text-brand-400 opacity-40" />
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section pb-16 sm:pb-20 px-4">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink-900 mb-2">Meet the Team</h2>
          <p className="text-ink-500 text-sm">The people behind BlogSphere</p>
        </div>

        {teamLoading ? (
          <Spinner />
        ) : members.length === 0 ? (
          <div className="text-center py-12 text-ink-400">
            <UserPlus size={28} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No team members added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-3xl md:max-w-none mx-auto">
            {members.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-brand-500">
        <div className="section py-12 sm:py-14 text-center px-4">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">Join our community</h2>
          <p className="text-brand-100 mb-7 max-w-sm mx-auto text-sm sm:text-base">Start writing today — it's free forever.</p>
          <Link to="/register" className="btn bg-white text-brand-700 hover:bg-brand-50 btn-lg">
            Create account <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}

function TeamCard({ member }) {
  return (
    <div className="group text-center">
      <div className="relative mx-auto mb-3 sm:mb-4 w-16 h-16 sm:w-24 sm:h-24">
        {member.avatar_url ? (
          <img
            src={member.avatar_url}
            alt={member.name}
            className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-sm group-hover:shadow-md transition-shadow"
          />
        ) : (
          <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-brand-100 to-ink-100 flex items-center justify-center shadow-sm">
            <span className="font-display text-xl sm:text-3xl font-bold text-brand-400">
              {member.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <p className="font-semibold text-ink-900 text-xs sm:text-sm mb-0.5 truncate px-1">{member.name}</p>
      <p className="text-xs text-brand-600 font-medium mb-1.5 truncate px-1">{member.role}</p>
      {member.bio && (
        <p className="hidden sm:block text-xs text-ink-400 leading-relaxed line-clamp-2 mb-3 px-1">
          {member.bio}
        </p>
      )}

      {(member.twitter || member.linkedin) && (
        <div className="flex items-center justify-center gap-2">
          {member.twitter && (
            <a href={`https://twitter.com/${member.twitter}`} target="_blank" rel="noopener noreferrer"
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-ink-100 hover:bg-brand-100 flex items-center justify-center text-ink-500 hover:text-brand-600 transition-colors">
              <Twitter size={12} />
            </a>
          )}
          {member.linkedin && (
            <a href={`https://linkedin.com/in/${member.linkedin}`} target="_blank" rel="noopener noreferrer"
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-ink-100 hover:bg-brand-100 flex items-center justify-center text-ink-500 hover:text-brand-600 transition-colors">
              <Linkedin size={12} />
            </a>
          )}
        </div>
      )}
    </div>
  )
}