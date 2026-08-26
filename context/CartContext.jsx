import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('ntCart') || '[]'))

  useEffect(() => {
    localStorage.setItem('ntCart', JSON.stringify(cart))
  }, [cart])

  function addToCart(name, price, img) {
    setCart((prev) => {
      const existing = prev.find((item) => item.name === name)
      if (existing) {
        return prev.map((item) =>
          item.name === name ? { ...item, qty: item.qty + 1 } : item
        )
      }
      return [...prev, { name, price, img, qty: 1 }]
    })
  }

  function changeQty(index, delta) {
    setCart((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], qty: next[index].qty + delta }
      if (next[index].qty <= 0) next.splice(index, 1)
      return next
    })
  }

  function removeFromCart(index) {
    setCart((prev) => prev.filter((_, i) => i !== index))
  }

  function clearCart() {
    setCart([])
    localStorage.removeItem('ntCart')
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const count = cart.reduce((sum, item) => sum + item.qty, 0)

  // ដាក់ការបញ្ជាទិញទៅ localStorage សម្រាប់ Admin មើល (ដូចនឹង services.html ដើម)
  function placeOrder({ name, phone, address, user }) {
    const allOrders = JSON.parse(localStorage.getItem('ntOrders') || '[]')
    const orderNum = String(allOrders.length + 1).padStart(3, '0')
    const newOrder = {
      id: '#' + orderNum,
      customer: name,
      phone,
      address,
      items: cart.map((item) => ({ name: item.name, qty: item.qty, price: item.price })),
      amount: '៛' + total.toLocaleString(),
      amountNum: total,
      status: 'pending',
      date: new Date().toLocaleDateString('km-KH'),
      user: user || '',
    }
    allOrders.push(newOrder)
    localStorage.setItem('ntOrders', JSON.stringify(allOrders))
    clearCart()
    return newOrder
  }

  return (
    <CartContext.Provider
      value={{ cart, addToCart, changeQty, removeFromCart, clearCart, total, count, placeOrder }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
