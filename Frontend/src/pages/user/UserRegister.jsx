import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Eye, EyeOff, MailCheck } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import API from '../../api/axiosInstance';
import { AuthContext } from '../../context/AuthContext';
import PortalAuthLayout from '../../components/userLayout/PortalAuthLayout';

const UserRegister = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', formData);
      setSuccessMsg(data.message || 'A verification code has been sent to your email.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create your account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/verify-otp', { email: formData.email, otp });
      setSuccessMsg(data.message || 'Your email has been verified. You can now sign in.');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/google-login', { token: credentialResponse.credential });
      login(data.user, data.token);
      navigate(data.user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Google sign-up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortalAuthLayout
      eyebrow="YOUR NEXT CHAPTER"
      headline={<>Build habits<br />that feel good<br />to keep.</>}
      description="Create your Wellnest account and bring your workouts, nutrition, and progress into one calm, simple space."
      title={step === 3 ? 'You’re all set' : step === 2 ? 'Verify your email' : 'Create your account'}
      subtitle={step === 3 ? 'Your email is verified and your account is ready.' : step === 2 ? 'Enter the 6-digit code we sent to your inbox.' : 'A few details are all you need to get started.'}
    >
      {error && <div className="portal-alert portal-alert-error" role="alert">{error}</div>}
      {successMsg && step === 2 && <div className="portal-alert portal-alert-success" role="status">{successMsg}</div>}

      {step === 1 && (
        <form className="portal-auth-form" onSubmit={handleRegisterSubmit}>
          <div className="portal-field">
            <label htmlFor="register-name">Full name</label>
            <input id="register-name" type="text" name="name" autoComplete="name" placeholder="Your name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="portal-field">
            <label htmlFor="register-email">Email address</label>
            <input id="register-email" type="email" name="email" autoComplete="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="portal-field">
            <label htmlFor="register-password">Password</label>
            <div className="portal-password-field">
              <input id="register-password" type={showPassword ? 'text' : 'password'} name="password" autoComplete="new-password" minLength="6" placeholder="At least 6 characters" value={formData.password} onChange={handleChange} required />
              <button type="button" className="portal-password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((visible) => !visible)}>
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>
          <button className="portal-button portal-auth-submit" type="submit" disabled={loading}>
            {loading ? 'Sending verification code…' : 'Create account'}
          </button>
        </form>
      )}

      {step === 2 && (
        <form className="portal-auth-form" onSubmit={handleVerifyOtpSubmit}>
          <div className="portal-verification-note">
            <span><MailCheck size={18} aria-hidden="true" /></span>
            <div><small>CODE SENT TO</small><strong>{formData.email}</strong></div>
          </div>
          <div className="portal-field">
            <label htmlFor="register-otp">6-digit verification code</label>
            <input
              className="portal-auth-otp"
              id="register-otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))}
              required
            />
          </div>
          <button className="portal-button portal-auth-submit" type="submit" disabled={loading}>
            {loading ? 'Verifying…' : 'Verify email'}
          </button>
          <button className="portal-auth-back portal-auth-back-button" type="button" onClick={() => { setStep(1); setError(''); setSuccessMsg(''); }}>
            Change account details
          </button>
        </form>
      )}

      {step === 3 && (
        <div className="portal-auth-complete">
          <span><Check size={25} aria-hidden="true" /></span>
          <p>Your account is ready. Sign in to start using your personal wellness tools.</p>
          <Link className="portal-button portal-auth-submit" to="/user/login">Go to sign in</Link>
        </div>
      )}

      {step === 1 && (
        <>
          <div className="portal-auth-divider">or sign up with</div>
          <div className="portal-auth-google">
            <GoogleLogin
              text="signup_with"
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google sign-up failed. Please try again.')}
            />
          </div>
        </>
      )}

      {step !== 3 && (
        <div className="portal-auth-links portal-auth-register-link">
          <span>Already have an account?</span><Link to="/user/login">Sign in</Link>
        </div>
      )}
    </PortalAuthLayout>
  );
};

export default UserRegister;
