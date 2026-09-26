import React, { useState } from 'react'
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag } from './Icons'
import { NotebookCover } from './NotebookCover'

export function CartDrawer({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) {
  const [promoCode, setPromoCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(0)
  const [promoError, setPromoError] = useState('')
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  if (!isOpen) return null

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const freeDeliveryThreshold = 250
  const deliveryFee = subtotal >= freeDeliveryThreshold || subtotal === 0 ? 0 : 30
  const discountAmount = Math.round((subtotal * appliedDiscount) / 100)
  const total = Math.max(0, subtotal - discountAmount + deliveryFee)

  const handleApplyPromo = (e) => {
    e.preventDefault()
    setPromoError('')
    if (promoCode.trim().toUpperCase() === 'STUDENT10') {
      setAppliedDiscount(10)
    } else if (promoCode.trim().toUpperCase() === 'FIRSTBUY') {
      setAppliedDiscount(15)
    } else {
      setPromoError('Invalid coupon code. Try STUDENT10')
    }
  }

  const handleCheckout = () => {
    setIsCheckingOut(true)
    setTimeout(() => {
      setIsCheckingOut(false)
      setOrderPlaced(true)
      onClearCart()
    }, 1200)
  }

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside
        className="cart-drawer"
        onClick={(e) => e.stopPropagation()}
        aria-label="Shopping Cart Drawer"
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-wrap">
            <ShoppingBag size={20} className="title-icon" />
            <h2>Your Cart</h2>
            <span className="cart-total-badge">({cartItems.reduce((acc, i) => acc + i.quantity, 0)})</span>
          </div>
          <button type="button" className="drawer-close-btn" onClick={onClose} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div className="free-delivery-tracker">
          {subtotal >= freeDeliveryThreshold ? (
            <p className="free-delivery-msg unlocked">
              🎉 <strong>Awesome!</strong> You unlocked Free Campus Delivery!
            </p>
          ) : (
            <>
              <p className="free-delivery-msg">
                Add <strong>₹{freeDeliveryThreshold - subtotal}</strong> more for <strong>Free Delivery</strong>
              </p>
              <div className="delivery-progress-track">
                <div
                  className="delivery-progress-fill"
                  style={{ width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%` }}
                ></div>
              </div>
            </>
          )}
        </div>

        {/* Content */}
        {orderPlaced ? (
          <div className="order-success-screen">
            <div className="success-icon-wrap">✓</div>
            <h3>Order Confirmed!</h3>
            <p>Thank you for ordering with StudentBazaar! Your notebooks will arrive in 2–3 hours right at your campus/hostel.</p>
            <button
              type="button"
              className="continue-shopping-btn"
              onClick={() => {
                setOrderPlaced(false)
                onClose()
              }}
            >
              Continue Shopping
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="empty-cart-state">
            <div className="empty-icon-circle">
              <ShoppingBag size={42} strokeWidth={1.5} />
            </div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added any study essentials or notebooks yet.</p>
            <button type="button" className="continue-shopping-btn" onClick={onClose}>
              Browse Notebooks
            </button>
          </div>
        ) : (
          <>
            <div className="drawer-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <div className="item-thumbnail">
                    {item.category === 'notebooks' ? (
                      <NotebookCover style={item.coverStyle} isMini={true} />
                    ) : (
                      <div className="mini-item-icon">📦</div>
                    )}
                  </div>

                  <div className="item-details">
                    <h4 className="item-name">{item.name}</h4>
                    <span className="item-unit-price">₹{item.price} each</span>

                    <div className="quantity-controls">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="quantity-num">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="item-actions">
                    <span className="item-line-total">₹{item.price * item.quantity}</span>
                    <button
                      type="button"
                      className="item-delete-btn"
                      onClick={() => onRemoveItem(item.id)}
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Strip */}
            <form className="promo-code-form" onSubmit={handleApplyPromo}>
              <div className="promo-input-wrap">
                <Tag size={15} className="promo-icon" />
                <input
                  type="text"
                  placeholder="Coupon (e.g. STUDENT10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button type="submit">Apply</button>
              </div>
              {promoError && <p className="promo-error">{promoError}</p>}
              {appliedDiscount > 0 && (
                <p className="promo-success">✓ {appliedDiscount}% Student Discount Applied!</p>
              )}
            </form>

            {/* Summary & Checkout */}
            <div className="drawer-footer">
              <div className="bill-breakdown">
                <div className="bill-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="bill-row discount">
                    <span>Discount ({appliedDiscount}%)</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="bill-row">
                  <span>Delivery (within 10 km)</span>
                  <span>{deliveryFee === 0 ? <strong className="free-text">FREE</strong> : `₹${deliveryFee}`}</span>
                </div>
                <div className="bill-row grand-total">
                  <span>Total Payable</span>
                  <span className="total-amount">₹{total}</span>
                </div>
              </div>

              <button
                type="button"
                className="checkout-btn"
                onClick={handleCheckout}
                disabled={isCheckingOut}
                id="cart-checkout-btn"
              >
                {isCheckingOut ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="drawer-trust-badge">
                <ShieldCheck size={14} />
                <span>Cash on Delivery Available • Easy Campus Returns</span>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
