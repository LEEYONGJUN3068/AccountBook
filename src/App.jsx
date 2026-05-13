import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import Home from './pages/Home'
import Personal from './pages/Personal'
import Fixed from './pages/Fixed'

function App() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // 로딩 중
  if (session === undefined) return <div>로딩 중...</div>

  return (
    <BrowserRouter>
      <Routes>
        {/* 로그인 안 했으면 무조건 /login으로 */}
        <Route path="/login" element={
          session ? <Navigate to="/" /> : <Login />
        } />

        {/* 로그인 했을 때만 접근 가능 */}
        <Route path="/" element={
          session ? <Home /> : <Navigate to="/login" />
        } />
        <Route path="/personal" element={
          session ? <Personal /> : <Navigate to="/login" />
        } />
        <Route path="/fixed" element={
          session ? <Fixed /> : <Navigate to="/login" />
        } />

        {/* 없는 경로는 홈으로 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App