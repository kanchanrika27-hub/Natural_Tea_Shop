import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const navigate = useNavigate()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    const users = JSON.parse(localStorage.getItem('ntUsers') || '[]')
    users.push({ name: form.name, email: form.email, password: form.password })
    localStorage.setItem('ntUsers', JSON.stringify(users))
    alert('ចុះឈ្មោះជោគជ័យ! សូមចូលប្រើប្រាស់។')
    navigate('/login')
  }

  return (
    <div className="auth-container">
      <h2>ចុះឈ្មោះគណនីថ្មី</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">ឈ្មោះ:</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="បញ្ចូលឈ្មោះរបស់អ្នក"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="regEmail">អាសយដ្ឋាន អ៊ីមែល (Email):</label>
          <input
            type="email"
            id="regEmail"
            name="email"
            placeholder="example@email.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="regPassword">ពាក្យសម្ងាត់ (Password):</label>
          <input
            type="password"
            id="regPassword"
            name="password"
            placeholder="បញ្ចូលពាក្យសម្ងាត់"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="auth-btn">
          ចុះឈ្មោះ
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
        មានគណនីរួចហើយ?{' '}
        <Link to="/login" style={{ color: '#2e7d32', fontWeight: 'bold' }}>
          ចូលប្រើប្រាស់ទីនេះ
        </Link>
      </p>
    </div>
  )
}
