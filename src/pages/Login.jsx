import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (isSignUp) {
      // 회원가입
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nickname },
          emailRedirectTo: undefined,
        }
      })
      if (error) setError(error.message)
      else setError('이메일을 확인해 주세요!')
    } else {
      // 로그인
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) setError('이메일 또는 비밀번호가 틀렸어요.')
    }

    setLoading(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>💑 커플 가계부</h1>
        <p style={styles.subtitle}>{isSignUp ? '회원가입' : '로그인'}</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {isSignUp && (
            <input
              style={styles.input}
              type="text"
              placeholder="닉네임"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              required
            />
          )}
          <input
            style={styles.input}
            type="email"
            placeholder="이메일"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {error && <p style={styles.error}>{error}</p>}

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? '처리 중...' : isSignUp ? '회원가입' : '로그인'}
          </button>
        </form>

        <button
          style={styles.toggle}
          onClick={() => {
            setIsSignUp(!isSignUp)
            setError('')
          }}
        >
          {isSignUp ? '이미 계정이 있어요 → 로그인' : '계정이 없어요 → 회원가입'}
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff5f7',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '380px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  title: {
    textAlign: 'center',
    fontSize: '24px',
    marginBottom: '4px',
  },
  subtitle: {
    textAlign: 'center',
    color: '#888',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #eee',
    fontSize: '15px',
    outline: 'none',
  },
  button: {
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#ff6b8a',
    color: 'white',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '4px',
  },
  toggle: {
    marginTop: '16px',
    width: '100%',
    background: 'none',
    border: 'none',
    color: '#ff6b8a',
    cursor: 'pointer',
    fontSize: '14px',
  },
  error: {
    color: '#ff6b8a',
    fontSize: '13px',
    textAlign: 'center',
  }
}