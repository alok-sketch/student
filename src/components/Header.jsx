import React, { useState } from 'react'
import {
  GraduationCap,
  Search,
  User,
  Heart,
  ShoppingCart,
  ChevronDown,
  Menu,
  X
} from './Icons'

export function Header({
  cartCount = 0,
  wishlistCount = 0,
  onOpenCart,
  onOpenWishlist,
  onOpenAuth,
  searchQuery,
  onSearchChange,
  activeNav,
  onNavClick,
  categories = []
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false)

  return (
    <header className="main-header">
      {/* Top Navbar */}
      <div className="header-primary">
        <div className="header-container">
          {/* Logo */}
          <div className="brand-logo" onClick={() => onNavClick('home')} role="button" tabIndex={0}>
            <div className="logo-icon-wrap">
              <GraduationCap className="cap-icon" size={32} />
            </div>
            <div className="logo-text-group">
              <span className="logo-title">
                <span className="brand-student">Student</span>
                <span className="brand-bazaar">Bazaar</span>
              </span>
              <span className="logo-tagline">Study • Shop • Grow</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="search-bar-wrap">
            <div className="search-pill">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search for notebooks, pens, and more..."
                className="search-input"
                id="site-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => onSearchChange('')}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="header-actions">
            <button
              type="button"
              className="action-btn auth-btn"
              onClick={onOpenAuth}
              id="header-auth-btn"
            >
              <User size={18} />
              <span>Login / Signup</span>
            </button>

            <button
              type="button"
              className="action-btn wishlist-btn"
              onClick={onOpenWishlist}
              id="header-wishlist-btn"
            >
              <div className="icon-with-badge">
                <Heart size={18} />
                {wishlistCount > 0 && <span className="action-badge">{wishlistCount}</span>}
              </div>
              <span className="action-label">Wishlist</span>
            </button>

            <button
              type="button"
              className="action-btn cart-btn"
              onClick={onOpenCart}
              id="header-cart-btn"
            >
              <div className="cart-icon-wrapper">
                <ShoppingCart size={20} />
                <span className="cart-badge">{cartCount}</span>
              </div>
              <span className="cart-label">Cart</span>
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              type="button"
              className="mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Subnavigation Bar */}
      <nav className={`header-subnav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="subnav-container">
          <ul className="subnav-links">
            <li className={`nav-item ${activeNav === 'home' ? 'active' : ''}`}>
              <button type="button" onClick={() => onNavClick('home')}>
                Home
              </button>
            </li>

            <li className={`nav-item dropdown ${activeNav === 'shop' ? 'active' : ''}`}>
              <button
                type="button"
                className="dropdown-trigger"
                onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
              >
                <span>Shop</span>
                <ChevronDown size={14} className="dropdown-caret" />
              </button>
              {shopDropdownOpen && (
                <div className="dropdown-menu">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className="dropdown-item"
                      onClick={() => {
                        onNavClick(cat.id)
                        setShopDropdownOpen(false)
                        setMobileMenuOpen(false)
                      }}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </li>

            <li className={`nav-item ${activeNav === 'notebooks' ? 'active' : ''}`}>
              <button type="button" onClick={() => onNavClick('notebooks')}>
                <span>Notebooks</span>
                <ChevronDown size={14} className="dropdown-caret" />
              </button>
            </li>

            <li className={`nav-item ${activeNav === 'stationery' ? 'active' : ''}`}>
              <button type="button" onClick={() => onNavClick('stationery')}>
                <span>Stationery</span>
                <ChevronDown size={14} className="dropdown-caret" />
              </button>
            </li>

            <li className={`nav-item ${activeNav === 'accessories' ? 'active' : ''}`}>
              <button type="button" onClick={() => onNavClick('bags')}>
                <span>Accessories</span>
                <ChevronDown size={14} className="dropdown-caret" />
              </button>
            </li>

            <li className={`nav-item ${activeNav === 'about' ? 'active' : ''}`}>
              <button type="button" onClick={() => onNavClick('about')}>
                About Us
              </button>
            </li>

            <li className={`nav-item ${activeNav === 'contact' ? 'active' : ''}`}>
              <button type="button" onClick={() => onNavClick('contact')}>
                Contact Us
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
