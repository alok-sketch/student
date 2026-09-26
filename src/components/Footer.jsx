import React from 'react'
import { GraduationCap, Phone, Mail, MapPin, Heart, ShieldCheck, Truck, Clock } from './Icons'

export function Footer({ onCategoryClick }) {
  return (
    <footer className="site-footer">
      {/* Value Proposition Highlights */}
      <div className="footer-highlights">
        <div className="highlight-item">
          <Truck className="highlight-icon" size={24} />
          <div>
            <h4>Free Campus Delivery</h4>
            <p>Within 5–10 km for college hostels & PG areas</p>
          </div>
        </div>

        <div className="highlight-item">
          <Clock className="highlight-icon" size={24} />
          <div>
            <h4>Super Fast 2–3h Delivery</h4>
            <p>Order during class, get it before study hour</p>
          </div>
        </div>

        <div className="highlight-item">
          <ShieldCheck className="highlight-icon" size={24} />
          <div>
            <h4>Cash on Delivery</h4>
            <p>Pay when you inspect your notebooks</p>
          </div>
        </div>

        <div className="highlight-item">
          <GraduationCap className="highlight-icon" size={24} />
          <div>
            <h4>Student First Pricing</h4>
            <p>Bulk discounts for exam & semester batches</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="footer-body">
        <div className="footer-column brand-col">
          <div className="brand-logo footer-logo">
            <GraduationCap className="cap-icon" size={30} />
            <div className="logo-text-group">
              <span className="logo-title">
                <span className="brand-student">Student</span>
                <span className="brand-bazaar">Bazaar</span>
              </span>
              <span className="logo-tagline">Study • Shop • Grow</span>
            </div>
          </div>
          <p className="footer-about-text">
            StudentBazaar is India's dedicated student stationery and campus essentials platform.
            Good notebooks, premium pens, and exam gear delivered straight to your college gate.
          </p>
        </div>

        <div className="footer-column">
          <h4 className="footer-title">Categories</h4>
          <ul className="footer-links">
            <li><button type="button" onClick={() => onCategoryClick('notebooks')}>Spiral Notebooks</button></li>
            <li><button type="button" onClick={() => onCategoryClick('pens')}>Gel Pens & Highlighters</button></li>
            <li><button type="button" onClick={() => onCategoryClick('bags')}>Campus Backpacks</button></li>
            <li><button type="button" onClick={() => onCategoryClick('calculators')}>Engineering Calculators</button></li>
            <li><button type="button" onClick={() => onCategoryClick('bottles')}>Insulated Bottles</button></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-title">Student Support</h4>
          <ul className="footer-links">
            <li><a href="#track">Track College Order</a></li>
            <li><a href="#delivery">Hostel Delivery Policy</a></li>
            <li><a href="#bulk">Semester Bulk Bookings</a></li>
            <li><a href="#returns">Exchange & Returns</a></li>
            <li><a href="#terms">Terms & Conditions</a></li>
          </ul>
        </div>

        <div className="footer-column contact-col">
          <h4 className="footer-title">Contact & Help</h4>
          <div className="footer-contact-item">
            <Phone size={16} />
            <span>+91 98765 43210 (9 AM - 9 PM)</span>
          </div>
          <div className="footer-contact-item">
            <Mail size={16} />
            <span>support@studentbazaar.in</span>
          </div>
          <div className="footer-contact-item">
            <MapPin size={16} />
            <span>Opposite Main College Gate, Sikarpur Campus</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 StudentBazaar. All rights reserved. Crafted with <Heart size={13} fill="#E11D48" color="#E11D48" className="inline-heart" /> for students.</p>
      </div>
    </footer>
  )
}
