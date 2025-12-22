import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import PublicLayout from './layouts/PublicLayout'
import PrivateLayout from './layouts/PrivateLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import AppBets from './pages/app/Bets'
import AppRanking from './pages/app/Ranking'
import { DesignSystemPage } from './pages/DesignSystemPage'
import './styles/App.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
          <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />

          <Route path="/dashboard" element={<PrivateLayout><Dashboard /></PrivateLayout>} />
          <Route path="/app/bets" element={<PrivateLayout><AppBets /></PrivateLayout>} />
          <Route path="/app/ranking" element={<PrivateLayout><AppRanking /></PrivateLayout>} />
          <Route path="/admin" element={<PrivateLayout><Admin /></PrivateLayout>} />

          <Route path="/design-system" element={<PublicLayout><DesignSystemPage /></PublicLayout>} />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
;
