import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { isLoggedIn, userRole, currentUser, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout(e) {
    e.preventDefault()
    logout()
    alert('ចាកចេញជោគជ័យ!')
    navigate('/login')
  }

  const linkClass = ({ isActive }) => (isActive ? 'active' : undefined)

  return (
    <header>
      <nav className="nav-container">
        <NavLink to="/" className="logo">
          ហាងតែធម្មជាតិ
        </NavLink>
        <ul className="nav-menu">
          <li>
            <NavLink to="/" className={linkClass} end>
              HOME
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={linkClass}>
              ABOUT
            </NavLink>
          </li>
          <li>
            <NavLink to="/services" className={linkClass}>
              PRICE AND MENU
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={linkClass}>
              CONTACT
            </NavLink>
          </li>
          <li>
            <NavLink to="/reviews" className={linkClass}>
              REVIEWS
            </NavLink>
          </li>

          {!isLoggedIn && (
            <li>
              <NavLink to="/login" className="nav-login-btn">
                ចូលប្រើប្រាស់
              </NavLink>
            </li>
          )}

          {isLoggedIn && (
            <li style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <span className="nav-user-info">{currentUser ? currentUser.split('@')[0] : ''}</span>
              <a href="#" className="nav-logout-btn" onClick={handleLogout}>
                ចាកចេញ
              </a>
            </li>
          )}

          {isLoggedIn && userRole === 'admin' && (
            <li>
              <NavLink to="/admin" className="nav-login-btn" style={{ backgroundColor: '#1b5e20' }}>
                Admin
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}
