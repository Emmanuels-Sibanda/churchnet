import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Shield, FileText } from 'lucide-react';
import PrivacyPolicy from './PrivacyPolicy';
import './Footer.css';

const Footer = () => {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  return (
    <>
      <footer className="main-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Church Venue</h3>
              <p>Connecting churches with venues and equipment for events and gatherings across South Africa.</p>
              <div className="social-links">
                <a href="#" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
                <a href="#" aria-label="Twitter">
                  <Twitter size={20} />
                </a>
                <a href="#" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
              </div>
            </div>

            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/venues">Venues</Link></li>
                <li><Link to="/equipment">Equipment</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Legal</h4>
              <ul>
                <li>
                  <button 
                    className="footer-link-button" 
                    onClick={() => setShowPrivacy(true)}
                  >
                    <Shield size={16} />
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    className="footer-link-button" 
                    onClick={() => setShowTerms(true)}
                  >
                    <FileText size={16} />
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <a href="#popi" onClick={(e) => { e.preventDefault(); setShowPrivacy(true); }}>
                    POPI Compliance
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Contact Us</h4>
              <ul className="contact-info">
                <li>
                  <Mail size={16} />
                  <a href="mailto:info@churchvenue.co.za">info@churchvenue.co.za</a>
                </li>
                <li>
                  <Phone size={16} />
                  <a href="tel:+27638708865">+27 63 870 8865</a>
                </li>
                <li>
                  <MapPin size={16} />
                  <span>Pretoria, Gauteng, South Africa</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p>&copy; {new Date().getFullYear()} Church Venue. All rights reserved.</p>
              <p className="popi-badge">
                <Shield size={14} />
                POPI Act Compliant
              </p>
            </div>
          </div>
        </div>
      </footer>

      {showPrivacy && (
        <div 
          className="privacy-policy-overlay"
          onClick={(e) => {
            // Close when clicking on overlay
            if (e.target === e.currentTarget) {
              setShowPrivacy(false);
            }
          }}
        >
          <div className="privacy-policy-modal" onClick={(e) => e.stopPropagation()}>
            <div className="privacy-policy-header">
              <h2>
                <Shield size={24} />
                Privacy Policy & POPI Compliance
              </h2>
              <button 
                className="close-button" 
                onClick={() => setShowPrivacy(false)}
                aria-label="Close privacy policy"
                type="button"
              >
                ×
              </button>
            </div>
            <div className="privacy-policy-body">
              <PrivacyPolicy showOnly={true} />
            </div>
            <div className="privacy-policy-footer">
              <button 
                className="btn btn-primary" 
                onClick={() => setShowPrivacy(false)}
                type="button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showTerms && (
        <TermsModal onClose={() => setShowTerms(false)} />
      )}
    </>
  );
};

const TermsModal = ({ onClose }) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div 
      className="terms-overlay"
      onClick={(e) => {
        // Close when clicking on overlay
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="terms-modal" onClick={(e) => e.stopPropagation()}>
        <div className="terms-header">
          <h2>
            <FileText size={24} />
            Terms & Conditions
          </h2>
          <button 
            className="close-button" 
            onClick={onClose}
            aria-label="Close terms and conditions"
            type="button"
          >
            ×
          </button>
        </div>
        <div className="terms-body">
          <div className="terms-content">
            <section>
              <h3>1. Acceptance of Terms</h3>
              <p>
                By accessing and using the Church Venue platform, you accept and agree to be bound by these 
                Terms and Conditions. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h3>2. Use of Service</h3>
              <p>You agree to use the service only for lawful purposes and in accordance with these Terms.</p>
              <ul>
                <li>You must be at least 18 years old to create an account</li>
                <li>You must provide accurate and complete information</li>
                <li>You are responsible for maintaining the security of your account</li>
                <li>You must not use the service for any illegal or unauthorized purpose</li>
              </ul>
            </section>

            <section>
              <h3>3. Booking Terms</h3>
              <p><strong>Venue Bookings:</strong></p>
              <ul>
                <li>Venues are available between 7:00 AM and 6:00 PM daily</li>
                <li>Bookings are subject to approval by the venue owner</li>
                <li>Cancellation policies vary by venue and will be communicated upon booking</li>
                <li>Full payment may be required to confirm bookings</li>
              </ul>
              <p><strong>Equipment Bookings:</strong></p>
              <ul>
                <li>Equipment availability is subject to confirmation</li>
                <li>You are responsible for the care and return of equipment in good condition</li>
                <li>Damage or loss of equipment may result in charges</li>
              </ul>
            </section>

            <section>
              <h3>4. Payment Terms</h3>
              <p>
                All prices are in South African Rand (ZAR). Payment terms will be specified at the time of booking. 
                We accept various payment methods as indicated during checkout.
              </p>
            </section>

            <section>
              <h3>5. Cancellation and Refunds</h3>
              <p>
                Cancellation policies are set by individual venue and equipment owners. Refunds, if applicable, 
                will be processed according to the specific cancellation policy for your booking.
              </p>
            </section>

            <section>
              <h3>6. Limitation of Liability</h3>
              <p>
                Church Venue acts as a platform connecting churches with venues and equipment. We are not 
                responsible for the quality, safety, or availability of listed venues or equipment. Users book 
                at their own risk.
              </p>
            </section>

            <section>
              <h3>7. Intellectual Property</h3>
              <p>
                All content on this platform, including text, graphics, logos, and software, is the property 
                of Church Venue or its content suppliers and is protected by copyright and other laws.
              </p>
            </section>

            <section>
              <h3>8. Privacy and Data Protection</h3>
              <p>
                Your use of this service is also governed by our Privacy Policy, which complies with the 
                Protection of Personal Information Act (POPI Act) of South Africa.
              </p>
            </section>

            <section>
              <h3>9. Modifications to Terms</h3>
              <p>
                We reserve the right to modify these Terms at any time. Continued use of the service after 
                changes constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section>
              <h3>10. Contact Information</h3>
              <p>
                For questions about these Terms, please contact us at:
              </p>
              <ul>
                <li><strong>Email:</strong> legal@churchvenue.co.za</li>
                <li><strong>Phone:</strong> +27 63 870 8865</li>
              </ul>
            </section>

            <p className="terms-date"><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-ZA')}</p>
          </div>
        </div>
        <div className="terms-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Footer;

