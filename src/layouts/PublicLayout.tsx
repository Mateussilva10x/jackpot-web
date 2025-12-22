import type { ReactNode } from 'react'
import Header from '../components/Header'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      <main style={{ padding: 12 }}>{children}</main>
    </div>
  )
}
