import { useState } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical, Upload, X, Save, Twitter, Linkedin } from 'lucide-react'
import { useAllTeam } from '@/hooks/useTeam'
import { teamService } from '@/services/teamService'
import ConfirmModal from '@/components/common/ConfirmModal'
import Spinner from '@/components/common/Spinner'
import toast from 'react-hot-toast'

const EMPTY_FORM = {
  name: '', role: '', bio: '', avatar_url: '',
  twitter: '', linkedin: '', sort_order: 0, visible: true,
}

export default function AdminTeam() {
  const { members, loading, refetch } = useAllTeam()

  const [modal,     setModal]     = useState(false)       // add/edit modal open
  const [editing,   setEditing]   = useState(null)        // member being edited (or null = new)
  const [form,      setForm]      = useState(EMPTY_FORM)
  const [saving,    setSaving]    = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleting,  setDeleting]  = useState(null)
  const [delLoad,   setDelLoad]   = useState(false)

  // ── Open modal ───────────────────────────────────────────────
  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setModal(true)
  }

  const openEdit = (member) => {
    setEditing(member)
    setForm({
      name:       member.name       || '',
      role:       member.role       || '',
      bio:        member.bio        || '',
      avatar_url: member.avatar_url || '',
      twitter:    member.twitter    || '',
      linkedin:   member.linkedin   || '',
      sort_order: member.sort_order ?? 0,
      visible:    member.visible    ?? true,
    })
    setModal(true)
  }

  const closeModal = () => { setModal(false); setEditing(null); setForm(EMPTY_FORM) }

  // ── Field change ─────────────────────────────────────────────
  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(f => ({ ...f, [field]: val }))
  }

  // ── Avatar upload ────────────────────────────────────────────
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2 MB'); return }
    setUploading(true)
    const tempId = editing?.id || `new-${Date.now()}`
    const { url, error } = await teamService.uploadAvatar(tempId, file)
    if (error) toast.error('Upload failed')
    else setForm(f => ({ ...f, avatar_url: url }))
    setUploading(false)
  }

  // ── Save ─────────────────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('Name is required'); return }
    if (!form.role.trim()) { toast.error('Role is required'); return }

    setSaving(true)
    const payload = { ...form, sort_order: Number(form.sort_order) || 0 }

    const { error } = editing
      ? await teamService.updateMember(editing.id, payload)
      : await teamService.createMember(payload)

    setSaving(false)

    if (error) { toast.error(error.message || 'Failed to save'); return }
    toast.success(editing ? 'Member updated!' : 'Member added!')
    closeModal()
    refetch()
  }

  // ── Toggle visibility ────────────────────────────────────────
  const handleToggleVisible = async (member) => {
    const { error } = await teamService.updateMember(member.id, { visible: !member.visible })
    if (error) toast.error('Failed to update')
    else { toast.success(member.visible ? 'Hidden from public' : 'Now visible'); refetch() }
  }

  // ── Delete ───────────────────────────────────────────────────
  const handleDelete = async () => {
    setDelLoad(true)
    const { error } = await teamService.deleteMember(deleting)
    setDelLoad(false)
    setDeleting(null)
    if (error) toast.error('Delete failed')
    else { toast.success('Member removed'); refetch() }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Team Members</h1>
          <p className="text-ink-500 text-sm mt-0.5">
            Manage who appears on the About page · {members.length} member{members.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={openAdd} className="btn-brand">
          <Plus size={15} /> Add Member
        </button>
      </div>

      {/* List */}
      {loading ? (
        <Spinner />
      ) : members.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-ink-400 text-sm mb-4">No team members yet.</p>
          <button onClick={openAdd} className="btn-brand btn-sm">
            <Plus size={14} /> Add first member
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ink-50 border-b border-ink-100">
              <tr>
                <th className="w-8 px-3 py-3" />
                <th className="text-left px-4 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wide">Member</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wide hidden md:table-cell">Role</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wide hidden lg:table-cell">Social</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wide hidden sm:table-cell">Order</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wide">Visible</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {members.map(member => (
                <tr key={member.id} className={`hover:bg-ink-50/40 transition-colors ${!member.visible ? 'opacity-50' : ''}`}>
                  {/* Drag handle (visual only) */}
                  <td className="px-3 py-3.5 text-ink-300">
                    <GripVertical size={14} />
                  </td>

                  {/* Avatar + name */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      {member.avatar_url ? (
                        <img src={member.avatar_url} alt={member.name}
                          className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-brand-600 font-bold text-sm">{member.name.charAt(0)}</span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-ink-900">{member.name}</p>
                        {member.bio && (
                          <p className="text-xs text-ink-400 truncate max-w-[180px]">{member.bio}</p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-3 py-3.5 text-ink-600 hidden md:table-cell">{member.role}</td>

                  {/* Social */}
                  <td className="px-3 py-3.5 hidden lg:table-cell">
                    <div className="flex gap-1.5">
                      {member.twitter && (
                        <a href={`https://twitter.com/${member.twitter}`} target="_blank" rel="noopener noreferrer"
                          className="w-6 h-6 rounded bg-ink-100 hover:bg-brand-100 flex items-center justify-center text-ink-500 hover:text-brand-600 transition-colors">
                          <Twitter size={11} />
                        </a>
                      )}
                      {member.linkedin && (
                        <a href={`https://linkedin.com/in/${member.linkedin}`} target="_blank" rel="noopener noreferrer"
                          className="w-6 h-6 rounded bg-ink-100 hover:bg-brand-100 flex items-center justify-center text-ink-500 hover:text-brand-600 transition-colors">
                          <Linkedin size={11} />
                        </a>
                      )}
                      {!member.twitter && !member.linkedin && (
                        <span className="text-xs text-ink-300">—</span>
                      )}
                    </div>
                  </td>

                  {/* Sort order */}
                  <td className="px-3 py-3.5 text-ink-500 hidden sm:table-cell">{member.sort_order}</td>

                  {/* Visible */}
                  <td className="px-3 py-3.5">
                    <button
                      onClick={() => handleToggleVisible(member)}
                      className={`badge cursor-pointer transition-colors ${
                        member.visible ? 'badge-green hover:bg-green-100' : 'badge-ink hover:bg-ink-200'
                      }`}
                    >
                      {member.visible ? 'Visible' : 'Hidden'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => handleToggleVisible(member)}
                        className="p-1.5 rounded-lg text-ink-400 hover:text-ink-700 hover:bg-ink-100 transition-colors"
                        title={member.visible ? 'Hide' : 'Show'}
                      >
                        {member.visible ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button
                        onClick={() => openEdit(member)}
                        className="p-1.5 rounded-lg text-ink-400 hover:text-ink-700 hover:bg-ink-100 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleting(member.id)}
                        className="p-1.5 rounded-lg text-ink-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl fade-up overflow-y-auto max-h-[90vh]">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-ink-100">
              <h2 className="font-display font-bold text-lg text-ink-900">
                {editing ? 'Edit Member' : 'Add Team Member'}
              </h2>
              <button onClick={closeModal} className="text-ink-400 hover:text-ink-700">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              {/* Avatar upload */}
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  {form.avatar_url ? (
                    <img src={form.avatar_url} alt="Avatar"
                      className="w-20 h-20 rounded-2xl object-cover" />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-brand-50 flex items-center justify-center">
                      <span className="font-display text-3xl font-bold text-brand-300">
                        {form.name.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                  {/* Remove avatar */}
                  {form.avatar_url && (
                    <button type="button"
                      onClick={() => setForm(f => ({ ...f, avatar_url: '' }))}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white">
                      <X size={10} />
                    </button>
                  )}
                </div>
                <div>
                  <label className="btn-outline btn-sm cursor-pointer">
                    <Upload size={13} /> {uploading ? 'Uploading…' : 'Upload photo'}
                    <input type="file" accept="image/*" className="hidden"
                      onChange={handleAvatarUpload} disabled={uploading} />
                  </label>
                  <p className="text-xs text-ink-400 mt-1.5">PNG, JPG · max 2 MB</p>
                  {/* Or paste URL */}
                  <input
                    type="url"
                    value={form.avatar_url}
                    onChange={set('avatar_url')}
                    placeholder="Or paste image URL…"
                    className="input text-xs mt-2 py-1.5"
                  />
                </div>
              </div>

              {/* Name + Role */}
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="label">Full Name *</label>
                  <input value={form.name} onChange={set('name')} placeholder="Jane Smith"
                    className="input" required />
                </div>
                <div className="form-group">
                  <label className="label">Role / Title *</label>
                  <input value={form.role} onChange={set('role')} placeholder="Head of Design"
                    className="input" required />
                </div>
              </div>

              {/* Bio */}
              <div className="form-group">
                <label className="label">Bio <span className="text-ink-400 font-normal">(short, 1–2 sentences)</span></label>
                <textarea value={form.bio} onChange={set('bio')}
                  placeholder="Passionate about making writing accessible…"
                  rows={2} className="input resize-none" />
              </div>

              {/* Social */}
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="label flex items-center gap-1"><Twitter size={13} /> Twitter handle</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 text-sm">@</span>
                    <input value={form.twitter} onChange={set('twitter')}
                      placeholder="handle" className="input pl-7" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="label flex items-center gap-1"><Linkedin size={13} /> LinkedIn slug</label>
                  <input value={form.linkedin} onChange={set('linkedin')}
                    placeholder="jane-smith" className="input" />
                </div>
              </div>

              {/* Sort order + visible */}
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="label">Sort Order <span className="text-ink-400 font-normal">(lower = first)</span></label>
                  <input type="number" value={form.sort_order} onChange={set('sort_order')}
                    min={0} className="input" />
                </div>
                <div className="form-group flex items-center gap-3 pt-7">
                  <input type="checkbox" id="visible" checked={form.visible} onChange={set('visible')}
                    className="w-4 h-4 rounded border-ink-300 text-brand-500 focus:ring-brand-400 cursor-pointer" />
                  <label htmlFor="visible" className="text-sm font-medium text-ink-700 cursor-pointer">
                    Visible on About page
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2 border-t border-ink-100">
                <button type="button" onClick={closeModal} className="btn-outline flex-1">Cancel</button>
                <button type="submit" className="btn-brand flex-1" disabled={saving}>
                  <Save size={14} /> {saving ? 'Saving…' : editing ? 'Save changes' : 'Add member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      <ConfirmModal
        isOpen={!!deleting}
        title="Remove Team Member"
        message="This will permanently remove this person from the team page."
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        loading={delLoad}
      />
    </div>
  )
}
