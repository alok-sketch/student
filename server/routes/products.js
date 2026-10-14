import express from 'express'
import db from '../db.js'

const router = express.Router()

function formatProduct(row) {
  if (!row) return null
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
    isFeatured: Boolean(row.is_featured),
  }
}

// GET /api/products
router.get('/', (req, res) => {
  try {
    const { category, search, featured } = req.query
    let query = 'SELECT * FROM products WHERE 1=1'
    const params = []

    if (category) {
      query += ' AND category = ?'
      params.push(category)
    }

    if (featured === 'true' || featured === '1') {
      query += ' AND is_featured = 1'
    }

    if (search && search.trim()) {
      query += ' AND (name LIKE ? OR category LIKE ? OR description LIKE ?)'
      const searchTerm = `%${search.trim()}%`
      params.push(searchTerm, searchTerm, searchTerm)
    }

    query += ' ORDER BY is_featured DESC, price ASC'

    const rows = db.prepare(query).all(...params)
    res.json(rows.map(formatProduct))
  } catch (err) {
    console.error('Fetch products error:', err)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

// GET /api/products/categories
router.get('/categories', (req, res) => {
  try {
    const categories = [
      { id: 'notebooks', name: 'Notebooks', icon: 'notebook' },
      { id: 'pens', name: 'Pens & Pencils', icon: 'pen' },
      { id: 'bags', name: 'Bags', icon: 'bag' },
      { id: 'stationery', name: 'Stationery', icon: 'stationery' },
      { id: 'calculators', name: 'Calculators', icon: 'calculator' },
      { id: 'bottles', name: 'Water Bottles', icon: 'bottle' },
      { id: 'essentials', name: 'Other Essentials', icon: 'gift' },
    ]

    const counts = db.prepare('SELECT category, COUNT(*) as count FROM products GROUP BY category').all()
    const countMap = Object.fromEntries(counts.map(c => [c.category, c.count]))

    const result = categories.map(cat => ({
      ...cat,
      count: countMap[cat.id] || 0,
    }))

    res.json(result)
  } catch (err) {
    console.error('Fetch categories error:', err)
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})

// GET /api/products/:id
router.get('/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id)
    if (!row) {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.json(formatProduct(row))
  } catch (err) {
    console.error('Fetch product by id error:', err)
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

export default router
