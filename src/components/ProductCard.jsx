import React from 'react'
import { ShoppingCart, Heart, Eye } from './Icons'
import { NotebookCover } from './NotebookCover'

export function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  onQuickView
}) {
  return (
    <div className="product-card" id={`product-${product.id}`}>
      {/* Top Visual Box */}
      <div className="card-visual-wrapper" onClick={() => onQuickView(product)}>
        {/* Wishlist Button Overlay */}
        <button
          type="button"
          className={`wishlist-heart-btn ${isWishlisted ? 'favorited' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            onToggleWishlist(product)
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} fill={isWishlisted ? '#E11D48' : 'none'} color={isWishlisted ? '#E11D48' : '#6B7280'} />
        </button>

        {/* Quick View Button */}
        <div className="quick-view-hint">
          <Eye size={14} />
          <span>Quick View</span>
        </div>

        {/* Badge if available */}
        {product.badge && <span className="product-badge">{product.badge}</span>}

        {/* Render Cover or Category Visual */}
        <div className="card-artwork">
          {product.category === 'notebooks' ? (
            <NotebookCover style={product.coverStyle} title={product.coverTitle} />
          ) : (
            <div className={`other-product-mockup item-${product.imageType || 'general'}`}>
              <div className="mockup-icon-badge">
                <span className="mockup-title">{product.name.split(' ')[0]}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="card-details">
        <h3 className="product-title" onClick={() => onQuickView(product)} title={product.name}>
          {product.name}
        </h3>

        <div className="product-price-row">
          <span className="price-currency">₹</span>
          <span className="price-amount">{product.price}</span>
          {product.originalPrice && (
            <span className="price-original">₹{product.originalPrice}</span>
          )}
        </div>

        {/* Add to Cart Button matching screenshot */}
        <button
          type="button"
          className="add-to-cart-btn"
          onClick={() => onAddToCart(product)}
          id={`add-btn-${product.id}`}
        >
          <ShoppingCart size={15} />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  )
}
