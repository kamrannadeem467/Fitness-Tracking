import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, KeyRound, LockKeyhole } from 'lucide-react';
import API from '../../api/axiosInstance';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Your new password and confirmation do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Your new password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const response = await API.put('/user/change-password', { currentPassword, newPassword });
      setMessage(response.data.message || 'Your password has been updated.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portal-page">
      <div className="portal-page-heading">
        <div>
          <span className="portal-eyebrow">ACCOUNT SETTINGS</span>
          <h1>Change password</h1>
          <p>Choose a password you have not used before to help keep your account secure.</p>
        </div>
      </div>

      <section className="portal-card portal-security-card">
        <div className="portal-card-heading">
          <div>
            <h2>Update your password</h2>
            <p>Use at least 6 characters for your new password.</p>
          </div>
          <span className="portal-security-icon"><LockKeyhole size={19} aria-hidden="true" /></span>
        </div>
        {message && <div className="portal-alert portal-alert-success" role="status">{message}</div>}
        {error && <div className="portal-alert portal-alert-error" role="alert">{error}</div>}

        <form className="portal-form portal-security-form" onSubmit={handleSubmit}>
          <div className="portal-field">
            <label htmlFor="current-password">Current password</label>
            <input id="current-password" type={showPasswords ? 'text' : 'password'} autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required />
          </div>
          <div className="portal-field">
            <label htmlFor="new-password">New password</label>
            <input id="new-password" type={showPasswords ? 'text' : 'password'} autoComplete="new-password" minLength="6" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required />
          </div>
          <div className="portal-field">
            <label htmlFor="confirm-password">Confirm new password</label>
            <input id="confirm-password" type={showPasswords ? 'text' : 'password'} autoComplete="new-password" minLength="6" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
          </div>
          <div className="portal-form-actions">
            <button className="portal-button" type="submit" disabled={loading}>
              <KeyRound size={15} aria-hidden="true" /> {loading ? 'Updating password…' : 'Update password'}
            </button>
            <button className="portal-button portal-button-secondary" type="button" onClick={() => setShowPasswords((visible) => !visible)}>
              {showPasswords ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
              {showPasswords ? 'Hide passwords' : 'Show passwords'}
            </button>
          </div>
        </form>
      </section>

      <div className="portal-security-note">
        <LockKeyhole size={16} aria-hidden="true" />
        <span>Never share your password. Wellnest will never ask you to send it by email.</span>
        <Link to="/user/profile">Back to profile</Link>
      </div>
    </div>
  );
};

export default ChangePassword;
