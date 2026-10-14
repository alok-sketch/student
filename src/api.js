const API_BASE = '/api'

function getAuthHeader() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  let data
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    data = await response.json()
  } else {
    data = await response.text()
  }

  if (!response.ok) {
    const errorMsg = (data && data.error) || response.statusText || 'Request failed'
    throw new Error(errorMsg)
  }

  return data
}

export const api = {
  // Auth
  async login(emailOrPhone, password) {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ emailOrPhone, password }),
    })
    if (res.token) {
      localStorage.setItem('token', res.token)
      localStorage.setItem('user', JSON.stringify(res.user))
    }
    return res
  },

  async register(emailOrPhone, password, collegeName) {
    const res = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ emailOrPhone, password, collegeName }),
    })
    if (res.token) {
      localStorage.setItem('token', res.token)
      localStorage.setItem('user', JSON.stringify(res.user))
    }
    return res
  },

  async getMe() {
    return request('/auth/me')
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getUser() {
    try {
      const u = localStorage.getItem('user')
      return u ? JSON.parse(u) : null
    } catch {
      return null
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem('token')
  },

  // Products
  async getProducts({ category, search, featured } = {}) {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    if (search) params.append('search', search)
    if (featured) params.append('featured', 'true')
    const qs = params.toString() ? `?${params.toString()}` : ''
    return request(`/products${qs}`)
  },

  async getCategories() {
    return request('/products/categories')
  },

  async getProduct(id) {
    return request(`/products/${id}`)
  },

  // Cart
  async getCart() {
    return request('/cart')
  },

  async addToCart(productId, quantity = 1) {
    return request('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    })
  },

  async updateCartQuantity(productId, quantity) {
    return request(`/cart/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    })
  },

  async removeFromCart(productId) {
    return request(`/cart/${productId}`, {
      method: 'DELETE',
    })
  },

  async clearCart() {
    return request('/cart', {
      method: 'DELETE',
    })
  },

  async syncCart(items) {
    return request('/cart/sync', {
      method: 'POST',
      body: JSON.stringify({ items }),
    })
  },

  // Wishlist
  async getWishlist() {
    return request('/wishlist')
  },

  async toggleWishlist(productId) {
    return request('/wishlist/toggle', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    })
  },

  async removeFromWishlist(productId) {
    return request(`/wishlist/${productId}`, {
      method: 'DELETE',
    })
  },

  // Orders
  async placeOrder(orderData) {
    return request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  },

  async getOrders() {
    return request('/orders')
  },
}
