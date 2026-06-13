import { initials } from '@/utils/helpers'

export default function Avatar({ profile, size = 40, className = '' }) {
  const style = { width: size, height: size, fontSize: size * 0.36 }

  if (profile?.avatar_url) {
    return (
      <img
        src={profile.avatar_url}
        alt={profile?.full_name || 'User'}
        style={style}
        className={`rounded-full object-cover flex-shrink-0 ${className}`}
      />
    )
  }

  return (
    <div
      style={style}
      className={`rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0 ${className}`}
    >
      <span className="font-semibold text-brand-700 leading-none">
        {initials(profile?.full_name)}
      </span>
    </div>
  )
}
