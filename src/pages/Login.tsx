import type { FormEvent } from 'react'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const [username, setUsername] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const name = username.trim()
    if (!name) return
    login(name)
  }

  return (
    <div style={{ maxWidth: 420, margin: '24px auto' }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>
            Usuário
            <input name="username" value={username} onChange={(e) => setUsername(e.target.value)} className="login-input" />
          </label>
        </div>
        <div>
          <button type="submit" disabled={!username.trim()}>Entrar</button>
        </div>
      </form>
    </div>
  )
}
