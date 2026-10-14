import React, { useState, useMemo, useEffect } from 'react'
import { AnnouncementBar } from './components/AnnouncementBar'
import { Header } from './components/Header'
import { HeroBanner } from './components/HeroBanner'
import { CategoryBar } from './components/CategoryBar'
import { ProductCard } from './components/ProductCard'
import { CartDrawer } from './components/CartDrawer'
import { WishlistDrawer } from './components/WishlistDrawer'
import { ProductModal } from './components/ProductModal'
import { AuthModal } from './components/AuthModal'
import { OrdersModal } from './components/OrdersModal'
import { Footer } from './components/Footer'
import { CATEGORIES, FEATURED_NOTEBOOKS, ALL_PRODUCTS } from './data/products'
import { ArrowRight, CheckCircle2 } from './components/Icons'
import { api } from './api'
import './App.css'

export default function App() {
  const [user, setUser] = useState(() => api.getUser())
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isOrdersOpen, setIsOrdersOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeNav, setActiveNav] = useState('home')
  const [toast, setToast] = useState(null)

  // Products from backend (initialized with mock fallback)
  const [productsList, setProductsList] = useState(ALL_PRODUCTS)
  const [featuredList, setFeaturedList] = useState(FEATURED_NOTEBOOKS)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 2800)
  }

  // 1. Fetch dynamic products from Backend API on mount
  useEffect(() => {
    api
      .getProducts()
      .then((data) => {
        if (data && data.length > 0) {
          setProductsList(data)
          const featured = data.filter((p) => p.isFeatured)
          if (featured.length > 0) {
            setFeaturedList(featured)
          }
        }
      })
      .catch((err) => {
        console.warn('Backend API not responding, using offline catalog fallback:', err.message)
      })
  }, [])

  // 2. Fetch User Profile and remote Cart/Wishlist when user is authenticated
  useEffect(() => {
    if (user) {
      // Refresh current user data
      api
        .getMe()
        .then((res) => {
          if (res.user) setUser(res.user)
        })
        .catch(() => {
          // Token might be invalid or expired
          api.logout()
          setUser(null)
        })

      // Fetch user's cart from backend
      api
        .getCart()
        .then((remoteCart) => {
          if (Array.isArray(remoteCart)) {
            setCart(remoteCart)
          }
        })
        .catch(console.error)

      // Fetch user's wishlist from backend
      api
        .getWishlist()
        .then((remoteWishlist) => {
          if (Array.isArray(remoteWishlist)) {
            setWishlist(remoteWishlist)
          }
        })
        .catch(console.error)
    }
  }, [user])

  // Auth operations
  const handleAuthSuccess = async (authUser) => {
    setUser(authUser)
    showToast(`Welcome back, ${authUser.emailOrPhone}!`)

    // Sync any guest cart items with backend
    if (cart.length > 0) {
      try {
        const syncedCart = await api.syncCart(cart)
        if (Array.isArray(syncedCart)) {
          setCart(syncedCart)
        }
      } catch (err) {
        console.error('Failed to sync guest cart:', err)
      }
    }
  }

  const handleLogout = () => {
    api.logout()
    setUser(null)
    setCart([])
    setWishlist([])
    showToast('Signed out successfully', 'info')
  }

  // Cart operations
  const handleAddToCart = async (product, quantity = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id)
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      }
      return [...prevCart, { ...product, quantity }]
    })
    showToast(`Added "${product.name}" to cart!`)

    if (user) {
      try {
        await api.addToCart(product.id, quantity)
      } catch (err) {
        console.error('Failed to persist cart item to backend:', err)
      }
    }
  }

  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId)
      return
    }

    setCart((prevCart) =>
      prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item))
    )

    if (user) {
      try {
        await api.updateCartQuantity(productId, quantity)
      } catch (err) {
        console.error('Failed to update cart quantity on backend:', err)
      }
    }
  }

  const handleRemoveFromCart = async (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))

    if (user) {
      try {
        await api.removeFromCart(productId)
      } catch (err) {
        console.error('Failed to remove cart item on backend:', err)
      }
    }
  }

  const handleClearCart = async () => {
    setCart([])
    if (user) {
      try {
        await api.clearCart()
      } catch (err) {
        console.error('Failed to clear cart on backend:', err)
      }
    }
  }

  // Wishlist operations
  const handleToggleWishlist = async (product) => {
    const exists = wishlist.some((item) => item.id === product.id)
    if (exists) {
      showToast('Removed from wishlist', 'info')
      setWishlist((prevWishlist) => prevWishlist.filter((item) => item.id !== product.id))
    } else {
      showToast(`Saved "${product.name}" to wishlist!`)
      setWishlist((prevWishlist) => [...prevWishlist, product])
    }

    if (user) {
      try {
        const res = await api.toggleWishlist(product.id)
        if (res && res.wishlist) {
          setWishlist(res.wishlist)
        }
      } catch (err) {
        console.error('Failed to toggle wishlist on backend:', err)
      }
    }
  }

  const handleRemoveWishlist = async (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId))

    if (user) {
      try {
        const res = await api.removeFromWishlist(productId)
        if (Array.isArray(res)) setWishlist(res)
      } catch (err) {
        console.error('Failed to remove wishlist item on backend:', err)
      }
    }
  }

  // Navigation handling
  const handleNavClick = (navId) => {
    setActiveNav(navId)
    if (navId === 'home') {
      setSelectedCategory(null)
      setSearchQuery('')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (navId === 'shop') {
      setSelectedCategory(null)
      scrollToCatalog()
    } else if (['notebooks', 'stationery', 'pens', 'bags'].includes(navId)) {
      setSelectedCategory(navId)
      scrollToCatalog()
    } else if (navId === 'about' || navId === 'contact') {
      const footer = document.querySelector('.site-footer')
      if (footer) footer.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToCatalog = () => {
    setTimeout(() => {
      const el = document.getElementById('catalog-section')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId)
    if (catId) {
      scrollToCatalog()
    }
  }

  // Filtered products for browsing or search
  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true
      const matchesSearch = searchQuery
        ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
        : true
      return matchesCategory && matchesSearch
    })
  }, [productsList, selectedCategory, searchQuery])

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0)
  const isNotebooksOnly = !selectedCategory && !searchQuery

  return (
    <div className="student-bazaar-app">
      {/* 1. Top Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Main Navigation Header */}
      <Header
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeNav={activeNav}
        onNavClick={handleNavClick}
        categories={CATEGORIES}
        user={user}
        onLogout={handleLogout}
        onOpenOrders={() => setIsOrdersOpen(true)}
      />

      <main>
        {/* 3. Hero Banner Section */}
        {!searchQuery && (
          <HeroBanner
            onCtaClick={(catId) => {
              setSelectedCategory(catId)
              scrollToCatalog()
            }}
          />
        )}

        {/* 4. Category Icons Strip */}
        {!searchQuery && (
          <CategoryBar
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        )}

        {/* 5. Featured Notebooks Section */}
        {isNotebooksOnly && (
          <section className="featured-section" id="featured-notebooks">
            <div className="section-container">
              <div className="section-header-row">
                <h2 className="section-title">Featured Notebooks</h2>
                <button
                  type="button"
                  className="view-all-link"
                  onClick={() => {
                    setSelectedCategory('notebooks')
                    scrollToCatalog()
                  }}
                >
                  <span>View All</span>
                  <ArrowRight size={15} />
                </button>
              </div>

              <div className="product-grid five-columns">
                {featuredList.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                    isWishlisted={wishlist.some((item) => item.id === product.id)}
                    onQuickView={setSelectedProduct}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 6. Dynamic Catalog Section when filtered or searched */}
        {(!isNotebooksOnly || searchQuery) && (
          <section className="catalog-section" id="catalog-section">
            <div className="section-container">
              <div className="section-header-row">
                <div>
                  <h2 className="section-title">
                    {searchQuery
                      ? `Search Results for "${searchQuery}"`
                      : CATEGORIES.find((c) => c.id === selectedCategory)?.name || 'All Products'}
                  </h2>
                  <p className="section-subtitle">
                    Showing {filteredProducts.length} items with campus student pricing
                  </p>
                </div>
                {selectedCategory && (
                  <button
                    type="button"
                    className="clear-filter-btn"
                    onClick={() => setSelectedCategory(null)}
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              {filteredProducts.length === 0 ? (
                <div className="no-results-box">
                  <p>No products found matching your search.</p>
                  <button
                    type="button"
                    className="reset-btn"
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory(null)
                    }}
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="product-grid five-columns">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onToggleWishlist={handleToggleWishlist}
                      isWishlisted={wishlist.some((item) => item.id === product.id)}
                      onQuickView={setSelectedProduct}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* 7. Footer */}
      <Footer onCategoryClick={handleCategorySelect} />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        user={user}
        onOrderSuccess={(order) => showToast(`Order #${order.id} placed!`)}
      />

      {/* Slide-over Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlist}
        onAddToCart={handleAddToCart}
        onRemoveWishlist={handleRemoveWishlist}
      />

      {/* Product Quick View Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          isWishlisted={wishlist.some((item) => item.id === selectedProduct.id)}
        />
      )}

      {/* Student Login / Signup Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* User Orders History Modal */}
      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
      />

      {/* Toast Notification */}
      {toast && (
        <div className={`toast-notification ${toast.type}`}>
          <CheckCircle2 size={18} />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  )
}
