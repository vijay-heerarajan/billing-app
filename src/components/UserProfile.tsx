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
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={handleInputChange('name')}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={handleInputChange('email')}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={handleInputChange('phone')}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="profile-section">
          <h3>Business Information</h3>
          <div className="form-group">
            <label>Business Name</label>
            <input
              type="text"
              value={profile.businessName}
              onChange={handleInputChange('businessName')}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Business Address</label>
            <textarea
              value={profile.businessAddress}
              onChange={handleInputChange('businessAddress')}
              disabled={!isEditing}
              rows={3}
            />
          </div>
          <div className="form-group">
            <label>GST Number</label>
            <input
              type="text"
              value={profile.gstNo}
              onChange={handleInputChange('gstNo')}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="profile-section">
          <h3>Bank Details</h3>
          <div className="form-group">
            <label>Bank Name</label>
            <input
              type="text"
              value={profile.bankDetails.bankName}
              onChange={handleBankDetailsChange('bankName')}
              disabled={!isEditing}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Account Number</label>
              <input
                type="text"
                value={profile.bankDetails.accountNo}
                onChange={handleBankDetailsChange('accountNo')}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>IFSC Code</label>
              <input
                type="text"
                value={profile.bankDetails.ifsc}
                onChange={handleBankDetailsChange('ifsc')}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;