import { useContext } from 'react';
import { Activity, ArrowRight, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Footer = () => {
  const { token, user } = useContext(AuthContext);
  const accountPath = user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';

  return (
    <footer className="site-footer" style={{ padding: '1rem 2rem 1rem 2rem' }}>
      <div className="site-footer-container site-footer-main">
        <div className="site-footer-about">
          <Link className="site-brand" to="/home" aria-label="Wellnest home">
            <span className="site-brand-mark"><Activity size={19} aria-hidden="true" /></span>
            <span>wellnest<span className="site-brand-period">.</span></span>
          </Link>
          <p>A little more consistency, a little more confidence. Keep your fitness journey simple and make progress at your own pace.</p>
        </div>

        <div>
          <h2 className="site-footer-heading">Explore</h2>
          <nav className="site-footer-links" aria-label="Explore">
            <Link to="/home">Home</Link>
            <Link to="/about">About us</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>

        <div>
          <h2 className="site-footer-heading">Your toolkit</h2>
          <nav className="site-footer-links" aria-label="Wellness tools">
            <Link to="/user/workouts">Workout tracker</Link>
            <Link to="/user/nutrition">Nutrition tracker</Link>
            <Link to="/user/progress">Progress tracker</Link>
          </nav>
        </div>

        <div className="site-footer-cta">
          <h2 className="site-footer-heading">{token ? 'Keep it going' : 'Ready when you are'}</h2>
          <p>{token ? 'Pick up where you left off and keep building healthy habits.' : 'Make your next healthy step a little easier.'}</p>
          <Link to={token ? accountPath : '/user/register'}>
            {token ? 'Go to dashboard' : 'Get started'} <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="site-footer-container site-footer-bottom">
        <p>© {new Date().getFullYear()} Wellnest. Your journey, your pace.</p>
        <a href="#top">Back to top <ArrowUp size={13} aria-hidden="true" /></a>
      </div>
    </footer>
  );
};

export default Footer;