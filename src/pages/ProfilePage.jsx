import { useState } from 'react'
import { Camera, Save, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { profileService } from '@/services/profileService'
import Avatar from '@/components/common/Avatar'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { profile, refreshProfile } = useAuth()

  const [form, setForm] = useState({
    full_name: profile?.full_name  || '',
    bio:       profile?.bio        || '',
    website:   profile?.website    || '',
    twitter:   profile?.twitter    || '',
  })
  const [saving,    setSaving]    = useState(false)
  const [uploading, setUploading] = useState(false)

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { toast.error('Avatar must be under 2 MB'); return }
    setUploading(true)
    const { url, error } = await profileService.uploadAvatar(profile.id, file)
    if (error) {
      toast.error('Upload failed')
    } else {
      await profileService.updateProfile(profile.id, { avatar_url: url })
      await refreshProfile()
      toast.success('Avatar updated!')
    }
    setUploading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.full_name.trim()) { toast.error('Name is required'); return }
    setSaving(true)
    const { error } = await profileService.updateProfile(profile.id, form)
    if (error) {
      toast.error(error.message || 'Failed to update profile')
    } else {
      await refreshProfile()
      toast.success('Profile updated!')
    }
    setSaving(false)
  }

  return (
    <div className="section page-py max-w-2xl mx-auto ">
      <h1 className="font-display text-3xl font-bold text-ink-900 mb-8">My Profile</h1>

      <div className="card p-8 space-y-8">
        {/* Avatar */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <Avatar profile={profile} size={80} />
            <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-ink-900 hover:bg-brand-600 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow">
              <Camera size={13} className="text-white" />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
            </label>
          </div>
          <div>
            <p className="font-semibold text-ink-900">{profile?.full_name || 'Your Name'}</p>
            <p className="text-sm text-ink-500 capitalize">{profile?.role || 'reader'}</p>
            {uploading && <p className="text-xs text-brand-500 mt-1">Uploading…</p>}
          </div>
        </div>

        <div className="border-t border-ink-100" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="form-group">
            <label className="label">Full Name *</label>
            <input
              type="text"
              value={form.full_name}
              onChange={set('full_name')}
              placeholder="Jane Smith"
              className="input"
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Bio <span className="text-ink-400 font-normal">(shown on your posts)</span></label>
            <textarea
              value={form.bio}
              onChange={set('bio')}
              placeholder="Tell readers a bit about yourself…"
              rows={3}
              className="input resize-none"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="label">Website</label>
              <input
                type="url"
                value={form.website}
                onChange={set('website')}
                placeholder="https://yoursite.com"
                className="input"
              />
            </div>
            <div className="form-group">
              <label className="label">Twitter / X</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 text-sm">@</span>
                <input
                  type="text"
                  value={form.twitter}
                  onChange={set('twitter')}
                  placeholder="handle"
                  className="input pl-7"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" className="btn-primary" disabled={saving}>
              <Save size={15} /> {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
