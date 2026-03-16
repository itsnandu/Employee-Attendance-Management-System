import React, { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(localStorage.getItem('hr_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('hr_user')
    if (saved && token) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed && typeof parsed === 'object') setUser(parsed)
      } catch {
        localStorage.removeItem('hr_user')
      }
    }
    setLoading(false)
  }, [token])

  const login = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem('hr_user',  JSON.stringify(userData))
    localStorage.setItem('hr_token', authToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('hr_user')
    localStorage.removeItem('hr_token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}