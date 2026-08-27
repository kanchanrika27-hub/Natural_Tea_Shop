import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function RequireAdmin({ children }) {
  const { isLoggedIn, userRole } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn || userRole !== 'admin') {
      alert('សូមចូលប្រើប្រាស់ជា Admin មុន!')
      navigate('/login')
    }
  }, [isLoggedIn, userRole, navigate])

  if (!isLoggedIn || userRole !== 'admin') return null
  return children
}
