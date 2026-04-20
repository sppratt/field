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
    interestTags: [] as string[],
  });

  const careerInterests = [
    { id: 'analytical', label: 'Analytical', emoji: '🧠' },
    { id: 'creative', label: 'Creative', emoji: '🎨' },
    { id: 'hands_on', label: 'Hands-on', emoji: '🔧' },
    { id: 'social', label: 'Social', emoji: '🤝' },
    { id: 'problem_solving', label: 'Problem-solving', emoji: '🔍' },
  ];

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
        const interests = (profile.interests as string) || '';
        const parsedTags = interests.split(',').filter(tag => tag.trim()).map(tag => tag.trim());
        setFormData({
          name: profile.name || '',
          email: profile.email,
          interestTags: parsedTags,
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

  const handleInterestToggle = (tagId: string) => {
    setFormData(prev => {
      const isSelected = prev.interestTags.includes(tagId);
      return {
        ...prev,
        interestTags: isSelected
          ? prev.interestTags.filter(tag => tag !== tagId)
          : [...prev.interestTags, tagId],
      };
    });
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
        interests: formData.interestTags.join(', '),
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

        <div className={styles.layoutGrid}>
          {/* Main Column */}
          <div className={styles.mainColumn}>
            <form onSubmit={handleSaveProfile} className={styles.form}>
              {/* Basic Profile Info */}
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
                <h2>Career Interests</h2>
                <div className={styles.formGroup}>
                  <label>Select the skills and approaches that appeal to you</label>
                  <div className={styles.interestGrid}>
                    {careerInterests.map(interest => (
                      <label key={interest.id} className={styles.interestCheckbox}>
                        <input
                          type="checkbox"
                          checked={formData.interestTags.includes(interest.id)}
                          onChange={() => handleInterestToggle(interest.id)}
                        />
                        <span className={styles.interestLabel}>
                          <span className={styles.emoji}>{interest.emoji}</span>
                          <span className={styles.text}>{interest.label}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className={styles.hint}>
                    These help us recommend career pathways that match your strengths
                  </p>
                </div>
              </div>

              <div className={styles.formActions}>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>

          {/* Sidebar Column */}
          <div className={styles.sidebarColumn}>
            {/* Security Section */}
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

            {/* Account Info Card */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarCardTitle}>Account Status</h3>
              <div className={styles.sidebarCardContent}>
                <p><strong>Member since:</strong> {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}</p>
                <p><strong>Account type:</strong> {user.role === 'student' ? 'Student' : 'Teacher'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
