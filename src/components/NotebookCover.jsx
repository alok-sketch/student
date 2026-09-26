import React from 'react'

export function NotebookCover({ style = 'motivational', title, isMini = false }) {
  // Common spiral rings
  const renderSpiralRings = (ringCount = 14, color = '#3a3a3a') => {
    return (
      <div className="spiral-column">
        {Array.from({ length: ringCount }).map((_, i) => (
          <div key={i} className="spiral-ring" style={{ '--ring-color': color }}>
            <span className="ring-hole left-hole"></span>
            <span className="ring-coil"></span>
          </div>
        ))}
      </div>
    )
  }

  if (style === 'motivational') {
    return (
      <div className={`notebook-mockup cover-motivational ${isMini ? 'mini' : ''}`}>
        {renderSpiralRings(12, '#4a4a4a')}
        <div className="cover-inner motivational-inner">
          <div className="sparkles top-left">✦</div>
          <div className="sparkles top-right">✧</div>
          <div className="motivational-content">
            <span className="quote-script">Believe</span>
            <div className="quote-divider">
              <span>—</span> <em>in</em> <span>—</span>
            </div>
            <span className="quote-bold">Yourself</span>
          </div>
          <div className="sparkles bottom-center">✦</div>
        </div>
      </div>
    )
  }

  if (style === 'scenic') {
    return (
      <div className={`notebook-mockup cover-scenic ${isMini ? 'mini' : ''}`}>
        {renderSpiralRings(12, '#3a4a58')}
        <div className="cover-inner scenic-inner">
          <div className="scenic-header">
            <p className="scenic-title">Good<br />Things<br /><span>Take Time</span></p>
          </div>
          <div className="scenic-art">
            {/* SVG Mountain landscape */}
            <svg viewBox="0 0 200 130" className="landscape-svg" preserveAspectRatio="none">
              <defs>
                <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#7E9EB8" />
                  <stop offset="100%" stopColor="#ADC5D8" />
                </linearGradient>
                <linearGradient id="mountGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="35%" stopColor="#4A657C" />
                  <stop offset="100%" stopColor="#253849" />
                </linearGradient>
                <linearGradient id="mountGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#D4E4EE" />
                  <stop offset="50%" stopColor="#3B5368" />
                  <stop offset="100%" stopColor="#1E2F3E" />
                </linearGradient>
                <linearGradient id="lakeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#5B7A94" />
                  <stop offset="100%" stopColor="#3A5369" />
                </linearGradient>
              </defs>
              <polygon points="20,110 95,25 155,110" fill="url(#mountGrad1)" />
              <polygon points="90,110 145,45 195,110" fill="url(#mountGrad2)" />
              <polygon points="5,110 50,60 100,110" fill="#3D5366" />
              {/* Lake and reflections */}
              <rect x="0" y="105" width="200" height="25" fill="url(#lakeGrad)" />
              <line x1="30" y1="112" x2="80" y2="112" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.4" />
              <line x1="110" y1="118" x2="160" y2="118" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.4" />
            </svg>
          </div>
        </div>
      </div>
    )
  }

  if (style === 'kraft') {
    return (
      <div className={`notebook-mockup cover-kraft ${isMini ? 'mini' : ''}`}>
        {renderSpiralRings(12, '#2C2723')}
        <div className="cover-inner kraft-inner">
          <div className="kraft-content">
            <h3 className="kraft-headline">Small<br />Steps<br /><span>Big Dreams</span></h3>
            <div className="kraft-art">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#3D2E20" strokeWidth="1.8" strokeLinecap="round">
                <path d="M24 42V18" />
                <path d="M24 34C18 32 16 26 16 26C16 26 22 26 24 30" />
                <path d="M24 28C30 26 32 20 32 20C32 20 26 20 24 24" />
                <path d="M24 22C19 20 18 14 18 14C18 14 23 15 24 18" />
                <path d="M24 16C28 14 29 9 29 9C29 9 25 10 24 13" />
                <circle cx="24" cy="9" r="1.5" fill="#3D2E20" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (style === 'notes') {
    return (
      <div className={`notebook-mockup cover-notes ${isMini ? 'mini' : ''}`}>
        {renderSpiralRings(12, '#383838')}
        <div className="cover-inner notes-inner">
          <div className="notes-badge">
            <span>NOTES</span>
          </div>
        </div>
      </div>
    )
  }

  if (style === 'pastel') {
    return (
      <div className={`notebook-mockup cover-pastel ${isMini ? 'mini' : ''}`}>
        {renderSpiralRings(12, '#997B4D')}
        <div className="cover-inner pastel-inner">
          <div className="pastel-waves">
            <div className="wave wave-1"></div>
            <div className="wave wave-2"></div>
            <div className="wave wave-3"></div>
            <div className="wave wave-4"></div>
          </div>
          <div className="pastel-content">
            <span className="pastel-txt-1">Make</span>
            <span className="pastel-txt-2">IT</span>
            <span className="pastel-txt-3">Happen</span>
          </div>
        </div>
      </div>
    )
  }

  // Generic notebook fallback
  return (
    <div className={`notebook-mockup cover-generic ${isMini ? 'mini' : ''}`}>
      {renderSpiralRings(12, '#555')}
      <div className="cover-inner generic-inner">
        <h4>{title || 'Notebook'}</h4>
      </div>
    </div>
  )
}
