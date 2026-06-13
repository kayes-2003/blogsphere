import { supabase } from './supabase'

export const profileService = {
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  },

  async uploadAvatar(userId, file) {
    const ext      = file.name.split('.').pop()
    const fileName = `avatars/${userId}.${ext}`

    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { cacheControl: '3600', upsert: true })

    if (error) return { url: null, error }

    const { data } = supabase.storage.from('avatars').getPublicUrl(fileName)
    return { url: `${data.publicUrl}?t=${Date.now()}`, error: null }
  },
}
