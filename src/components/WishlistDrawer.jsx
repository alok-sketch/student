import React from 'react'
import { X, Heart, ShoppingCart, Trash2 } from './Icons'
import { NotebookCover } from './NotebookCover'

export function WishlistDrawer({
  isOpen,
  onClose,
  wishlistItems = [],
  onAddToCart,
  onRemoveWishlist
}) {
  if (!isOpen) return null

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside
        className="cart-drawer wishlist-drawer"
        onClick={(e) => e.stopPropagation()}
        aria-label="Wishlist Drawer"
      >
        <div className="drawer-header">
          <div className="drawer-title-wrap">
            <Heart size={20} className="title-icon" color="#E11D48" fill="#E11D48" />
            <h2>Saved Items</h2>
            <span className="cart-total-badge">({wishlistItems.length})</span>
          </div>
          <button type="button" className="drawer-close-btn" onClick={onClose} aria-label="Close wishlist">
            <X size={20} />
          </button>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="empty-cart-state">
            <div className="empty-icon-circle">
              <Heart size={40} color="#9CA3AF" />
            </div>
            <h3>Your wishlist is empty</h3>
            <p>Tap the heart icon on any notebook or study gear to save it for later.</p>
            <button type="button" className="continue-shopping-btn" onClick={onClose}>
              Explore Items
            </button>
          </div>
        ) : (
          <div className="drawer-items-list">
            {wishlistItems.map((item) => (
              <div key={item.id} className="cart-item-row wishlist-row">
                <div className="item-thumbnail">
                  {item.category === 'notebooks' ? (
                    <NotebookCover style={item.coverStyle} isMini={true} />
                  ) : (
                    <div className="mini-item-icon">📦</div>
                  )}
                </div>

                <div className="item-details">
                  <h4 className="item-name">{item.name}</h4>
                  <span className="item-unit-price">₹{item.price}</span>
                  <button
                    type="button"
                    className="move-to-cart-btn"
                    onClick={() => {
                      onAddToCart(item)
                      onRemoveWishlist(item.id)
                    }}
                  >
                    <ShoppingCart size={13} />
                    <span>Move to Cart</span>
                  </button>
                </div>

                <button
                  type="button"
                  className="item-delete-btn"
                  onClick={() => onRemoveWishlist(item.id)}
                  aria-label="Remove from wishlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </aside>
    </div>
  )
}
