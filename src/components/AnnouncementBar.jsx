import React from 'react'
import { Truck, Banknote, Phone } from './Icons'

export function AnnouncementBar() {
  return (
    <div className="announcement-bar">
      <div className="announcement-container">
        <div className="announcement-left">
          <Truck size={14} className="announcement-icon" />
          <span>Free Delivery within 5–10 km (College & Nearby Area)</span>
        </div>
        <div className="announcement-right">
          <div className="announcement-item">
            <Banknote size={14} className="announcement-icon" />
            <span>Cash on Delivery Available</span>
          </div>
          <span className="announcement-divider">|</span>
          <div className="announcement-item">
            <Phone size={14} className="announcement-icon" />
            <span>Need Help? <a href="tel:+919876543210">+91 98765 43210</a></span>
          </div>
        </div>
      </div>
    </div>
  )
}
