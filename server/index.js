import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import cartRoutes from './routes/cart.js'
import wishlistRoutes from './routes/wishlist.js'
import orderRoutes from './routes/orders.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middlewares
app.use(cors())
app.use(express.json())

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'StudentBazaar Backend API',
  })
})

// Mount API routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/orders', orderRoutes)

// 404 handler for unhandled routes
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.url}` })
})

// Error handling middleware
app.use((err, req, res, _next) => {
  console.error('Unhandled server error:', err)
  res.status(500).json({ error: 'Internal Server Error', message: err.message })
})

app.listen(PORT, () => {
  console.log(`🚀 StudentBazaar Backend server running on http://localhost:${PORT}`)
  console.log(`📡 API Health check: http://localhost:${PORT}/api/health`)
})
