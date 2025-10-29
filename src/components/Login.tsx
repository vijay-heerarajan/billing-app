import React, { useState } from 'react';
import type { LoginCredentials, AuthUser } from '../types/user';
import { loginUser } from '../utils/auth';

interface LoginProps {
  onLogin: (user: AuthUser) => void;
  onShowRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onShowRegister }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = loginUser(credentials);
    
    if (result.success && result.user) {
      onLogin(result.user);
    } else {
      setError(result.error || 'Login failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login to Billing App</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={credentials.email}
              onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              required
            />
          </div>
          
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="auth-switch">
          <p>Don't have an account? <button onClick={onShowRegister} className="link-btn">Register here</button></p>
        </div>
      </div>
    </div>
  );
};

export default Login;