import { supabase } from './supabase'

export const teamService = {
  /** All visible team members, sorted */
  async getTeam() {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('visible', true)
      .order('sort_order', { ascending: true })
    return { data, error }
  },

  /** Admin: get all (including hidden) */
  async getAllTeam() {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('sort_order', { ascending: true })
    return { data, error }
  },

  async createMember(member) {
    const { data, error } = await supabase
      .from('team_members')
      .insert(member)
      .select()
      .single()
    return { data, error }
  },

  async updateMember(id, updates) {
    const { data, error } = await supabase
      .from('team_members')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async deleteMember(id) {
    const { error } = await supabase.from('team_members').delete().eq('id', id)
    return { error }
  },

  async uploadAvatar(memberId, file) {
    const ext      = file.name.split('.').pop()
    const fileName = `team/${memberId}-${Date.now()}.${ext}`
    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { cacheControl: '3600', upsert: true })
    if (error) return { url: null, error }
    const { data } = supabase.storage.from('avatars').getPublicUrl(fileName)
    return { url: data.publicUrl, error: null }
  },
}
