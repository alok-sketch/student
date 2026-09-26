import React, { useState } from 'react'
import { X, Star, ShoppingCart, Heart, Shield, Truck, RotateCcw, Plus, Minus } from './Icons'
import { NotebookCover } from './NotebookCover'

export function ProductModal({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false
}) {
  const [qty, setQty] = useState(1)

  if (!product) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog product-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="modal-grid">
          {/* Left Column: Visual Mockup */}
          <div className="modal-visual-area">
            <div className="modal-mockup-wrapper">
              {product.category === 'notebooks' ? (
                <NotebookCover style={product.coverStyle} title={product.coverTitle} />
              ) : (
                <div className="modal-item-fallback">
                  <div className="big-icon">📚</div>
                </div>
              )}
            </div>
            <div className="quick-spec-pills">
              {product.pages && <span className="spec-pill">{product.pages}</span>}
              {product.gsm && <span className="spec-pill">{product.gsm}</span>}
              {product.binding && <span className="spec-pill">{product.binding}</span>}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="modal-info-area">
            {product.badge && <span className="product-badge modal-badge">{product.badge}</span>}
            <h2 className="modal-product-title">{product.name}</h2>

            <div className="modal-rating-row">
              <div className="stars-cluster">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={15} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
              <span className="rating-val">{product.rating}</span>
              <span className="reviews-count">({product.reviews} student reviews)</span>
            </div>

            <div className="modal-price-block">
              <span className="currency-symbol">₹</span>
              <span className="current-price">{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="old-price">₹{product.originalPrice}</span>
                  <span className="discount-tag">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="modal-description">{product.description}</p>

            {/* Notebook Specs Table if available */}
            {product.category === 'notebooks' && (
              <div className="specs-table">
                <div className="spec-row">
                  <span className="spec-label">Paper Quality</span>
                  <span className="spec-value">{product.gsm || '80 GSM Acid-Free'}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Page Count</span>
                  <span className="spec-value">{product.pages || '160 Pages'}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Ruling Type</span>
                  <span className="spec-value">{product.ruling || 'Single Ruled with Margin'}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Binding</span>
                  <span className="spec-value">{product.binding || 'Rust-proof Twin Wire Spiral'}</span>
                </div>
              </div>
            )}

            {/* Quantity Selector & Action Buttons */}
            <div className="modal-action-row">
              <div className="quantity-selector">
                <button
                  type="button"
                  onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                  aria-label="Decrease"
                >
                  <Minus size={14} />
                </button>
                <span className="qty-value">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((prev) => prev + 1)}
                  aria-label="Increase"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                type="button"
                className="modal-add-cart-btn"
                onClick={() => {
                  onAddToCart(product, qty)
                  onClose()
                }}
              >
                <ShoppingCart size={18} />
                <span>Add {qty} to Cart • ₹{product.price * qty}</span>
              </button>

              <button
                type="button"
                className={`modal-wishlist-btn ${isWishlisted ? 'favorited' : ''}`}
                onClick={() => onToggleWishlist(product)}
                aria-label="Save to wishlist"
              >
                <Heart size={20} fill={isWishlisted ? '#E11D48' : 'none'} color={isWishlisted ? '#E11D48' : '#4B5563'} />
              </button>
            </div>

            {/* Perks Strip */}
            <div className="modal-perks">
              <div className="perk-item">
                <Truck size={16} />
                <span>Express Campus Delivery in 2–3 hours</span>
              </div>
              <div className="perk-item">
                <RotateCcw size={16} />
                <span>7-Day Replacement Guarantee</span>
              </div>
              <div className="perk-item">
                <Shield size={16} />
                <span>100% Genuine StudentBazaar Quality</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
