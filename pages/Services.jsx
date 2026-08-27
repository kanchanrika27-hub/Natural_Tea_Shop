import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { products } from '../data/products.js'
import './Services.css'

export default function Services() {
  const { isLoggedIn, currentUser } = useAuth()
  const { cart, addToCart, changeQty, removeFromCart, total, count, placeOrder } = useCart()

  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const [checkoutName, setCheckoutName] = useState('')
  const [checkoutPhone, setCheckoutPhone] = useState('')
  const [checkoutAddress, setCheckoutAddress] = useState('')

  function showToastMsg(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  function handleAddToCart(p) {
    addToCart(p.name, p.price, p.img)
    showToastMsg(`✅ បន្ថែម "${p.name}" ទៅកន្ត្រកហើយ!`)
  }

  function handleRemove(i, name) {
    removeFromCart(i)
    showToastMsg('🗑️ លុបពីកន្ត្រកហើយ!')
  }

  function openCheckout() {
    if (!isLoggedIn) {
      showToastMsg('⚠️ សូមចូលប្រើប្រាស់មុននឹងបញ្ជាទិញ!')
      return
    }
    setCartOpen(false)
    setCheckoutName(currentUser ? currentUser.split('@')[0] : '')
    setCheckoutPhone('')
    setCheckoutAddress('')
    setCheckoutOpen(true)
  }

  function confirmCheckout() {
    const name = checkoutName.trim()
    const phone = checkoutPhone.trim()
    if (!name) {
      showToastMsg('⚠️ សូមបញ្ចូលឈ្មោះ!')
      return
    }
    if (!phone) {
      showToastMsg('⚠️ សូមបញ្ចូលលេខទូរស័ព្ទ!')
      return
    }
    const order = placeOrder({ name, phone, address: checkoutAddress.trim(), user: currentUser })
    setCheckoutOpen(false)
    setSuccessMsg(`ការបញ្ជាទិញ ${order.id} ត្រូវបានទទួលជោគជ័យ។ សរុប: ${order.amount}។ សូមអរគុណ!`)
    setSuccessOpen(true)
  }

  return (
    <div className="inner-section">
      {/* Toast */}
      <div className={`toast-cart ${toast ? 'active' : ''}`}>{toast}</div>

      {/* Floating cart button */}
      <button className="cart-float-btn" onClick={() => setCartOpen(true)}>
        🛒
        <span className="cart-badge">{count}</span>
      </button>

      {/* Cart overlay */}
      <div
        className={`cart-overlay ${cartOpen ? 'active' : ''}`}
        onClick={(e) => e.target === e.currentTarget && setCartOpen(false)}
      >
        <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
          <div className="cart-header">
            <h2>🛒 កន្ត្រកទំនិញ</h2>
            <button className="cart-close-btn" onClick={() => setCartOpen(false)}>
              ✕
            </button>
          </div>
          <div className="cart-body">
            {cart.length === 0 ? (
              <div className="cart-empty">🛒 កន្ត្រកទំនិញទទេ។ សូមជ្រើសរើសផលិតផលមុន!</div>
            ) : (
              cart.map((item, i) => (
                <div className="cart-item" key={item.name}>
                  <img src={item.img} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p>៛{item.price.toLocaleString()} / ពែង</p>
                  </div>
                  <div className="cart-item-qty">
                    <button className="qty-btn" onClick={() => changeQty(i, -1)}>
                      −
                    </button>
                    <span className="qty-num">{item.qty}</span>
                    <button className="qty-btn" onClick={() => changeQty(i, 1)}>
                      +
                    </button>
                  </div>
                  <span className="cart-item-price">៛{(item.price * item.qty).toLocaleString()}</span>
                  <button className="cart-item-remove" onClick={() => handleRemove(i, item.name)}>
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
          {cart.length > 0 && (
            <div className="cart-footer">
              <div className="cart-total">
                <span className="cart-total-label">សរុបសរុប:</span>
                <span className="cart-total-amount">៛{total.toLocaleString()}</span>
              </div>
              {!isLoggedIn && (
                <div className="login-required">
                  ⚠️ សូម <Link to="/login">ចូលប្រើប្រាស់</Link> មុននឹងបញ្ជាទិញ!
                </div>
              )}
              <button className="checkout-btn" disabled={!isLoggedIn} onClick={openCheckout}>
                ✅ បញ្ជាក់ការបញ្ជាទិញ
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Checkout overlay */}
      <div className={`checkout-overlay ${checkoutOpen ? 'active' : ''}`}>
        <div className="checkout-box">
          <h2>📋 បញ្ជាក់ការបញ្ជាទិញ</h2>
          <div className="checkout-summary">
            {cart.map((item) => (
              <div className="checkout-summary-item" key={item.name}>
                <span>
                  {item.name} × {item.qty}
                </span>
                <span>៛{(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
            <div className="checkout-summary-total">
              <span>សរុប:</span>
              <span>៛{total.toLocaleString()}</span>
            </div>
          </div>
          <div className="checkout-form-group">
            <label>ឈ្មោះអតិថិជន:</label>
            <input
              type="text"
              placeholder="បញ្ចូលឈ្មោះរបស់អ្នក"
              value={checkoutName}
              onChange={(e) => setCheckoutName(e.target.value)}
            />
          </div>
          <div className="checkout-form-group">
            <label>លេខទូរស័ព្ទ:</label>
            <input
              type="tel"
              placeholder="0XX XXX XXX"
              value={checkoutPhone}
              onChange={(e) => setCheckoutPhone(e.target.value)}
            />
          </div>
          <div className="checkout-form-group">
            <label>អាសយដ្ឋានសំរង់:</label>
            <textarea
              rows="2"
              placeholder="អាសយដ្ឋានសំរង់របស់អ្នក"
              value={checkoutAddress}
              onChange={(e) => setCheckoutAddress(e.target.value)}
            />
          </div>
          <div className="checkout-btns">
            <button className="checkout-confirm-btn" onClick={confirmCheckout}>
              ✅ បញ្ជាទិញឥឡូវ
            </button>
            <button className="checkout-cancel-btn" onClick={() => setCheckoutOpen(false)}>
              បោះបង់
            </button>
          </div>
        </div>
      </div>

      {/* Success overlay */}
      <div className={`success-overlay ${successOpen ? 'active' : ''}`}>
        <div className="success-box">
          <div className="success-icon">🎉</div>
          <h2>បញ្ជាទិញជោគជ័យ!</h2>
          <p>{successMsg}</p>
          <button onClick={() => setSuccessOpen(false)}>👌 យល់ព្រម</button>
        </div>
      </div>

      <h2 className="section-title">តម្លៃ និងបញ្ជី</h2>
      <div className="menu-grid">
        {products.map((p) => (
          <div className="menu-item" key={p.name}>
            <img src={p.img} alt={p.name} className="item-img" />
            <h3 style={{ color: '#2e7d32' }}>
              {p.name} {p.isNew && <span className="new-badge">ថ្មី</span>}
            </h3>
            <p>{p.desc}</p>
            <p className="price">៛{p.price.toLocaleString()}</p>
            <button className="order-btn" onClick={() => handleAddToCart(p)}>
              🛒 បញ្ជាទិញឥឡូវ
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
