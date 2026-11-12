import { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, Menu, X } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import './UserLayout.css';

const Header = () => {
  const { user, token, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/user/login');
  };

  const linkClassName = ({ isActive }) =>
    `site-header-link${isActive ? ' is-active' : ''}`;

  return (
    <header className="site-header" id="top">
      <div className="site-header-inner">
        <Link className="site-brand" to="/home" aria-label="Wellnest home">
          <span className="site-brand-mark"><Activity size={20} aria-hidden="true" /></span>
          <span>wellnest<span className="site-brand-period">.</span></span>
        </Link>

        <button
          className="site-menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>

        <nav
          className={`site-navigation${menuOpen ? ' is-open' : ''}`}
          id="site-navigation"
          aria-label="Main navigation"
        >
          <div className="site-navigation-links">
            <NavLink className={linkClassName} to="/home" end>Home</NavLink>
            <NavLink className={linkClassName} to="/about">About</NavLink>
            <NavLink className={linkClassName} to="/contact">Contact</NavLink>
            {token && (
              user?.role === 'admin' ? (
                <>
                  <NavLink className={linkClassName} to="/admin/dashboard">Dashboard</NavLink>
                  <NavLink className={linkClassName} to="/admin/profile">Profile</NavLink>
                </>
              ) : (
                <>
                  <NavLink className={linkClassName} to="/user/dashboard">Dashboard</NavLink>
                  <NavLink className={linkClassName} to="/user/profile">My profile</NavLink>
                </>
              )
            )}
          </div>

          <div className="site-header-actions">
            {token ? (
              <>
                <span className="site-user-greeting">
                  Hi, {user?.name?.split(' ')[0] || 'there'}
                </span>
                {/* <button className="site-header-button site-header-button-quiet" onClick={handleLogout} type="button">
                  Log out
                </button> */}
              </>
            ) : (
              <>
                <Link className="site-header-login" to="/user/login">Sign In</Link>
                <Link className="site-header-button" to="/user/register">
                  Get started <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
