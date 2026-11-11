import { useContext, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Activity,
  ChartNoAxesColumnIncreasing,
  Dumbbell,
  LayoutDashboard,
  LogOut,
  Menu,
  Salad,
  Settings,
  UserRound,
  X,
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import './Portal.css';

const navigation = [
  { to: '/user/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/user/workouts', label: 'Workouts', icon: Dumbbell },
  { to: '/user/nutrition', label: 'Nutrition', icon: Salad },
  { to: '/user/progress', label: 'Progress', icon: ChartNoAxesColumnIncreasing },
];

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/user/login');
  };

  return (
    <div className="portal-shell">
      {sidebarOpen && (
        <button
          className="portal-sidebar-backdrop"
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside className={`portal-sidebar${sidebarOpen ? ' is-open' : ''}`}>
        <div className="portal-brand-row">
          <Link className="portal-brand" to="/user/dashboard">
            <span className="portal-brand-mark"><Activity size={19} aria-hidden="true" /></span>
            <span>wellnest<span>.</span></span>
          </Link>
          <button
            type="button"
            className="portal-sidebar-close"
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={19} />
          </button>
        </div>

        <div className="portal-sidebar-label">YOUR SPACE</div>
        <nav className="portal-nav" aria-label="User dashboard">
          {navigation.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              className={({ isActive }) => `portal-nav-link${isActive ? ' is-active' : ''}`}
              end={end}
              key={to}
              onClick={() => setSidebarOpen(false)}
              to={to}
            >
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="portal-sidebar-bottom">
          <div className="portal-sidebar-label">ACCOUNT</div>
          <NavLink
            className={({ isActive }) => `portal-nav-link${isActive ? ' is-active' : ''}`}
            onClick={() => setSidebarOpen(false)}
            to="/user/profile"
          >
            <UserRound size={18} aria-hidden="true" />
            <span>My profile</span>
          </NavLink>
          <NavLink
            className={({ isActive }) => `portal-nav-link${isActive ? ' is-active' : ''}`}
            onClick={() => setSidebarOpen(false)}
            to="/user/change-password"
          >
            <Settings size={18} aria-hidden="true" />
            <span>Settings</span>
          </NavLink>
          <button className="portal-logout" onClick={handleLogout} type="button">
            <LogOut size={17} aria-hidden="true" />
            <span>Log out</span>
          </button>
          <div className="portal-sidebar-user">
            <span className="portal-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
            <span className="portal-sidebar-user-copy">
              <strong>{user?.name || 'Your account'}</strong>
              <small>{user?.email || 'Wellnest member'}</small>
            </span>
          </div>
        </div>
      </aside>

      <div className="portal-main">
        <header className="portal-topbar">
          <button
            className="portal-menu-button"
            type="button"
            aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen((open) => !open)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="portal-topbar-copy">
            <span>YOUR WELLNESS, YOUR WAY</span>
            <strong>Good to see you, {user?.name?.split(' ')[0] || 'friend'}</strong>
          </div>
          <NavLink className="portal-topbar-profile" to="/user/profile" aria-label="Open profile">
            <span className="portal-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
          </NavLink>
        </header>

        <main className="portal-content">
          <Outlet />
        </main>
        <footer className="portal-footer">
          <span>© {new Date().getFullYear()} Wellnest</span>
          <span>Small steps, steady progress.</span>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
