import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import './AdminDashboard.css'

const defaultProducts = [
  { id: 'p1', name: 'តែទឹកឃ្មុំល្មុង', price: '៛8,000', priceNum: 8000, sold: 45, img: '/images/honey-lemon.jpg' },
  { id: 'p2', name: 'តែផ្កាម្រេច', price: '៛7,000', priceNum: 7000, sold: 38, img: '/images/jasmine-tea.jpg' },
  { id: 'p3', name: 'តែបូបា', price: '៛10,000', priceNum: 10000, sold: 72, img: '/images/boba-tea.jpg' },
  { id: 'p4', name: 'តែផ្លែឈើ', price: '៛9,000', priceNum: 9000, sold: 28, img: '/images/fruit-tea.jpg' },
  { id: 'p5', name: 'តែបន្សំ', price: '៛12,000', priceNum: 12000, sold: 20, img: '/images/herbal-detox.jpg' },
  { id: 'p6', name: 'តែបៃតង', price: '៛6,500', priceNum: 6500, sold: 55, img: '/images/green-tea.jpg' },
  { id: 'p7', name: 'តែទឹកដោះគោ', price: '៛8,500', priceNum: 8500, sold: 62, img: '/images/milk-tea.jpg' },
  { id: 'p8', name: 'តែស្វាយ', price: '៛9,500', priceNum: 9500, sold: 33, img: '/images/mango-tea.jpg' },
  { id: 'p9', name: 'ម៉ាឆាឡាតេ', price: '៛11,000', priceNum: 11000, sold: 41, img: '/images/matcha-latte.jpg' },
  { id: 'p10', name: 'តែផ្ការ័សី', price: '៛10,500', priceNum: 10500, sold: 18, img: '/images/rose-tea.jpg' },
]

const defaultOrders = [
  { id: '#001', customer: 'សុខា', amount: '៛25,000', amountNum: 25000, status: 'active', date: '១៥/០៨/២០២៦', items: [{ name: 'តែបូបា', qty: 2, price: 10000 }, { name: 'តែផ្កាម្រេច', qty: 1, price: 7000 }], user: 'user@gmail.com' },
  { id: '#002', customer: 'វណ្ណៈ', amount: '៛18,000', amountNum: 18000, status: 'completed', date: '១៤/០៨/២០២៦', items: [{ name: 'តែបន្សំ', qty: 1, price: 12000 }, { name: 'តែទឹកឃ្មុំល្មុង', qty: 1, price: 8000 }], user: 'user@gmail.com' },
  { id: '#003', customer: 'ចន្ទា', amount: '៛32,000', amountNum: 32000, status: 'pending', date: '១៦/០៨/២០២៦', items: [{ name: 'ម៉ាឆាឡាតេ', qty: 2, price: 11000 }, { name: 'តែផ្លែឈើ', qty: 1, price: 9000 }], user: 'user@gmail.com' },
]

const statusLabels = { active: 'កំពុងដំណើរការ', pending: 'រង់ចាំ', completed: 'រួចរាល់' }
const statusClasses = { active: 'status-active', pending: 'status-pending', completed: 'status-completed' }

function loadOrders() {
  const customerOrders = JSON.parse(localStorage.getItem('ntOrders') || '[]')
  if (customerOrders.length === 0 && !localStorage.getItem('ntOrdersInit')) {
    localStorage.setItem('ntOrdersInit', 'true')
    localStorage.setItem('ntOrders', JSON.stringify(defaultOrders))
    return defaultOrders
  }
  return customerOrders
}

