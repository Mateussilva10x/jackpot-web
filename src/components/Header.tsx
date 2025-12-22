import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header style={{ padding: 12, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <Link to="/dashboard" style={{ textDecoration: 'none', fontWeight: 'bold' }}>
          Jackpot
        </Link>
      </div>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: 12 }}>Olá, {user.name}</span>
            <button onClick={logout}>Sair</button>
          </>
        ) : (
          <Link to="/login">Entrar</Link>
        )}
      </div>
    </header>
  )
}
