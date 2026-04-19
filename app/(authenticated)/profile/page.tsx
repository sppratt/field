'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUserProfile } from '@/lib/db/users';
import { updateUserProfile, changePassword } from '@/lib/db/profile';
import type { User } from '@/lib/db/types';
import styles from './Profile.module.css';
import { Button } from '@/app/components/Button';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interests: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getCurrentUserProfile();
        if (!profile) {
          router.push('/auth/login');
          return;
        }
        setUser(profile);
        setFormData({
          name: profile.name || '',
          email: profile.email,
          interests: (profile.interests as string) || '',
        });
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      if (!user) return;

      const { error: updateError } = await updateUserProfile(user.id, {
        name: formData.name,
        interests: formData.interests,
      });

      if (updateError) {
        setError(updateError);
      } else {
        setSuccess('Profile updated successfully!');
        setUser(prev => prev ? { ...prev, name: formData.name } : null);
      }
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSaving(true);

    try {
      const { error: pwError } = await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      if (pwError) {
        setError(pwError);
      } else {
        setSuccess('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordForm(false);
      }
    } catch (err) {
      setError('Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.container}><p>Loading profile...</p></div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Profile Settings</h1>

        {error && <div className={styles.errorMessage}>{error}</div>}
        {success && <div className={styles.successMessage}>{success}</div>}

        {/* Basic Profile Info */}
        <form onSubmit={handleSaveProfile} className={styles.form}>
          <div className={styles.formSection}>
            <h2>Basic Information</h2>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                disabled
                className={styles.disabledInput}
              />
              <p className={styles.hint}>Email cannot be changed</p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="role">Role</label>
              <input
                type="text"
                id="role"
                value={user.role === 'student' ? 'Student' : 'Teacher'}
                disabled
                className={styles.disabledInput}
              />
            </div>
          </div>

          {/* Interests */}
          <div className={styles.formSection}>
            <h2>Interests & Goals</h2>
            <div className={styles.formGroup}>
              <label htmlFor="interests">
                Tell us about your career interests and goals
              </label>
              <textarea
                id="interests"
                name="interests"
                value={formData.interests}
                onChange={handleInputChange}
                placeholder="E.g., Interested in tech, healthcare, creative fields..."
                rows={4}
              />
              <p className={styles.hint}>
                This helps us recommend relevant career pathways
              </p>
            </div>
          </div>

          <div className={styles.formActions}>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>

        {/* Password Section */}
        <div className={styles.formSection}>
          <h2>Security</h2>
          {!showPasswordForm ? (
            <Button variant="secondary" onClick={() => setShowPasswordForm(true)}>
              Change Password
            </Button>
          ) : (
            <form onSubmit={handleChangePassword} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
                <p className={styles.hint}>At least 6 characters</p>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className={styles.formActions}>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Updating...' : 'Update Password'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setError(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
