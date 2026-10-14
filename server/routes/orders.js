import express from 'express'
import db from '../db.js'
import { optionalAuth, requireAuth } from '../middleware/auth.js'

const router = express.Router()

function generateOrderId() {
  const chars = '0123456789'
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `SB-${Date.now().toString().slice(-4)}${code}`
}

// POST /api/orders - place an order
router.post('/', optionalAuth, (req, res) => {
  const {
    items = [],
    subtotal,
    discountAmount = 0,
    deliveryFee = 0,
    total,
    promoCode = '',
    customerName = '',
    contact = '',
    hostelAddress = '',
    paymentMethod = 'COD',
  } = req.body

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain at least one item' })
  }

  const orderId = generateOrderId()
  const userId = req.user ? req.user.id : null

  try {
    const createOrderTransaction = db.transaction(() => {
      // 1. Insert order record
      db.prepare(`
        INSERT INTO orders (
          id, user_id, customer_name, contact, hostel_address,
          subtotal, discount_amount, delivery_fee, total, promo_code,
          payment_method, status
        ) VALUES (
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?
        )
      `).run(
        orderId,
        userId,
        customerName || (req.user ? req.user.emailOrPhone : 'Student Customer'),
        contact || (req.user ? req.user.emailOrPhone : ''),
        hostelAddress || 'Campus Delivery',
        Number(subtotal),
        Number(discountAmount),
        Number(deliveryFee),
        Number(total),
        promoCode || null,
        paymentMethod,
        'Confirmed'
      )

      // 2. Insert items
      const insertItemStmt = db.prepare(`
        INSERT INTO order_items (
          order_id, product_id, product_name, quantity, unit_price, cover_style, category
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `)

      for (const item of items) {
        insertItemStmt.run(
          orderId,
          item.id,
          item.name,
          Number(item.quantity) || 1,
          Number(item.price),
          item.coverStyle || null,
          item.category || null
        )
      }

      // 3. Clear user's cart if authenticated
      if (userId) {
        db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(userId)
      }
    })

    createOrderTransaction()

    // Fetch the created order with items
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId)
    const orderItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId)

    res.status(201).json({
      message: 'Order placed successfully',
      order: {
        id: order.id,
        userId: order.user_id,
        customerName: order.customer_name,
        contact: order.contact,
        hostelAddress: order.hostel_address,
        subtotal: Number(order.subtotal),
        discountAmount: Number(order.discount_amount),
        deliveryFee: Number(order.delivery_fee),
        total: Number(order.total),
        promoCode: order.promo_code,
        paymentMethod: order.payment_method,
        status: order.status,
        createdAt: order.created_at,
        items: orderItems.map((i) => ({
          id: i.product_id,
          name: i.product_name,
          quantity: i.quantity,
          price: Number(i.unit_price),
          coverStyle: i.cover_style,
          category: i.category,
        })),
      },
    })
  } catch (err) {
    console.error('Order creation error:', err)
    res.status(500).json({ error: 'Failed to place order' })
  }
})

// GET /api/orders - get user orders
router.get('/', requireAuth, (req, res) => {
  try {
    const orders = db.prepare(`
      SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC
    `).all(req.user.id)

    const getItemStmt = db.prepare('SELECT * FROM order_items WHERE order_id = ?')

    const result = orders.map((order) => {
      const items = getItemStmt.all(order.id)
      return {
        id: order.id,
        userId: order.user_id,
        customerName: order.customer_name,
        contact: order.contact,
        hostelAddress: order.hostel_address,
        subtotal: Number(order.subtotal),
        discountAmount: Number(order.discount_amount),
        deliveryFee: Number(order.delivery_fee),
        total: Number(order.total),
        promoCode: order.promo_code,
        paymentMethod: order.payment_method,
        status: order.status,
        createdAt: order.created_at,
        items: items.map((i) => ({
          id: i.product_id,
          name: i.product_name,
          quantity: i.quantity,
          price: Number(i.unit_price),
          coverStyle: i.cover_style,
          category: i.category,
        })),
      }
    })

    res.json(result)
  } catch (err) {
    console.error('Fetch orders error:', err)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

// GET /api/orders/:id
router.get('/:id', optionalAuth, (req, res) => {
  try {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id)
    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id)

    res.json({
      id: order.id,
      userId: order.user_id,
      customerName: order.customer_name,
      contact: order.contact,
      hostelAddress: order.hostel_address,
      subtotal: Number(order.subtotal),
      discountAmount: Number(order.discount_amount),
      deliveryFee: Number(order.delivery_fee),
      total: Number(order.total),
      promoCode: order.promo_code,
      paymentMethod: order.payment_method,
      status: order.status,
      createdAt: order.created_at,
      items: items.map((i) => ({
        id: i.product_id,
        name: i.product_name,
        quantity: i.quantity,
        price: Number(i.unit_price),
        coverStyle: i.cover_style,
        category: i.category,
      })),
    })
  } catch (err) {
    console.error('Fetch order by id error:', err)
    res.status(500).json({ error: 'Failed to fetch order' })
  }
})

export default router
