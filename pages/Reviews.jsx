import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import './Reviews.css'

const defaultReviews = [
  { name: 'សុខា គីន', rating: 5, comment: 'តែឆ្ងាញ់ណាស់ គុណភាពខ្ពស់ មិនមានជាតិគីមីទេ! ខ្ញុំចូលចិត្តតែបូបាបំផុត។', date: '១៨/០៨/២០២៦' },
  { name: 'សុភា', rating: 5, comment: 'សេវាកម្មល្អ ដឹកជញ្ជូនលឿន។ តែផ្កាកុលាបក្រអូបខ្លាំង!', date: '១២/០៨/២០២៦' },
  { name: 'ដារា', rating: 4, comment: 'ជាទូទៅល្អ គុណភាពសមរម្យ ប៉ុន្តែតម្លៃថ្លៃបន្តិច។', date: '០៩/០៨/២០២៦' },
  { name: 'សុវណ្ណារី', rating: 5, comment: 'ជាហាងតែដែលល្អបំផុតដែលខ្ញុំធ្លាប់ភ្លក់! តម្លៃសមរម្យផងដែរ។', date: '០៣/០៨/២០២៦' },
  { name: 'វិសាល', rating: 4, comment: 'តែម៉ាឆាឡាតេឆ្ងាញ់ណាស់ តែរង់ចាំយូរបន្តិចនៅម៉ោងមមាញឹក។', date: '២៨/០៧/២០២៦' },
  { name: 'ចន្ទរដ្ឋា', rating: 5, comment: 'ខ្ញុំកម្មង់ជារៀងរាល់សប្តាហ៍! គុណភាពស្ថិរភាពជានិច្ច។', date: '២០/០៧/២០២៦' },
  { name: 'សុគន្ធា', rating: 4, comment: 'តែផ្លែឈើស្រស់ល្អ។ ចង់ឲ្យមានជម្រើសទំហំកែវច្រើនជាងនេះ។', date: '១៥/០៧/២០២៦' },
  { name: 'រតនា', rating: 3, comment: 'ធម្មតា មិនអីទេ ប៉ុន្តែមិនមែនអ្វីពិសេសទេ។', date: '០៥/០៧/២០២៦' },
]

const avatarColors = ['#2e7d32', '#1b5e20', '#ff9800', '#00838f', '#6a1b9a', '#c62828', '#455a64']

function avatarColorFor(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

function loadReviews() {
  const stored = JSON.parse(localStorage.getItem('ntReviews') || 'null')
  if (stored && stored.length > 0) return stored
  localStorage.setItem('ntReviews', JSON.stringify(defaultReviews))
  return defaultReviews
}

function StarPicker({ rating, onRate }) {
  return (
    <span className="star-picker">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} onClick={() => onRate(n)} style={{ color: n <= rating ? '#ff9800' : '#ddd' }}>
          ★
        </span>
      ))}
    </span>
  )
}

