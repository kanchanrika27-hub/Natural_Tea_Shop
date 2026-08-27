import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    alert('សាររបស់អ្នកត្រូវបានផ្ញើដោយជោគជ័យ! សូមអរគុណ។')
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <div className="inner-section">
      <h2 className="section-title">ទំនាក់ទំនង</h2>
      <div className="contact-wrapper">
        <div className="contact-info">
          <h3 style={{ color: '#2e7d32', marginBottom: '15px', fontFamily: "'Moul', cursive" }}>
            ព័ត៌មានទំនាក់ទំនង
          </h3>
          <p>📍 អាសយដ្ឋាន: ភ្នំពេញ ខេមរភូមិន្ទ</p>
          <p>📞 ទូរស័ព្ទ: +855 12 345 678</p>
          <p>📧 អ៊ីមែល: info@naturalteashop.com</p>
          <p>⏰ ម៉ោងបើក: ថ្ងៃច័ន្ទ - ថ្ងៃអាទិត្យ (7:00 - 21:00)</p>
        </div>
        <div className="contact-form">
          <h3 style={{ color: '#2e7d32', marginBottom: '15px', fontFamily: "'Moul', cursive" }}>
            ផ្ញើសារមកយើង
          </h3>
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
              <label htmlFor="cemail">អ៊ីមែល:</label>
              <input
                type="email"
                id="cemail"
                name="email"
                placeholder="example@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="cmsg">សារ:</label>
              <textarea
                id="cmsg"
                name="message"
                rows="4"
                placeholder="សរសេរសាររបស់អ្នកទីនេះ..."
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="auth-btn">
              ផ្ញើសារ
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
