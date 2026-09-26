import React, { useState } from 'react'
import { X, GraduationCap, Mail, Lock, UserCheck } from './Icons'

export function AuthModal({ isOpen, onClose }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [collegeName, setCollegeName] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      onClose()
      setSubmitted(false)
    }, 1200)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog auth-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="auth-header">
          <div className="auth-logo-badge">
            <GraduationCap size={28} />
          </div>
          <h2>{isSignUp ? 'Join StudentBazaar' : 'Student Login'}</h2>
          <p>Get exclusive 10% student discounts and free hostel delivery</p>
        </div>

        {submitted ? (
          <div className="auth-success">
            <UserCheck size={36} color="#059669" />
            <h3>Welcome aboard!</h3>
            <p>You are now logged in with Student Perks active.</p>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>College Email or Mobile Number</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  type="text"
                  required
                  placeholder="name@college.edu or 9876543210"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                />
              </div>
            </div>

            {isSignUp && (
              <div className="form-group">
                <label>College / University Name</label>
                <div className="input-with-icon">
                  <GraduationCap size={16} className="input-icon" />
                  <input
                    type="text"
                    placeholder="e.g. Sikarpur Institute of Tech"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Password</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input type="password" required placeholder="••••••••" />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn">
              {isSignUp ? 'Create Student Account' : 'Sign In to StudentBazaar'}
            </button>

            <div className="auth-switch">
              {isSignUp ? (
                <p>
                  Already have an account?{' '}
                  <button type="button" onClick={() => setIsSignUp(false)}>
                    Sign In
                  </button>
                </p>
              ) : (
                <p>
                  New to StudentBazaar?{' '}
                  <button type="button" onClick={() => setIsSignUp(true)}>
                    Register with Student ID
                  </button>
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
