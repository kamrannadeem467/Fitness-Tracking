import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 👉 useNavigate import kiya
import { LogOut, Menu, X } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const AdminHeader = ({ onMenuToggle, isSidebarOpen }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate(); // 👉 Hook initialize kiya
  
  const initials = user?.name?.trim()?.charAt(0) || 'A';

  // 👉 Handle Logout with redirection
  const handleLogout = () => {
    logout(); // Auth state aur localStorage clear karega
    navigate('/user/login', { replace: true }); // Login page par redirect kar dega
  };

  return (
    <header className="admin-header">
      <button
        className="admin-menu-button"
        type="button"
        aria-label={isSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
        onClick={onMenuToggle}
      >
        {isSidebarOpen ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}
      </button>
      
      <div className="admin-header-copy">
        <span>Wellnest · Administration</span>
        <strong>Control center</strong>
      </div>
      
      <div className="admin-header-actions">
        <Link className="admin-header-profile" to="/admin/profile">
          <span className="admin-avatar" aria-hidden="true">
            {user?.avatar ? <img src={`http://localhost:5000${user.avatar}`} alt="" /> : initials}
          </span>
          <span>{user?.name || 'Administrator'}</span>
        </Link>
        
        {/* 👉 onClick mein ab handleLogout function lagaya hai */}
        <button className="admin-logout-button" type="button" onClick={handleLogout}>
          <LogOut size={15} aria-hidden="true" />
          Log out
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;