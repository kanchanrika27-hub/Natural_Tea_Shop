import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const [tab, setTab] = useState('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    const role = login(email, password)
    if (role === 'admin') {
      alert('ចូលប្រើប្រាស់ជា Admin ជោគជ័យ!')
    } else {
      alert('ចូលប្រើប្រាស់ជោគជ័យ!')
    }
    navigate('/')
  }

  return (
    <div className="auth-container">
      <h2>ចូលប្រើប្រាស់គណនី</h2>

      <div className="login-tabs">
        <div
          className={`login-tab ${tab === 'email' ? 'active' : ''}`}
          onClick={() => setTab('email')}
        >
          📧 ចូលតាមអ៊ីមែល
        </div>
        <div className={`login-tab ${tab === 'atm' ? 'active' : ''}`} onClick={() => setTab('atm')}>
          💳 ចូលតាមអេតមី (ATM)
        </div>
      </div>

      <div className={`tab-content ${tab === 'email' ? 'active' : ''}`}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">អាសយដ្ឋាន អ៊ីមែល (Email):</label>
            <input
              type="email"
              id="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">ពាក្យសម្ងាត់ (Password):</label>
            <input
              type="password"
              id="password"
              placeholder="បញ្ចូលពាក្យសម្ងាត់"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-btn">
            ចូលប្រើប្រាស់
          </button>
        </form>
        <div className="test-info">
          <strong>🔑 គណនីសម្រាប់សាកល្បង៖</strong>
          <br />
          • User: <code>user@gmail.com</code> | <code>123456</code>
          <br />
          • Admin: <code>admin@teashop.com</code> | <code>admin123</code>
        </div>
      </div>

      <div className={`tab-content ${tab === 'atm' ? 'active' : ''}`}>
        <div className="atm-disabled-section">
          <div className="atm-disabled-overlay">
            <span>🚫 ការចូលតាមអេតមីមិនទាន់អាចប្រើប្រាស់បានទេ</span>
          </div>
          <div className="atm-form-elements">
            <div className="form-group">
              <label htmlFor="atmBank">ជ្រើសរើសធនាគារ:</label>
              <select id="atmBank">
                <option value="">-- ជ្រើសរើសធនាគារ --</option>
                <option value="ABA">ABA Bank</option>
                <option value="ACLEDA">ACLEDA Bank</option>
                <option value="Wing">Wing Bank</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="atmCard">លេខកាតអេតមី (Card Number):</label>
              <input type="text" id="atmCard" placeholder="XXXX XXXX XXXX XXXX" maxLength="19" />
            </div>
            <div className="form-group">
              <label htmlFor="atmPin">លេខសម្ងាត់កាត (PIN):</label>
              <input type="password" id="atmPin" placeholder="បញ្ចូលលេខ PIN" maxLength="4" />
            </div>
            <button type="button" className="auth-btn" disabled>
              ចូលប្រើប្រាស់
            </button>
          </div>
        </div>
        <div className="test-info-atm">
          <strong>⚠️ ជូនដំណឹង:</strong> ការចូលតាមកាតអេតមីកំពុងតែអភិវឌ្ឍន៍ និងមិនទានងអាចប្រើប្រាស់បានទេ។ សូមចូលតាមអ៊ីមែលជំនួសវិញ។
        </div>
      </div>

      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
        មិនទាន់មានគណនីមែនទេ?{' '}
        <Link to="/register" style={{ color: '#2e7d32', fontWeight: 'bold' }}>
          ចុះឈ្មោះទីនេះ
        </Link>
      </p>
    </div>
  )
}
