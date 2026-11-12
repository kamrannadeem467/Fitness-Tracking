import { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Activity, LayoutDashboard, Mail, UserRound, UsersRound } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const navigationItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Manage users', icon: UsersRound },
  { to: '/admin/contacts', label: 'Contact messages', icon: Mail },
  { to: '/admin/profile', label: 'Admin profile', icon: UserRound },
];

const AdminSidebar = ({ isOpen, onNavigate }) => {
  const { user } = useContext(AuthContext);
  const initials = user?.name?.trim()?.charAt(0) || 'A';

  return (
    <aside className={`admin-sidebar${isOpen ? ' is-open' : ''}`}>
      <Link className="admin-brand" to="/admin/dashboard" onClick={onNavigate}>
        <span className="admin-brand-mark"><Activity size={20} aria-hidden="true" /></span>
        <span>
          Wellnest
          <small>Admin workspace</small>
        </span>
      </Link>
      <div className="admin-sidebar-label">Workspace</div>
      <nav className="admin-nav" aria-label="Admin navigation">
        {navigationItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            className={({ isActive }) => `admin-nav-link${isActive ? ' is-active' : ''}`}
            key={to}
            to={to}
            onClick={onNavigate}
          >
            <Icon size={17} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="admin-sidebar-footer">
        <span className="admin-avatar" aria-hidden="true">
          {user?.avatar ? <img src={`http://localhost:5000${user.avatar}`} alt="" /> : initials}
        </span>
        <span className="admin-sidebar-user">
          <strong>{user?.name || 'Administrator'}</strong>
          <small>{user?.email || 'Admin account'}</small>
        </span>
      </div>
    </aside>
  );
};

export default AdminSidebar;
