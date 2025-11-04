import React, { useState, useEffect } from 'react';
import type { User } from '../types/user';
import { getUserProfile, updateUserProfile } from '../utils/auth';
import { useUser } from '../contexts/UserContext';

interface UserProfileProps {
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const { user } = useUser();
  const [profile, setProfile] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      const userProfile = getUserProfile(user.id);
      setProfile(userProfile);
    }
    setLoading(false);
  }, [user]);

  const handleSave = async () => {
    if (!profile || !user) return;
    
    setSaving(true);
    const success = updateUserProfile(user.id, profile);
    
    if (success) {
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } else {
      setMessage('Failed to update profile');
    }
    
    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleInputChange = (field: keyof User) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!profile) return;
    setProfile(prev => prev ? { ...prev, [field]: e.target.value } : null);
  };

  const handleBankDetailsChange = (field: keyof User['bankDetails']) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile) return;
    setProfile(prev => prev ? {
      ...prev,
      bankDetails: { ...prev.bankDetails, [field]: e.target.value }
    } : null);
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="error">Profile not found</div>;
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h2>User Profile</h2>
        <div className="profile-actions">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="edit-btn">
              Edit Profile
            </button>
          ) : (
            <>
              <button onClick={handleSave} className="save-btn" disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={() => setIsEditing(false)} className="cancel-btn">
                Cancel
              </button>
            </>
          )}
          <button onClick={onClose} className="close-btn">Close</button>
        </div>
      </div>

      {message && <div className="message">{message}</div>}

      <div className="profile-content">
        <div className="profile-section">
          <h3>Personal Information</h3>
          {!isEditing ? (
            <div className="profile-display">
              <p><strong>Full Name:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Phone:</strong> {profile.phone}</p>
            </div>
          ) : (
            <div className="profile-edit">
              <div className="edit-field">
                <span className="field-label">Full Name:</span>
                <input
                  type="text"
                  value={profile.name}
                  onChange={handleInputChange('name')}
                />
              </div>
              <div className="edit-field">
                <span className="field-label">Email:</span>
                <input
                  type="email"
                  value={profile.email}
                  onChange={handleInputChange('email')}
                />
              </div>
              <div className="edit-field">
                <span className="field-label">Phone:</span>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={handleInputChange('phone')}
                />
              </div>
            </div>
          )}
        </div>

        <div className="profile-section">
          <h3>Business Information</h3>
          {!isEditing ? (
            <div className="profile-display">
              <p><strong>Business Name:</strong> {profile.businessName}</p>
              <p><strong>Business Address:</strong> {profile.businessAddress}</p>
              <p><strong>GST Number:</strong> {profile.gstNo || 'Not provided'}</p>
              <p><strong>Logo Path:</strong> {profile.logo || 'Not provided'}</p>
            </div>
          ) : (
            <div className="profile-edit">
              <div className="edit-field">
                <span className="field-label">Business Name:</span>
                <input
                  type="text"
                  value={profile.businessName}
                  onChange={handleInputChange('businessName')}
                />
              </div>
              <div className="edit-field">
                <span className="field-label">Business Address:</span>
                <textarea
                  value={profile.businessAddress}
                  onChange={handleInputChange('businessAddress')}
                  rows={3}
                />
              </div>
              <div className="edit-field">
                <span className="field-label">GST Number:</span>
                <input
                  type="text"
                  value={profile.gstNo}
                  onChange={handleInputChange('gstNo')}
                />
              </div>
              <div className="edit-field">
                <span className="field-label">Logo Path:</span>
                <input
                  type="text"
                  value={profile.logo || ''}
                  onChange={handleInputChange('logo')}
                  placeholder="e.g., public/logo.jpg"
                />
              </div>
            </div>
          )}
        </div>

        <div className="profile-section">
          <h3>Bank Details</h3>
          {!isEditing ? (
            <div className="profile-display">
              <p><strong>Bank Name:</strong> {profile.bankDetails.bankName || 'Not provided'}</p>
              <p><strong>Account Number:</strong> {profile.bankDetails.accountNo || 'Not provided'}</p>
              <p><strong>IFSC Code:</strong> {profile.bankDetails.ifsc || 'Not provided'}</p>
            </div>
          ) : (
            <div className="profile-edit">
              <div className="edit-field">
                <span className="field-label">Bank Name:</span>
                <input
                  type="text"
                  value={profile.bankDetails.bankName}
                  onChange={handleBankDetailsChange('bankName')}
                />
              </div>
              <div className="edit-field">
                <span className="field-label">Account Number:</span>
                <input
                  type="text"
                  value={profile.bankDetails.accountNo}
                  onChange={handleBankDetailsChange('accountNo')}
                />
              </div>
              <div className="edit-field">
                <span className="field-label">IFSC Code:</span>
                <input
                  type="text"
                  value={profile.bankDetails.ifsc}
                  onChange={handleBankDetailsChange('ifsc')}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;