import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Home() {
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div>
      <h1>홈</h1>
      <button onClick={handleLogout}>로그아웃</button>
    </div>
  )
}