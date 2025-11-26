import React, { useState, useEffect } from 'react';
import { X, FileText, Shield, Lock, Eye, CheckCircle } from 'lucide-react';
import './PrivacyPolicy.css';

const PrivacyPolicy = ({ onAccept, onClose, showOnly = false }) => {
  const [accepted, setAccepted] = useState(false);

  // Handle escape key to close (must be before any early returns)
  useEffect(() => {
    if (!showOnly && onClose) {
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [onClose, showOnly]);

  const handleAccept = () => {
    if (accepted) {
      localStorage.setItem('privacy_policy_accepted', 'true');
      localStorage.setItem('privacy_policy_accepted_date', new Date().toISOString());
      if (onAccept) onAccept();
    }
  };

  if (showOnly) {
    return (
      <div className="privacy-policy-content">
        <h2>Privacy Policy & POPI Compliance</h2>
        <div className="privacy-sections">
          <section>
            <h3><Shield size={20} /> Protection of Personal Information Act (POPI) Compliance</h3>
            <p>
              This system complies with the Protection of Personal Information Act (POPI Act) of South Africa. 
              We are committed to protecting your personal information and ensuring your privacy rights are respected.
            </p>
          </section>

          <section>
            <h3><Lock size={20} /> Information We Collect</h3>
            <p>We collect the following personal information:</p>
            <ul>
              <li><strong>Church Information:</strong> Name, email address, phone number, physical address</li>
              <li><strong>Booking Information:</strong> Booking dates, times, and preferences</li>
              <li><strong>Payment Information:</strong> Payment details (processed securely through third-party providers)</li>
              <li><strong>Usage Data:</strong> Website usage patterns and preferences</li>
            </ul>
          </section>

          <section>
            <h3><Eye size={20} /> How We Use Your Information</h3>
            <p>Your personal information is used for:</p>
            <ul>
              <li>Processing and managing venue and equipment bookings</li>
              <li>Communicating with you about bookings and services</li>
              <li>Improving our services and user experience</li>
              <li>Complying with legal obligations</li>
              <li>Preventing fraud and ensuring security</li>
            </ul>
          </section>

          <section>
            <h3><CheckCircle size={20} /> Your Rights Under POPI</h3>
            <p>You have the right to:</p>
            <ul>
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
              <li><strong>Objection:</strong> Object to processing of your personal information</li>
              <li><strong>Complaint:</strong> Lodge a complaint with the Information Regulator</li>
            </ul>
          </section>

          <section>
            <h3><Lock size={20} /> Data Security</h3>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction. This includes:
            </p>
            <ul>
              <li>Encryption of sensitive data</li>
              <li>Secure server infrastructure</li>
              <li>Regular security audits</li>
              <li>Access controls and authentication</li>
            </ul>
          </section>

          <section>
            <h3><FileText size={20} /> Data Retention</h3>
            <p>
              We retain your personal information only for as long as necessary to fulfill the purposes for which 
              it was collected, comply with legal obligations, resolve disputes, and enforce our agreements.
            </p>
          </section>

          <section>
            <h3><Shield size={20} /> Third-Party Sharing</h3>
            <p>
              We do not sell your personal information. We may share information with:
            </p>
            <ul>
              <li>Service providers who assist in operating our platform (under strict confidentiality agreements)</li>
              <li>Legal authorities when required by law</li>
              <li>Other parties with your explicit consent</li>
            </ul>
          </section>

          <section>
            <h3><FileText size={20} /> Contact Information</h3>
            <p>
              For questions about this Privacy Policy or to exercise your rights under POPI, please contact us:
            </p>
            <ul>
              <li><strong>Email:</strong> privacy@churchvenue.co.za</li>
              <li><strong>Phone:</strong> +27 63 870 8865</li>
              <li><strong>Address:</strong> [Your Physical Address]</li>
            </ul>
            <p>
              <strong>Information Regulator:</strong><br />
              Website: <a href="https://www.justice.gov.za/inforeg/" target="_blank" rel="noopener noreferrer">www.justice.gov.za/inforeg/</a><br />
              Email: inforeg@justice.gov.za
            </p>
          </section>

          <section>
            <h3><FileText size={20} /> Updates to This Policy</h3>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes 
              by posting the new policy on this page and updating the "Last Updated" date.
            </p>
            <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-ZA')}</p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="privacy-policy-overlay"
      onClick={(e) => {
        // Close when clicking on overlay (not the modal itself)
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
    >
      <div className="privacy-policy-modal" onClick={(e) => e.stopPropagation()}>
        <div className="privacy-policy-header">
          <h2>
            <Shield size={24} />
            Privacy Policy & POPI Compliance
          </h2>
          {onClose && (
            <button 
              className="close-button" 
              onClick={onClose}
              aria-label="Close privacy policy"
              type="button"
            >
              <X size={20} />
            </button>
          )}
        </div>
        <div className="privacy-policy-body">
          <div className="privacy-policy-content">
            <div className="privacy-sections">
              <section>
                <h3><Shield size={20} /> Protection of Personal Information Act (POPI) Compliance</h3>
                <p>
                  This system complies with the Protection of Personal Information Act (POPI Act) of South Africa. 
                  We are committed to protecting your personal information and ensuring your privacy rights are respected.
                </p>
              </section>

              <section>
                <h3><Lock size={20} /> Information We Collect</h3>
                <p>We collect the following personal information:</p>
                <ul>
                  <li><strong>Church Information:</strong> Name, email address, phone number, physical address</li>
                  <li><strong>Booking Information:</strong> Booking dates, times, and preferences</li>
                  <li><strong>Payment Information:</strong> Payment details (processed securely through third-party providers)</li>
                  <li><strong>Usage Data:</strong> Website usage patterns and preferences</li>
                </ul>
              </section>

              <section>
                <h3><Eye size={20} /> How We Use Your Information</h3>
                <p>Your personal information is used for:</p>
                <ul>
                  <li>Processing and managing venue and equipment bookings</li>
                  <li>Communicating with you about bookings and services</li>
                  <li>Improving our services and user experience</li>
                  <li>Complying with legal obligations</li>
                  <li>Preventing fraud and ensuring security</li>
                </ul>
              </section>

              <section>
                <h3><CheckCircle size={20} /> Your Rights Under POPI</h3>
                <p>You have the right to:</p>
                <ul>
                  <li><strong>Access:</strong> Request access to your personal information</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
                  <li><strong>Objection:</strong> Object to processing of your personal information</li>
                  <li><strong>Complaint:</strong> Lodge a complaint with the Information Regulator</li>
                </ul>
              </section>

              <section>
                <h3><Lock size={20} /> Data Security</h3>
                <p>
                  We implement appropriate technical and organizational measures to protect your personal information 
                  against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </section>

              <section>
                <h3><FileText size={20} /> Contact Information</h3>
                <p>
                  For questions about this Privacy Policy or to exercise your rights under POPI, please contact us:
                </p>
                <ul>
                  <li><strong>Email:</strong> privacy@churchvenue.co.za</li>
                  <li><strong>Phone:</strong> +27 63 870 8865</li>
                </ul>
                <p>
                  <strong>Information Regulator:</strong><br />
                  Website: <a href="https://www.justice.gov.za/inforeg/" target="_blank" rel="noopener noreferrer">www.justice.gov.za/inforeg/</a><br />
                  Email: inforeg@justice.gov.za
                </p>
              </section>
            </div>
          </div>
        </div>
        <div className="privacy-policy-footer">
          <label className="accept-checkbox" htmlFor="privacy-accept-checkbox">
            <input
              id="privacy-accept-checkbox"
              name="privacyAccepted"
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            <span>I have read and agree to the Privacy Policy and understand my rights under POPI</span>
          </label>
          <div className="privacy-policy-actions">
            {onClose && (
              <button 
                className="btn btn-secondary" 
                onClick={onClose}
                type="button"
              >
                Cancel
              </button>
            )}
            <button 
              className="btn btn-primary" 
              onClick={handleAccept}
              disabled={!accepted}
              type="button"
            >
              <CheckCircle size={18} />
              Accept & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

