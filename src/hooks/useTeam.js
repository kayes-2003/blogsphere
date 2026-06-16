import { useState, useEffect, useCallback } from 'react'
import { teamService } from '@/services/teamService'

export function useTeam() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    const { data, error } = await teamService.getTeam()
    if (error) setError(error.message)
    else setMembers(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { members, loading, error, refetch: fetch }
}

export function useAllTeam() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    const { data } = await teamService.getAllTeam()
    setMembers(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { members, loading, refetch: fetch }
}
