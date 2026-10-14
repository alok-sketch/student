import express from 'express'
import db from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

// All cart endpoints require authentication
router.use(requireAuth)

function formatCartRow(row) {
  return {
    id: row.product_id,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : null,
    badge: row.badge,
    coverStyle: row.cover_style,
    coverTitle: row.cover_title,
    imageType: row.image_type,
    quantity: row.quantity,
  }
}

// GET /api/cart
router.get('/', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT c.product_id, c.quantity, p.name, p.category, p.price, p.original_price,
             p.badge, p.cover_style, p.cover_title, p.image_type
      FROM cart_items c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
      ORDER BY c.updated_at DESC
    `).all(req.user.id)

    res.json(rows.map(formatCartRow))
  } catch (err) {
    console.error('Fetch cart error:', err)
    res.status(500).json({ error: 'Failed to fetch cart items' })
  }
})

// POST /api/cart - add or update item
router.post('/', (req, res) => {
  const { productId, quantity = 1 } = req.body

  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' })
  }

  try {
    const product = db.prepare('SELECT id FROM products WHERE id = ?').get(productId)
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    const existing = db.prepare('SELECT quantity FROM cart_items WHERE user_id = ? AND product_id = ?').get(req.user.id, productId)

    if (existing) {
      const newQty = existing.quantity + Number(quantity)
      db.prepare(`
        UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ? AND product_id = ?
      `).run(newQty, req.user.id, productId)
    } else {
      db.prepare(`
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES (?, ?, ?)
      `).run(req.user.id, productId, Math.max(1, Number(quantity)))
    }

    // Return updated cart
    const rows = db.prepare(`
      SELECT c.product_id, c.quantity, p.name, p.category, p.price, p.original_price,
             p.badge, p.cover_style, p.cover_title, p.image_type
      FROM cart_items c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
      ORDER BY c.updated_at DESC
    `).all(req.user.id)

    res.json(rows.map(formatCartRow))
  } catch (err) {
    console.error('Add to cart error:', err)
    res.status(500).json({ error: 'Failed to add item to cart' })
  }
})

// PUT /api/cart/:productId - update quantity
router.put('/:productId', (req, res) => {
  const { productId } = req.params
  const { quantity } = req.body

  try {
    if (Number(quantity) <= 0) {
      db.prepare('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?').run(req.user.id, productId)
    } else {
      db.prepare(`
        UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ? AND product_id = ?
      `).run(Number(quantity), req.user.id, productId)
    }

    const rows = db.prepare(`
      SELECT c.product_id, c.quantity, p.name, p.category, p.price, p.original_price,
             p.badge, p.cover_style, p.cover_title, p.image_type
      FROM cart_items c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
      ORDER BY c.updated_at DESC
    `).all(req.user.id)

    res.json(rows.map(formatCartRow))
  } catch (err) {
    console.error('Update cart error:', err)
    res.status(500).json({ error: 'Failed to update item quantity' })
  }
})

// DELETE /api/cart/:productId
router.delete('/:productId', (req, res) => {
  const { productId } = req.params
  try {
    db.prepare('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?').run(req.user.id, productId)

    const rows = db.prepare(`
      SELECT c.product_id, c.quantity, p.name, p.category, p.price, p.original_price,
             p.badge, p.cover_style, p.cover_title, p.image_type
      FROM cart_items c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
      ORDER BY c.updated_at DESC
    `).all(req.user.id)

    res.json(rows.map(formatCartRow))
  } catch (err) {
    console.error('Delete cart item error:', err)
    res.status(500).json({ error: 'Failed to remove item from cart' })
  }
})

// DELETE /api/cart - clear cart
router.delete('/', (req, res) => {
  try {
    db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(req.user.id)
    res.json([])
  } catch (err) {
    console.error('Clear cart error:', err)
    res.status(500).json({ error: 'Failed to clear cart' })
  }
})

// POST /api/cart/sync - sync client items when logging in
router.post('/sync', (req, res) => {
  const { items = [] } = req.body
  try {
    const upsertStmt = db.prepare(`
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES (?, ?, ?)
      ON CONFLICT(user_id, product_id) DO UPDATE SET
        quantity = quantity + excluded.quantity,
        updated_at = CURRENT_TIMESTAMP
    `)

    const syncTransaction = db.transaction((cartList) => {
      for (const item of cartList) {
        if (item.id && Number(item.quantity) > 0) {
          upsertStmt.run(req.user.id, item.id, Number(item.quantity))
        }
      }
    })

    syncTransaction(items)

    const rows = db.prepare(`
      SELECT c.product_id, c.quantity, p.name, p.category, p.price, p.original_price,
             p.badge, p.cover_style, p.cover_title, p.image_type
      FROM cart_items c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
      ORDER BY c.updated_at DESC
    `).all(req.user.id)

    res.json(rows.map(formatCartRow))
  } catch (err) {
    console.error('Sync cart error:', err)
    res.status(500).json({ error: 'Failed to sync cart' })
  }
})

export default router
