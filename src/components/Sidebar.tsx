import { Link } from 'react-router-dom'

export default function Sidebar() {
  return (
    <aside style={{ width: 220, borderRight: '1px solid #eee', padding: 12 }}>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/app/bets">Bets</Link>
        <Link to="/app/ranking">Ranking</Link>
        <Link to="/admin">Admin</Link>
      </nav>
    </aside>
  )
}
