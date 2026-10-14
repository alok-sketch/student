import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'student_bazaar_super_secret_key_2026'

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      req.user = decoded
    } catch {
      // Ignore invalid token in optional mode
    }
  }
  next()
}

export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      emailOrPhone: user.email_or_phone,
      collegeName: user.college_name,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}
