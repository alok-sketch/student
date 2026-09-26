import React from 'react'

// Custom category icons matching the screenshot's clean line-art style
function CategoryIcon({ type }) {
  switch (type) {
    case 'notebook':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <line x1="8" y1="2" x2="8" y2="22" />
          <line x1="12" y1="7" x2="16" y2="7" />
          <line x1="12" y1="12" x2="16" y2="12" />
          <line x1="12" y1="17" x2="16" y2="17" />
        </svg>
      )
    case 'pen':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="m18 2 4 4-12 12H6v-4L18 2z" />
          <line x1="14" y1="6" x2="18" y2="10" />
          <circle cx="4" cy="20" r="1.5" fill="currentColor" />
        </svg>
      )
    case 'bag':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-9z" />
          <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
          <rect x="8" y="13" width="8" height="6" rx="1" />
          <line x1="12" y1="13" x2="12" y2="15" />
        </svg>
      )
    case 'stationery':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 11V4a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v7" />
          <path d="M5 11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2" />
          <path d="M7 13v7a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-7" />
          <line x1="9" y1="2" x2="9" y2="8" />
          <line x1="15" y1="2" x2="15" y2="8" />
          <line x1="12" y1="2" x2="12" y2="8" />
        </svg>
      )
    case 'calculator':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="3" />
          <rect x="7" y="5" width="10" height="3" rx="1" />
          <circle cx="8" cy="12" r="1" fill="currentColor" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
          <circle cx="16" cy="12" r="1" fill="currentColor" />
          <circle cx="8" cy="16" r="1" fill="currentColor" />
          <circle cx="12" cy="16" r="1" fill="currentColor" />
          <circle cx="16" cy="16" r="1" fill="currentColor" />
        </svg>
      )
    case 'bottle':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3h8v2H8z" />
          <path d="M9 5v3c0 1-1.5 2-2 3v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V11c-.5-1-2-2-2-3V5" />
          <line x1="10" y1="14" x2="14" y2="14" />
        </svg>
      )
    case 'gift':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="8" width="18" height="4" rx="1" />
          <path d="M12 8v13" />
          <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
          <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.5 4.5 0 0 1 12 7.5a4.5 4.5 0 0 1 4.5-4.5 2.5 2.5 0 0 1 0 5" />
        </svg>
      )
    default:
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      )
  }
}

export function CategoryBar({ categories = [], selectedCategory, onSelectCategory }) {
  return (
    <section className="category-section" aria-label="Product Categories">
      <div className="category-container">
        <div className="category-strip">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                className={`category-item-btn ${isSelected ? 'active' : ''}`}
                onClick={() => onSelectCategory(isSelected ? null : cat.id)}
                id={`cat-btn-${cat.id}`}
              >
                <div className="category-circle">
                  <CategoryIcon type={cat.icon} />
                </div>
                <span className="category-label">{cat.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
