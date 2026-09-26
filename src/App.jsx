import React, { useState, useMemo } from 'react'
import { AnnouncementBar } from './components/AnnouncementBar'
import { Header } from './components/Header'
import { HeroBanner } from './components/HeroBanner'
import { CategoryBar } from './components/CategoryBar'
import { ProductCard } from './components/ProductCard'
import { CartDrawer } from './components/CartDrawer'
import { WishlistDrawer } from './components/WishlistDrawer'
import { ProductModal } from './components/ProductModal'
import { AuthModal } from './components/AuthModal'
import { Footer } from './components/Footer'
import { CATEGORIES, FEATURED_NOTEBOOKS, ALL_PRODUCTS } from './data/products'
import { ArrowRight, CheckCircle2 } from './components/Icons'
import './App.css'

export default function App() {
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeNav, setActiveNav] = useState('home')
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 2800)
  }

  // Cart operations
  const handleAddToCart = (product, quantity = 1) => {
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
  }

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId)
      return
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item))
    )
  }

  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
  }

  const handleClearCart = () => {
    setCart([])
  }

  // Wishlist operations
  const handleToggleWishlist = (product) => {
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.some((item) => item.id === product.id)
      if (exists) {
        showToast(`Removed from wishlist`, 'info')
        return prevWishlist.filter((item) => item.id !== product.id)
      } else {
        showToast(`Saved "${product.name}" to wishlist!`)
        return [...prevWishlist, product]
      }
    })
  }

  const handleRemoveWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId))
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
    return ALL_PRODUCTS.filter((product) => {
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true
      const matchesSearch = searchQuery
        ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
        : true
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery])

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
      />

      <main>
        {/* 3. Hero Banner Section matching screenshot */}
        {!searchQuery && (
          <HeroBanner
            onCtaClick={(catId) => {
              setSelectedCategory(catId)
              scrollToCatalog()
            }}
          />
        )}

        {/* 4. Category Icons Strip matching screenshot */}
        {!searchQuery && (
          <CategoryBar
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        )}

        {/* 5. Featured Notebooks Section matching screenshot */}
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
                {FEATURED_NOTEBOOKS.map((product) => (
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
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

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