export default function AdminDashboard() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const [products, setProducts] = useState(
    () => JSON.parse(localStorage.getItem('ntProducts') || 'null') || defaultProducts
  )
  const [orders, setOrders] = useState(loadOrders)
  const [toast, setToast] = useState('')

  // modal state
  const [editOrderIndex, setEditOrderIndex] = useState(-1)
  const [editOrderForm, setEditOrderForm] = useState({ customer: '', amount: '', status: 'pending' })

  const [editProductIndex, setEditProductIndex] = useState(-1)
  const [editProductForm, setEditProductForm] = useState({ name: '', price: '', sold: 0, img: '' })

  const [viewOrderIndex, setViewOrderIndex] = useState(-1)

  const [confirmDelete, setConfirmDelete] = useState({ open: false, type: '', index: -1, msg: '' })

  const [addProductOpen, setAddProductOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({ name: '', price: '', img: '/images/boba-tea.jpg' })

  useEffect(() => {
    localStorage.setItem('ntProducts', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    localStorage.setItem('ntOrders', JSON.stringify(orders))
  }, [orders])

  function showToastMsg(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const stats = useMemo(() => {
    const pending = orders.filter((o) => o.status === 'pending').length
    const completed = orders.filter((o) => o.status === 'completed').length
    const revenue = orders
      .filter((o) => o.status === 'completed')
      .reduce((sum, o) => sum + (o.amountNum || 0), 0)
    const revenueLabel = revenue >= 1000000 ? '៛' + (revenue / 1000000).toFixed(1) + 'M' : '៛' + revenue.toLocaleString()
    return { pending, completed, revenueLabel, totalOrders: orders.length }
  }, [orders])

  // ===== Orders =====
  function openViewOrder(i) {
    setViewOrderIndex(i)
  }
  function closeViewOrder() {
    setViewOrderIndex(-1)
  }

  function openEditOrder(i) {
    const o = orders[i]
    setEditOrderForm({ customer: o.customer, amount: o.amount, status: o.status })
    setEditOrderIndex(i)
  }
  function saveOrderEdit() {
    if (editOrderIndex < 0) return
    setOrders((prev) => {
      const next = [...prev]
      next[editOrderIndex] = { ...next[editOrderIndex], ...editOrderForm }
      return next
    })
    setEditOrderIndex(-1)
    showToastMsg('✅ កែប្រែការបញ្ជាទិញជោគជ័យ!')
  }

  function requestDeleteOrder(i) {
    const o = orders[i]
    setConfirmDelete({
      open: true,
      type: 'order',
      index: i,
      msg: `តើអ្នកពិតជាចង់លុបការបញ្ជាទិញ ${o.id} (${o.customer}) មែនទេ?`,
    })
  }

  // ===== Products =====
  function openEditProduct(i) {
    const p = products[i]
    setEditProductForm({ name: p.name, price: p.price, sold: p.sold, img: p.img })
    setEditProductIndex(i)
  }
  function saveProductEdit() {
    if (editProductIndex < 0) return
    setProducts((prev) => {
      const next = [...prev]
      next[editProductIndex] = {
        ...next[editProductIndex],
        name: editProductForm.name,
        price: editProductForm.price,
        sold: parseInt(editProductForm.sold) || 0,
        img: editProductForm.img,
      }
      return next
    })
    setEditProductIndex(-1)
    showToastMsg('✅ កែប្រែផលិតផលជោគជ័យ!')
  }

  function requestDeleteProduct(i) {
    setConfirmDelete({
      open: true,
      type: 'product',
      index: i,
      msg: `តើអ្នកពិតជាចង់លុបផលិតផល "${products[i].name}" មែនទេ?`,
    })
  }

  function addNewProduct() {
    const name = newProduct.name.trim()
    const priceNum = parseInt(newProduct.price) || 0
    const img = newProduct.img.trim() || '/images/boba-tea.jpg'

    if (!name || priceNum <= 0) {
      showToastMsg('⚠️ សូមបញ្ចូលឈ្មោះ និងតម្លៃឲ្យបានត្រឹមត្រូវ!')
      return
    }

    const newId = 'p' + (products.length + 1)
    const price = '៛' + priceNum.toLocaleString()
    setProducts((prev) => [...prev, { id: newId, name, price, priceNum, sold: 0, img }])
    setNewProduct({ name: '', price: '', img: '/images/boba-tea.jpg' })
    setAddProductOpen(false)
    showToastMsg(`✅ បន្ថែមផលិតផល "${name}" ជោគជ័យ!`)
  }

  // ===== Confirm delete =====
  function confirmDeleteYes() {
    if (confirmDelete.type === 'order' && confirmDelete.index >= 0) {
      setOrders((prev) => prev.filter((_, i) => i !== confirmDelete.index))
      showToastMsg('🗑️ លុបការបញ្ជាទិញជោគជ័យ!')
    } else if (confirmDelete.type === 'product' && confirmDelete.index >= 0) {
      setProducts((prev) => prev.filter((_, i) => i !== confirmDelete.index))
      showToastMsg('🗑️ លុបផលិតផលជោគជ័យ!')
    }
    setConfirmDelete({ open: false, type: '', index: -1, msg: '' })
  }

  function handleLogout(e) {
    e.preventDefault()
    logout()
    alert('ចាកចេញជោគជ័យ!')
    navigate('/login')
  }

  const viewedOrder = viewOrderIndex >= 0 ? orders[viewOrderIndex] : null

  return (
    <div className="admin-wrapper">
      <div className={`toast ${toast ? 'active' : ''}`}>{toast}</div>

      {/* Edit order modal */}
      <div className={`modal-overlay ${editOrderIndex >= 0 ? 'active' : ''}`}>
        <div className="modal-box">
          <h2>✏️ កែប្រែការបញ្ជាទិញ</h2>
          <div className="form-group">
            <label>លេខការបញ្ជាទិញ:</label>
            <input type="text" readOnly style={{ background: '#f5f5f5' }} value={editOrderIndex >= 0 ? orders[editOrderIndex]?.id : ''} />
          </div>
          <div className="form-group">
            <label>ឈ្មោះអតិថិជន:</label>
            <input
              type="text"
              value={editOrderForm.customer}
              onChange={(e) => setEditOrderForm({ ...editOrderForm, customer: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>ទឹកប្រាក់:</label>
            <input
              type="text"
              value={editOrderForm.amount}
              onChange={(e) => setEditOrderForm({ ...editOrderForm, amount: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>ស្ថានភាព:</label>
            <select
              value={editOrderForm.status}
              onChange={(e) => setEditOrderForm({ ...editOrderForm, status: e.target.value })}
            >
              <option value="active">កំពុងដំណើរការ</option>
              <option value="pending">រង់ចាំ</option>
              <option value="completed">រួចរាល់</option>
            </select>
          </div>
          <div className="modal-btns">
            <button className="btn-save" onClick={saveOrderEdit}>
              💾 រក្សាទុក
            </button>
            <button className="btn-cancel" onClick={() => setEditOrderIndex(-1)}>
              បោះបង់
            </button>
          </div>
        </div>
      </div>

      {/* Edit product modal */}
      <div className={`modal-overlay ${editProductIndex >= 0 ? 'active' : ''}`}>
        <div className="modal-box">
          <h2>✏️ កែប្រែផលិតផល</h2>
          <div className="form-group">
            <label>ឈ្មោះផលិតផល:</label>
            <input
              type="text"
              value={editProductForm.name}
              onChange={(e) => setEditProductForm({ ...editProductForm, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>តម្លៃ:</label>
            <input
              type="text"
              value={editProductForm.price}
              onChange={(e) => setEditProductForm({ ...editProductForm, price: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>ចំនួនលក់បាន:</label>
            <input
              type="number"
              value={editProductForm.sold}
              onChange={(e) => setEditProductForm({ ...editProductForm, sold: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>រូបភាព (URL):</label>
            <input
              type="text"
              placeholder="images/xxx.jpg"
              value={editProductForm.img}
              onChange={(e) => setEditProductForm({ ...editProductForm, img: e.target.value })}
            />
          </div>
          <div className="modal-btns">
            <button className="btn-save" onClick={saveProductEdit}>
              💾 រក្សាទុក
            </button>
            <button className="btn-cancel" onClick={() => setEditProductIndex(-1)}>
              បោះបង់
            </button>
          </div>
        </div>
      </div>

      {/* Confirm delete */}
      <div className={`confirm-overlay ${confirmDelete.open ? 'active' : ''}`}>
        <div className="confirm-box">
          <div className="confirm-icon">⚠️</div>
          <h3>បញ្ជាក់ការលុប</h3>
          <p>{confirmDelete.msg || 'តើអ្នកពិតជាចង់លុបមែនទេ?'}</p>
          <div className="confirm-btns">
            <button style={{ background: '#c62828', color: 'white' }} onClick={confirmDeleteYes}>
              🗑️ លុប
            </button>
            <button
              style={{ background: '#757575', color: 'white' }}
              onClick={() => setConfirmDelete({ open: false, type: '', index: -1, msg: '' })}
            >
              បោះបង់
            </button>
          </div>
        </div>
      </div>

      {/* Order detail */}
      <div className={`order-detail-overlay ${viewedOrder ? 'active' : ''}`}>
        <div className="order-detail-box">
          <h2>📋 លម្អិតការបញ្ជាទិញ</h2>
          {viewedOrder && (
            <div>
              <div className="detail-row">
                <span className="detail-label">លេខការបញ្ជាទិញ:</span>
                <span className="detail-value">{viewedOrder.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">អតិថិជន:</span>
                <span className="detail-value">{viewedOrder.customer}</span>
              </div>
              {viewedOrder.phone && (
                <div className="detail-row">
                  <span className="detail-label">ទូរស័ព្ទ:</span>
                  <span className="detail-value">{viewedOrder.phone}</span>
                </div>
              )}
              {viewedOrder.address && (
                <div className="detail-row">
                  <span className="detail-label">អាសយដ្ឋាន:</span>
                  <span className="detail-value">{viewedOrder.address}</span>
                </div>
              )}
              <div className="detail-row">
                <span className="detail-label">កាលបរិច្ឆេទ:</span>
                <span className="detail-value">{viewedOrder.date || '-'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">ស្ថានភាព:</span>
                <span className={`status-badge ${statusClasses[viewedOrder.status] || 'status-pending'}`}>
                  {statusLabels[viewedOrder.status] || viewedOrder.status}
                </span>
              </div>
              {viewedOrder.items?.length > 0 && (
                <>
                  <h3 style={{ color: '#2e7d32', marginTop: '15px', marginBottom: '8px', fontSize: '0.95rem' }}>
                    📦 ទំនិញ:
                  </h3>
                  <table className="detail-items-table">
                    <thead>
                      <tr>
                        <th>ឈ្មោះ</th>
                        <th>ចំនួន</th>
                        <th>តម្លៃ</th>
                        <th>សរុប</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewedOrder.items.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.name}</td>
                          <td>{item.qty}</td>
                          <td>៛{item.price.toLocaleString()}</td>
                          <td>៛{(item.price * item.qty).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
              <div style={{ marginTop: '15px', padding: '12px', background: '#e8f5e9', borderRadius: '8px', textAlign: 'center' }}>
                <strong style={{ fontSize: '1.2rem', color: '#1b5e20' }}>សរុប: {viewedOrder.amount}</strong>
              </div>
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              style={{ background: '#757575', color: 'white', padding: '10px 25px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
              onClick={closeViewOrder}
            >
              បិទ
            </button>
          </div>
        </div>
      </div>

      <div className="admin-header-bar">
        <h1>📋 ផ្ទាំងគ្រប់គ្រង</h1>
        <div className="admin-actions">
          <span className="admin-user-badge">👤 {currentUser ? currentUser.split('@')[0] : 'Admin'}</span>
          <a href="/" className="admin-back-btn">
            🏠 ត្រឡប់ទំព័រដើម
          </a>
          <button className="admin-logout-btn" onClick={handleLogout}>
            🚪 ចាកចេញ
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🍵</div>
          <div className="stat-number">{products.length}</div>
          <div className="stat-label">ផលិតផលសរុប</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-number">{stats.totalOrders}</div>
          <div className="stat-label">ការបញ្ជាទិញ</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-label">រង់ចាំ</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-number">{stats.completed}</div>
          <div className="stat-label">រួចរាល់</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-number">{stats.revenueLabel}</div>
          <div className="stat-label">ប្រាក់ចំណូលសរុប</div>
        </div>
      </div>

      <div className="admin-section-grid">
        <div className="admin-card">
          <div className="admin-card-header">
            🛒 ការបញ្ជាទិញថ្មីៗ
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 12px', borderRadius: '12px', fontSize: '0.8rem' }}>
              {orders.length} ការបញ្ជាទិញ
            </span>
          </div>
          <div className="admin-card-body">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>លេខ</th>
                  <th>អតិថិជន</th>
                  <th>ទឹកប្រាក់</th>
                  <th>ស្ថានភាព</th>
                  <th>សកម្មភាព</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.customer}</td>
                    <td>{o.amount}</td>
                    <td>
                      <span className={`status-badge ${statusClasses[o.status] || 'status-pending'}`}>
                        {statusLabels[o.status] || o.status}
                      </span>
                    </td>
                    <td>
                      <button className="admin-btn-sm btn-view" onClick={() => openViewOrder(i)}>
                        👁️
                      </button>
                      <button className="admin-btn-sm btn-edit" onClick={() => openEditOrder(i)}>
                        ✏️
                      </button>
                      <button className="admin-btn-sm btn-delete" onClick={() => requestDeleteOrder(i)}>
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>📭 មិនទាន់មានការបញ្ជាទិញទេ</div>
            )}
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            🍵 ផលិតផល
            <button className="add-btn" onClick={() => setAddProductOpen((v) => !v)}>
              ➕ បន្ថែមថ្មី
            </button>
          </div>
          <div className="admin-card-body">
            {addProductOpen && (
              <div className="add-product-form" style={{ display: 'flex' }}>
                <div className="form-group">
                  <label>ឈ្មោះ:</label>
                  <input
                    type="text"
                    placeholder="ឈ្មោះផលិតផល"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>តម្លៃ (៛):</label>
                  <input
                    type="number"
                    placeholder="8000"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>រូបភាព:</label>
                  <input
                    type="text"
                    placeholder="images/xxx.jpg"
                    value={newProduct.img}
                    onChange={(e) => setNewProduct({ ...newProduct, img: e.target.value })}
                  />
                </div>
                <button onClick={addNewProduct}>➕ បន្ថែម</button>
              </div>
            )}
            <div>
              {products.map((p, i) => (
                <div className="product-list-item" key={p.id}>
                  <img src={p.img} alt={p.name} className="product-thumb" />
                  <div className="product-info">
                    <h4>{p.name}</h4>
                    <p>លក់បាន {p.sold} ពែង</p>
                  </div>
                  <span className="product-price-admin">{p.price}</span>
                  <div className="product-btns">
                    <button className="admin-btn-sm btn-edit" onClick={() => openEditProduct(i)}>
                      ✏️
                    </button>
                    <button className="admin-btn-sm btn-delete" onClick={() => requestDeleteProduct(i)}>
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
