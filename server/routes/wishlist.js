import express from 'express'
import db from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.use(requireAuth)

function formatProductRow(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : null,
    rating: Number(row.rating),
    reviews: Number(row.reviews),
    badge: row.badge,
    coverStyle: row.cover_style,
    coverTitle: row.cover_title,
    description: row.description,
    pages: row.pages,
    gsm: row.gsm,
    binding: row.binding,
    ruling: row.ruling,
    imageType: row.image_type,
  }
}

// GET /api/wishlist
router.get('/', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT p.*
      FROM wishlist_items w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ?
      ORDER BY w.created_at DESC
    `).all(req.user.id)

    res.json(rows.map(formatProductRow))
  } catch (err) {
    console.error('Fetch wishlist error:', err)
    res.status(500).json({ error: 'Failed to fetch wishlist' })
  }
})

// POST /api/wishlist/toggle
router.post('/toggle', (req, res) => {
  const { productId } = req.body

  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' })
  }

  try {
    const product = db.prepare('SELECT id FROM products WHERE id = ?').get(productId)
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    const existing = db.prepare('SELECT id FROM wishlist_items WHERE user_id = ? AND product_id = ?').get(req.user.id, productId)

    let isWishlisted = false
    if (existing) {
      db.prepare('DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?').run(req.user.id, productId)
      isWishlisted = false
    } else {
      db.prepare('INSERT INTO wishlist_items (user_id, product_id) VALUES (?, ?)').run(req.user.id, productId)
      isWishlisted = true
    }

    const rows = db.prepare(`
      SELECT p.*
      FROM wishlist_items w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ?
      ORDER BY w.created_at DESC
    `).all(req.user.id)

    res.json({
      isWishlisted,
      wishlist: rows.map(formatProductRow),
    })
  } catch (err) {
    console.error('Toggle wishlist error:', err)
    res.status(500).json({ error: 'Failed to toggle wishlist item' })
  }
})

// DELETE /api/wishlist/:productId
router.delete('/:productId', (req, res) => {
  const { productId } = req.params
  try {
    db.prepare('DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?').run(req.user.id, productId)

    const rows = db.prepare(`
      SELECT p.*
      FROM wishlist_items w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ?
      ORDER BY w.created_at DESC
    `).all(req.user.id)

    res.json(rows.map(formatProductRow))
  } catch (err) {
    console.error('Remove wishlist item error:', err)
    res.status(500).json({ error: 'Failed to remove item from wishlist' })
  }
})

export default router
