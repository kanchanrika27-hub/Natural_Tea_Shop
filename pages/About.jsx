export default function About() {
  return (
    <div className="inner-section">
      <h2 className="section-title">អំពីយើង</h2>
      <div className="about-card">
        <img src={`${import.meta.env.BASE_URL}images/about-tea.jpg`} alt="About Us" className="about-img" />
        <p style={{ marginTop: '20px', fontSize: '1.1rem', lineHeight: 1.8, color: '#4f5d4f' }}>
          ហាងតែធម្មជាតិរបស់យើង ត្រូវបានបង្កើតឡើងក្នុងឆ្នាំ ២០២០ ដោយក្រុមគ្រួសារមួយដែលមានចំណង់ចំណូលចិត្តក្នុងការផលិតតែគុណភាពខ្ពស់។
          យើងជ្រើសរើសគ្រឿងសម្ភារៈពីស្រែចំការក្នុងស្រុក និងបរិស្ថានធម្មជាតិ ដែលមិនមានជាតិគីមីឡើយ។
          គោលបំណងរបស់យើងគឺផ្តល់ជូនអតិថិជននូវតែដែលស្អាត មានគុណភាព និងមានសុខភាព។
        </p>
      </div>
    </div>
  )
}
