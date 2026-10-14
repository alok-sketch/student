import React, { useState, useEffect } from 'react'
import { X, ShoppingBag, Truck, CheckCircle2 } from './Icons'
import { api } from '../api'

export function OrdersModal({ isOpen, onClose }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchOrders = async () => {
    try {
      const data = await api.getOrders()
      setError('')
      setOrders(data || [])
    } catch (err) {
      setError(err.message || 'Failed to load order history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      // oxlint-disable-next-line react/set-state-in-effect
      fetchOrders()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog"
        style={{ maxWidth: '640px', width: '92%', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close orders">
          <X size={20} />
        </button>

        <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#e0e7ff', color: '#4338ca', padding: '8px', borderRadius: '10px', display: 'flex' }}>
              <ShoppingBag size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>My Orders</h2>
              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '2px 0 0' }}>
                Track your campus deliveries & past purchases
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
              <p>Loading your orders...</p>
            </div>
          ) : error ? (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px', borderRadius: '8px', fontSize: '0.9rem' }}>
              {error}
            </div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <ShoppingBag size={28} color="#94a3b8" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>No orders placed yet</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Your ordered notebooks and campus supplies will show up here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {orders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '16px',
                    background: '#f8fafc',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '1rem' }}>Order #{order.id}</span>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: '10px' }}>
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <span
                      style={{
                        background: '#dcfce7',
                        color: '#15803d',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <CheckCircle2 size={13} color="#15803d" />
                      {order.status}
                    </span>
                  </div>

                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px', marginBottom: '10px' }}>
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.875rem',
                          padding: '4px 0',
                        }}
                      >
                        <span style={{ color: '#334155' }}>
                          {item.name} <strong style={{ color: '#64748b', fontWeight: 500 }}>× {item.quantity}</strong>
                        </span>
                        <span style={{ fontWeight: '600', color: '#0f172a' }}>
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      borderTop: '1px dashed #cbd5e1',
                      paddingTop: '10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.875rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.8rem' }}>
                      <Truck size={14} />
                      <span>{order.hostelAddress} • {order.paymentMethod}</span>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', marginRight: '6px' }}>Total:</span>
                      <span style={{ fontSize: '1.05rem', fontWeight: '700', color: '#059669' }}>
                        ₹{order.total}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
