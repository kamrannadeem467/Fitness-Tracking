import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import API from '../../api/axiosInstance';
import { AuthContext } from '../../context/AuthContext';
import PortalAuthLayout from '../../components/userLayout/PortalAuthLayout';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const finishLogin = (user, token) => {
    login(user, token);
    navigate(user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      finishLogin(data.user, data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/google-login', { token: credentialResponse.credential });
      finishLogin(data.user, data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortalAuthLayout
      eyebrow="WELCOME BACK"
      headline={<>Good habits<br />start with a<br />single step.</>}
      description="Sign in to pick up where you left off and keep your wellness journey moving."
      title="Welcome back"
      subtitle="Sign in to access your personal wellness space."
    >
      {error && <div className="portal-alert portal-alert-error" role="alert">{error}</div>}
      <form className="portal-auth-form" onSubmit={handleSubmit}>
        <div className="portal-field">
          <label htmlFor="login-email">Email address</label>
          <input id="login-email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </div>
        <div className="portal-field">
          <label htmlFor="login-password">Password</label>
          <div className="portal-password-field">
            <input id="login-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            <button type="button" className="portal-password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((visible) => !visible)}>
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>
        <div className="portal-auth-options">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
        <button className="portal-button portal-auth-submit" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div className="portal-auth-divider">or continue with</div>
      <div className="portal-auth-google">
        <GoogleLogin
          theme="outline"
          size="large"
          shape="pill"
          text="signin_with"
          logo_alignment="center"
          width={360}
          onSuccess={handleGoogleSuccess}
          onError={() => setError('Google sign-in failed. Please try again.')}
        />
      </div>
      <div className="portal-auth-links portal-auth-register-link">
        <span>New to Wellnest?</span><Link to="/user/register">Create an account</Link>
      </div>
    </PortalAuthLayout>
  );
};

export default UserLogin;
