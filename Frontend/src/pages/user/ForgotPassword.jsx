import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, KeyRound, MailCheck } from 'lucide-react';
import API from '../../api/axiosInstance';
import PortalAuthLayout from '../../components/userLayout/PortalAuthLayout';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/forgot-password', { email });
      setSuccessMsg(data.message || 'A reset code has been sent to your email.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send a reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/reset-password', { email, otp, newPassword });
      setSuccessMsg(data.message || 'Your password has been reset. You can now sign in.');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired reset code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortalAuthLayout
      eyebrow="ACCOUNT RECOVERY"
      headline={<>A fresh start<br />is just a<br />few steps away.</>}
      description="We will help you securely reset your password and get you back to your wellness space."
      title={step === 3 ? 'Password updated' : step === 2 ? 'Reset your password' : 'Forgot password?'}
      subtitle={step === 3 ? 'Your password has been changed successfully.' : step === 2 ? 'Enter the reset code from your email and choose a new password.' : 'Enter the email linked to your account and we will send a reset code.'}
    >
      {error && <div className="portal-alert portal-alert-error" role="alert">{error}</div>}
      {successMsg && step === 2 && <div className="portal-alert portal-alert-success" role="status">{successMsg}</div>}

      {step === 1 && (
        <form className="portal-auth-form" onSubmit={handleSendOtp}>
          <div className="portal-field">
            <label htmlFor="reset-email">Email address</label>
            <input id="reset-email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <button className="portal-button portal-auth-submit" type="submit" disabled={loading}>
            <MailCheck size={16} aria-hidden="true" /> {loading ? 'Sending code…' : 'Send reset code'}
          </button>
        </form>
      )}

      {step === 2 && (
        <form className="portal-auth-form" onSubmit={handleResetPassword}>
          <div className="portal-verification-note">
            <span><MailCheck size={18} aria-hidden="true" /></span>
            <div><small>RESET CODE SENT TO</small><strong>{email}</strong></div>
          </div>
          <div className="portal-field">
            <label htmlFor="reset-otp">6-digit reset code</label>
            <input className="portal-auth-otp" id="reset-otp" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} placeholder="000000" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))} required />
          </div>
          <div className="portal-field">
            <label htmlFor="reset-password">New password</label>
            <input id="reset-password" type="password" autoComplete="new-password" minLength="6" placeholder="At least 6 characters" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required />
          </div>
          <button className="portal-button portal-auth-submit" type="submit" disabled={loading}>
            <KeyRound size={15} aria-hidden="true" /> {loading ? 'Updating password…' : 'Reset password'}
          </button>
          <button className="portal-auth-back portal-auth-back-button" type="button" onClick={() => { setStep(1); setError(''); setSuccessMsg(''); }}>
            Use a different email
          </button>
        </form>
      )}

      {step === 3 && (
        <div className="portal-auth-complete">
          <span><Check size={25} aria-hidden="true" /></span>
          <p>{successMsg}</p>
          <Link className="portal-button portal-auth-submit" to="/user/login">Continue to sign in</Link>
        </div>
      )}

      {step !== 3 && (
        <Link className="portal-auth-back" to="/user/login">Back to sign in</Link>
      )}
    </PortalAuthLayout>
  );
};

export default ForgotPassword;
