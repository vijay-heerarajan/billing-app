import React, { useState } from 'react';
import type { RegisterData, AuthUser } from '../types/user';
import { registerUser } from '../utils/auth';

interface RegisterProps {
  onRegister: (user: AuthUser) => void;
  onShowLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onShowLogin }) => {
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    name: '',
    businessName: '',
    businessAddress: '',
    phone: '',
    gstNo: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const result = registerUser(formData);
    
    if (result.success && result.user) {
      onRegister(result.user);
    } else {
      setError(result.error || 'Registration failed');
    }
    
    setLoading(false);
  };

  const handleInputChange = (field: keyof RegisterData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="auth-container">
      <div className="auth-form register-form">
        <h2>Register for Billing App</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange('name')}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange('email')}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange('password')}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <input
              type="text"
              placeholder="Business Name"
              value={formData.businessName}
              onChange={handleInputChange('businessName')}
              required
            />
          </div>
          
          <div className="form-group">
            <textarea
              placeholder="Business Address"
              value={formData.businessAddress}
              onChange={handleInputChange('businessAddress')}
              required
              rows={3}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="GST Number (Optional)"
                value={formData.gstNo}
                onChange={handleInputChange('gstNo')}
              />
            </div>
          </div>
          
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <div className="auth-switch">
          <p>Already have an account? <button onClick={onShowLogin} className="link-btn">Login here</button></p>
        </div>
      </div>
    </div>
  );
};

export default Register;