// src/App.jsx
import React from 'react'
import { AuthProvider } from './context/AuthContext'
import useAuth from './hooks/useAuth'
import Login from './pages/Login'
import AppRoutes from './routes/AppRoutes'
import EmpRoutes from './routes/EmpRoutes'

function Inner() {
  const { user, loading } = useAuth()

  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)',
    }}>
      <div style={{
        width: 40, height: 40, border: '3px solid var(--border)',
        borderTopColor: 'var(--primary)', borderRadius: '50%',
        animation: 'spin .7s linear infinite',
      }}/>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  if (!user) return <Login />
  if (user.role === 'employee') return <EmpRoutes />
  return <AppRoutes />
}

export default function App() {
  return <AuthProvider><Inner /></AuthProvider>
}