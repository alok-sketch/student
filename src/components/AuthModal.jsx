import React, { useState } from 'react'
import { X, GraduationCap, Mail, Lock, UserCheck } from './Icons'
import { api } from '../api'

export function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [collegeName, setCollegeName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successUser, setSuccessUser] = useState(null)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setLoading(true)

    try {
      let res
      if (isSignUp) {
        res = await api.register(emailOrPhone, password, collegeName)
      } else {
        res = await api.login(emailOrPhone, password)
      }

      setSuccessUser(res.user)
      if (onAuthSuccess) {
        onAuthSuccess(res.user)
      }

      setTimeout(() => {
        onClose()
        setSuccessUser(null)
        setPassword('')
      }, 1200)
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
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

        {successUser ? (
          <div className="auth-success">
            <UserCheck size={36} color="#059669" />
            <h3>Welcome aboard, {successUser.emailOrPhone}!</h3>
            <p>You are now logged in with Student Perks active.</p>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            {errorMessage && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  marginBottom: '1rem',
                  lineHeight: '1.4',
                }}
              >
                {errorMessage}
              </div>
            )}

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
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Please wait...' : isSignUp ? 'Create Student Account' : 'Sign In to StudentBazaar'}
            </button>

            <div className="auth-switch">
              {isSignUp ? (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(false)
                      setErrorMessage('')
                    }}
                  >
                    Sign In
                  </button>
                </p>
              ) : (
                <p>
                  New to StudentBazaar?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(true)
                      setErrorMessage('')
                    }}
                  >
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
