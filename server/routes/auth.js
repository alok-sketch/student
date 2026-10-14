import express from 'express'
import bcrypt from 'bcryptjs'
import db from '../db.js'
import { generateToken, requireAuth } from '../middleware/auth.js'

const router = express.Router()

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { emailOrPhone, password, collegeName } = req.body

  if (!emailOrPhone || !password) {
    return res.status(400).json({ error: 'Email/phone and password are required' })
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' })
  }

  try {
    const existing = db.prepare('SELECT id FROM users WHERE email_or_phone = ?').get(emailOrPhone.trim().toLowerCase())
    if (existing) {
      return res.status(409).json({ error: 'An account with this email/phone already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const result = db.prepare(`
      INSERT INTO users (email_or_phone, college_name, password_hash)
      VALUES (?, ?, ?)
    `).run(emailOrPhone.trim().toLowerCase(), collegeName ? collegeName.trim() : null, passwordHash)

    const user = {
      id: Number(result.lastInsertRowid),
      emailOrPhone: emailOrPhone.trim().toLowerCase(),
      collegeName: collegeName ? collegeName.trim() : null,
    }

    const token = generateToken(user)
    res.status(201).json({
      message: 'Account created successfully',
      token,
      user,
    })
  } catch (err) {
    console.error('Registration error:', err)
    res.status(500).json({ error: 'Internal server error while registering' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { emailOrPhone, password } = req.body

  if (!emailOrPhone || !password) {
    return res.status(400).json({ error: 'Email/phone and password are required' })
  }

  try {
    const userRow = db.prepare('SELECT * FROM users WHERE email_or_phone = ?').get(emailOrPhone.trim().toLowerCase())
    if (!userRow) {
      return res.status(401).json({ error: 'Invalid credentials. No account found.' })
    }

    const isMatch = await bcrypt.compare(password, userRow.password_hash)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password. Please try again.' })
    }

    const user = {
      id: userRow.id,
      emailOrPhone: userRow.email_or_phone,
      collegeName: userRow.college_name,
    }

    const token = generateToken(user)
    res.json({
      message: 'Logged in successfully',
      token,
      user,
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Internal server error while logging in' })
  }
})

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  try {
    const userRow = db.prepare('SELECT id, email_or_phone, college_name, created_at FROM users WHERE id = ?').get(req.user.id)
    if (!userRow) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      user: {
        id: userRow.id,
        emailOrPhone: userRow.email_or_phone,
        collegeName: userRow.college_name,
        createdAt: userRow.created_at,
      },
    })
  } catch (err) {
    console.error('Fetch me error:', err)
    res.status(500).json({ error: 'Failed to fetch user profile' })
  }
})

export default router
