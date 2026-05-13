import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  async function fetchProfile(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    setProfile(data)
    setLoading(false)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session) fetchProfile(data.session.user.id)
      else setLoading(false)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      if (newSession) fetchProfile(newSession.user.id)
      else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => authListener.subscription.unsubscribe()
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
  }

  return { session, profile, loading, signOut }
}