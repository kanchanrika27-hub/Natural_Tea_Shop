import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-text">
        <h1>
          ស្វាគមន៍មកកាន់
          <br />
          ហាងតែធម្មជាតិ
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#4f5d4f', marginTop: '15px' }}>
          រីករម្យន៍ការទទួលទានតែថ្លៃថ្លាដែលមានគុណភាពខ្ពស់ និងបរិស្ថានធម្មជាតិ ដែលមិនមានជាតិគីមីឡើយ។
        </p>
        <Link to="/services" className="btn">
          មើលបញ្ជីតម្លៃ
        </Link>
      </div>
      <div className="home-image">
        <img src="/images/home-tea.jpg" alt="Natural Tea" className="featured-img" />
      </div>
    </div>
  )
}
