import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Check, X } from 'lucide-react';
import PrivacyPolicy from '../components/PrivacyPolicy';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    zip_code: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswordCriteria, setShowPasswordCriteria] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if privacy policy was already accepted
    const accepted = localStorage.getItem('privacy_policy_accepted');
    if (accepted === 'true') {
      setPrivacyAccepted(true);
    }
    // Don't automatically show popup - let user interact with form first
  }, []);

  // Password criteria validation - must match backend exactly
  const passwordCriteria = useMemo(() => {
    const pwd = formData.password;
    if (!pwd || pwd.length === 0) {
      return {
        minLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false,
      };
    }
    return {
      minLength: pwd.length >= 8,
      hasUpperCase: /[A-Z]/.test(pwd),
      hasLowerCase: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      // Match backend regex exactly: /[!@#$%^&*(),.?":{}|<>]/
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    };
  }, [formData.password]);

  const isPasswordValid = formData.password.length > 0 && Object.values(passwordCriteria).every(Boolean);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!privacyAccepted) {
      setError('You must accept the Privacy Policy to register');
      setShowPrivacyPolicy(true);
      return;
    }

    // Validate password before submission
    if (!formData.password || formData.password.length === 0) {
      setError('Password is required');
      return;
    }

    if (!isPasswordValid) {
      const missingCriteria = [];
      if (!passwordCriteria.minLength) missingCriteria.push('at least 8 characters');
      if (!passwordCriteria.hasUpperCase) missingCriteria.push('one uppercase letter');
      if (!passwordCriteria.hasLowerCase) missingCriteria.push('one lowercase letter');
      if (!passwordCriteria.hasNumber) missingCriteria.push('one number');
      if (!passwordCriteria.hasSpecialChar) missingCriteria.push('one special character (!@#$%^&*(),.?":{}|<>)');
      
      setError(`Password must contain: ${missingCriteria.join(', ')}`);
      return;
    }

    if (!formData.confirmPassword || formData.confirmPassword.length === 0) {
      setError('Please confirm your password');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    // Only send fields that the backend expects
    // Remove confirmPassword and any other frontend-only fields
    const { confirmPassword, ...registerData } = formData;
    // Don't send privacy_accepted or privacy_accepted_date - backend doesn't need them
    const result = await register(registerData);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handlePrivacyAccept = () => {
    setPrivacyAccepted(true);
    setShowPrivacyPolicy(false);
    setError(''); // Clear any previous errors
  };

  // Handle escape key to close privacy policy
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showPrivacyPolicy) {
        setShowPrivacyPolicy(false);
        if (!privacyAccepted) {
          setError('You must accept the Privacy Policy to register');
        }
      }
    };
    if (showPrivacyPolicy) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showPrivacyPolicy, privacyAccepted]);

  return (
    <div className="register-page">
      <div className="container">
        <div className="auth-card">
          <h2>Register Your Church</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="church-name">Church Name *</label>
              <input
                id="church-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                onFocus={() => setShowPasswordCriteria(true)}
                onBlur={() => {
                  // Keep criteria visible if password has value
                  if (formData.password.length === 0) {
                    setShowPasswordCriteria(false);
                  }
                }}
                className={
                  formData.password.length > 0 && !isPasswordValid 
                    ? 'input-error' 
                    : formData.password.length > 0 && isPasswordValid 
                    ? 'input-valid' 
                    : ''
                }
                required
              />
              {showPasswordCriteria && formData.password.length > 0 && (
                <div className="password-criteria">
                  <div className="criteria-title">Password must contain:</div>
                  <div className={`criteria-item ${passwordCriteria.minLength ? 'valid' : 'invalid'}`}>
                    {passwordCriteria.minLength ? <Check size={16} /> : <X size={16} />}
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`criteria-item ${passwordCriteria.hasUpperCase ? 'valid' : 'invalid'}`}>
                    {passwordCriteria.hasUpperCase ? <Check size={16} /> : <X size={16} />}
                    <span>One uppercase letter</span>
                  </div>
                  <div className={`criteria-item ${passwordCriteria.hasLowerCase ? 'valid' : 'invalid'}`}>
                    {passwordCriteria.hasLowerCase ? <Check size={16} /> : <X size={16} />}
                    <span>One lowercase letter</span>
                  </div>
                  <div className={`criteria-item ${passwordCriteria.hasNumber ? 'valid' : 'invalid'}`}>
                    {passwordCriteria.hasNumber ? <Check size={16} /> : <X size={16} />}
                    <span>One number</span>
                  </div>
                  <div className={`criteria-item ${passwordCriteria.hasSpecialChar ? 'valid' : 'invalid'}`}>
                    {passwordCriteria.hasSpecialChar ? <Check size={16} /> : <X size={16} />}
                    <span>One special character (!@#$%^&*(),.?":{}|&lt;&gt;)</span>
                  </div>
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password *</label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={
                  formData.confirmPassword.length > 0 && !passwordsMatch
                    ? 'input-error'
                    : formData.confirmPassword.length > 0 && passwordsMatch
                    ? 'input-valid'
                    : ''
                }
                required
              />
              {formData.confirmPassword.length > 0 && (
                <div className={`password-match ${passwordsMatch ? 'match' : 'no-match'}`}>
                  {passwordsMatch ? (
                    <>
                      <Check size={16} /> Passwords match
                    </>
                  ) : (
                    <>
                      <X size={16} /> Passwords do not match
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="province">Province</label>
                <select
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                >
                  <option value="">Select Province</option>
                  <option value="Eastern Cape">Eastern Cape</option>
                  <option value="Free State">Free State</option>
                  <option value="Gauteng">Gauteng</option>
                  <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                  <option value="Limpopo">Limpopo</option>
                  <option value="Mpumalanga">Mpumalanga</option>
                  <option value="Northern Cape">Northern Cape</option>
                  <option value="North West">North West</option>
                  <option value="Western Cape">Western Cape</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="zip-code">Zip Code</label>
                <input
                  id="zip-code"
                  name="zip_code"
                  type="text"
                  value={formData.zip_code}
                  onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tell us about your church..."
              />
            </div>
            {error && <div className="error">{error}</div>}
            <div className="privacy-acceptance">
              <label className="privacy-checkbox-label" htmlFor="register-privacy-checkbox">
                <input
                  id="register-privacy-checkbox"
                  name="privacyAccepted"
                  type="checkbox"
                  checked={privacyAccepted}
                  onChange={(e) => {
                    if (e.target.checked) {
                      // Show privacy policy when user checks the box
                      setShowPrivacyPolicy(true);
                    } else {
                      // Uncheck if user unchecks
                      setPrivacyAccepted(false);
                    }
                  }}
                  className="privacy-checkbox"
                />
                <span className="privacy-text">
                  I accept the{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPrivacyPolicy(true);
                    }}
                    className="privacy-link"
                    aria-label="View Privacy Policy"
                  >
                    Privacy Policy
                  </button>
                  {' '}and understand my rights under POPI Act
                </span>
              </label>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading || !privacyAccepted} style={{ width: '100%', marginTop: '15px' }}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <p className="auth-link">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
      {showPrivacyPolicy && (
        <PrivacyPolicy
          onAccept={handlePrivacyAccept}
          onClose={() => {
            setShowPrivacyPolicy(false);
            // If they close without accepting, uncheck the box
            if (!privacyAccepted) {
              // Don't show error immediately - let them try again
              // The error will show if they try to submit
            }
          }}
        />
      )}
    </div>
  );
};

export default Register;