export default function Reviews() {
  const { isLoggedIn, currentUser } = useAuth()
  const [reviews, setReviews] = useState(loadReviews)
  const [filter, setFilter] = useState('all')
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState({ name: '', comment: '' })
  const [rating, setRating] = useState(5)

  useEffect(() => {
    localStorage.setItem('ntReviews', JSON.stringify(reviews))
  }, [reviews])

  useEffect(() => {
    if (isLoggedIn && currentUser) {
      setForm((f) => ({ ...f, name: f.name || currentUser.split('@')[0] }))
    }
  }, [isLoggedIn, currentUser])

  const counts = useMemo(() => {
    const c = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    reviews.forEach((r) => { c[r.rating] = (c[r.rating] || 0) + 1 })
    return c
  }, [reviews])

  const total = reviews.length
  const avgRating = total ? (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1) : '0.0'
  const maxCount = Math.max(1, ...Object.values(counts))

  const filteredReviews = filter === 'all' ? reviews : reviews.filter((r) => r.rating === filter)

  function handleSubmit(e) {
    e.preventDefault()
    const name = form.name.trim()
    const comment = form.comment.trim()
    if (!name || !comment) return

    const newReview = { name, rating, comment, date: new Date().toLocaleDateString('km-KH') }
    setReviews((prev) => [newReview, ...prev])
    setForm({ name: isLoggedIn && currentUser ? currentUser.split('@')[0] : '', comment: '' })
    setRating(5)
    setFormOpen(false)
  }

  return (
    <div className="inner-section">
      <div className="reviews-hero">
        <h1>⭐ ការវាយតម្លៃអតិថិជន</h1>
        <p>ស្តាប់មតិពីអតិថិជនដែលបានសាកល្បងតែរបស់យើង និងចែករំលែកបទពិសោធរបស់អ្នកផង!</p>
      </div>

      <div className="reviews-wrap">
        <div className="reviews-summary-card">
          <div className="reviews-avg">
            <div className="reviews-avg-number">{avgRating}</div>
            <div className="reviews-avg-stars">
              {'★'.repeat(Math.round(avgRating))}
              <span style={{ color: '#ddd' }}>{'★'.repeat(5 - Math.round(avgRating))}</span>
            </div>
            <div className="reviews-avg-count">{total} ការវាយតម្លៃ</div>
          </div>
          <div className="reviews-bars">
            {[5, 4, 3, 2, 1].map((n) => (
              <div className="reviews-bar-row" key={n}>
                <span className="bar-label">{n} ★</span>
                <div className="reviews-bar-track">
                  <div
                    className="reviews-bar-fill"
                    style={{ width: `${(counts[n] / maxCount) * 100}%` }}
                  />
                </div>
                <span className="bar-count">{counts[n]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="reviews-filters">
          <div className="reviews-filter-pills">
            <button
              className={`filter-pill ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              ទាំងអស់
            </button>
            {[5, 4, 3, 2, 1].map((n) => (
              <button
                key={n}
                className={`filter-pill ${filter === n ? 'active' : ''}`}
                onClick={() => setFilter(n)}
              >
                {'★'.repeat(n)}
              </button>
            ))}
          </div>
          <button className="write-review-btn" onClick={() => setFormOpen((v) => !v)}>
            ✏️ សរសេរមតិ
          </button>
        </div>

        {formOpen && (
          <div className="review-form-card">
            <h3>ចែករំលែកមតិរបស់អ្នក</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="reviewName">ឈ្មោះ:</label>
                <input
                  type="text"
                  id="reviewName"
                  placeholder="បញ្ចូលឈ្មោះរបស់អ្នក"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>ការវាយតម្លៃ:</label>
                <StarPicker rating={rating} onRate={setRating} />
              </div>
              <div className="form-group">
                <label htmlFor="reviewComment">មតិយោបល់:</label>
                <textarea
                  id="reviewComment"
                  rows="3"
                  placeholder="សរសេរមតិរបស់អ្នកអំពីតែ ឬសេវាកម្មរបស់យើង..."
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="auth-btn">
                ផ្ញើមតិវាយតម្លៃ
              </button>
            </form>
          </div>
        )}

        <div className="review-list">
          {filteredReviews.length === 0 && (
            <div className="reviews-empty">📭 មិនទាន់មានមតិវាយតម្លៃសម្រាប់ចំណាត់ថ្នាក់នេះទេ</div>
          )}
          {filteredReviews.map((r, i) => (
            <div className="review-card" key={i}>
              <div className="review-card-top">
                <div className="review-avatar" style={{ background: avatarColorFor(r.name) }}>
                  {r.name.trim().charAt(0)}
                </div>
                <div className="review-meta">
                  <div className="review-name">{r.name}</div>
                  <div className="review-date">{r.date}</div>
                </div>
                <div className="review-card-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
              </div>
              <p className="review-comment">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
