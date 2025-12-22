import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../contexts/AuthContext'

export default function PrivateLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />

  return (
    <div>
      <Header />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ padding: 12, flex: 1 }}>{children}</main>
      </div>
    </div>
  )
}
