import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem('isLoggedIn') === 'true'
  )
  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole') || '')
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('currentUser') || '')

  // ចូលប្រើប្រាស់ (ដូចនឹង login.html)
  function login(email, password) {
    const role = email === 'admin@teashop.com' && password === 'admin123' ? 'admin' : 'user'
    localStorage.setItem('userRole', role)
    localStorage.setItem('currentUser', email)
    localStorage.setItem('isLoggedIn', 'true')
    setUserRole(role)
    setCurrentUser(email)
    setIsLoggedIn(true)
    return role
  }

  // ចាកចេញ
  function logout() {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userRole')
    localStorage.removeItem('currentUser')
    setIsLoggedIn(false)
    setUserRole('')
    setCurrentUser('')
  }

  useEffect(() => {
    // keep state in sync if localStorage changes from another tab
    function onStorage() {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true')
      setUserRole(localStorage.getItem('userRole') || '')
      setCurrentUser(localStorage.getItem('currentUser') || '')
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
