import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight } from './Icons'
import heroDeskImg from '../assets/hero_desk.jpg'

const SLIDES = [
  {
    tag: 'Your Study Partner',
    titleLine1: 'Good Notebooks',
    titleLine2: 'Better Ideas',
    subtitle: 'Premium quality notebooks for every student. Write your dreams with StudentBazaar.',
    cta: 'Shop Now',
    categoryTarget: 'notebooks',
    noteText: 'Same Notebook Bigger Dreams :)',
    accentColor: '#B45309',
  },
  {
    tag: 'Exam Season Ready',
    titleLine1: 'Smooth Pens',
    titleLine2: 'Flawless Notes',
    subtitle: 'High precision 0.5mm gel pens and pastel highlighters engineered for long study sessions.',
    cta: 'Explore Stationery',
    categoryTarget: 'pens',
    noteText: 'Write Clean, Score High ✍️',
    accentColor: '#D97706',
  },
  {
    tag: 'Campus Essentials',
    titleLine1: 'Durable Bags',
    titleLine2: 'Smart Study Gear',
    subtitle: 'Waterproof laptop backpacks, scientific calculators, and stainless steel bottles with free college delivery.',
    cta: 'View All Gear',
    categoryTarget: 'bags',
    noteText: 'Pack Your Dreams 🎒',
    accentColor: '#84421E',
  },
]

export function HeroBanner({ onCtaClick }) {
  const [activeSlide, setActiveSlide] = useState(0)

  // Auto slide rotation every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [])

  const current = SLIDES[activeSlide]

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1))
  }

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % SLIDES.length)
  }

  return (
    <section className="hero-section" aria-label="Featured Promotion">
      <div className="hero-container">
        {/* Navigation Arrow Left */}
        <button
          type="button"
          className="hero-arrow-btn left-arrow"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Navigation Arrow Right */}
        <button
          type="button"
          className="hero-arrow-btn right-arrow"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <ChevronRight size={22} />
        </button>

        {/* Hero Card / Canvas */}
        <div className="hero-card">
          {/* Background image overlay */}
          <div className="hero-bg-media">
            <img src={heroDeskImg} alt="Study Desk Setup" className="hero-bg-img" />
            <div className="hero-bg-gradient-overlay"></div>
          </div>

          <div className="hero-grid">
            {/* Left Content */}
            <div className="hero-text-side">
              <span className="hero-tag-script">{current.tag}</span>
              <h1 className="hero-main-title">
                <span>{current.titleLine1}</span>
                <span className="hero-title-highlight">{current.titleLine2}</span>
              </h1>
              <p className="hero-subtitle">{current.subtitle}</p>

              <div className="hero-actions">
                <button
                  type="button"
                  className="hero-cta-btn"
                  onClick={() => onCtaClick(current.categoryTarget)}
                  id="hero-shop-now-btn"
                >
                  <span>{current.cta}</span>
                  <ArrowRight size={18} className="cta-arrow" />
                </button>
              </div>
            </div>

            {/* Right Visual Composition */}
            <div className="hero-visual-side">
              {/* Floating Notebook Overlay with StudentBazaar logo */}
              <div className="hero-featured-notebook-card">
                <div className="notebook-spiral-side">
                  {Array.from({ length: 11 }).map((_, i) => (
                    <span key={i} className="notebook-coil"></span>
                  ))}
                </div>
                <div className="notebook-cover-face">
                  <div className="student-bazaar-stamp">
                    <div className="stamp-icon">🎓</div>
                    <div className="stamp-brand">StudentBazaar</div>
                    <div className="stamp-sub">Study • Shop • Grow</div>
                  </div>
                </div>
              </div>

              {/* Handwriting sticky note matching screenshot */}
              <div className="hero-handwritten-note">
                <p>{current.noteText}</p>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="hero-dots">
            {SLIDES.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`dot ${activeSlide === index ? 'active' : ''}`}
                onClick={() => setActiveSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
