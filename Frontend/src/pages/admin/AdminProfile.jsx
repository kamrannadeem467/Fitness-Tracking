import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Pencil, ShieldCheck } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const AdminProfile = () => {
  const { user } = useContext(AuthContext);
  const initials = user?.name?.trim()?.charAt(0) || 'A';

  return (
    <div className="admin-page">
      <header className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">ACCOUNT</span>
          <h1>Admin profile</h1>
          <p>Manage your administrator details and account information.</p>
        </div>
        <Link className="admin-button" to="/admin/profile/edit">
          <Pencil size={15} aria-hidden="true" /> Edit profile
        </Link>
      </header>

      <section className="admin-card admin-profile-card">
        <div className="admin-profile-summary">
          <span className="admin-avatar" aria-hidden="true">
            {user?.avatar ? <img src={`http://localhost:5000${user.avatar}`} alt="" /> : initials}
          </span>
          <h2>{user?.name || 'Administrator'}</h2>
          <span className="admin-badge is-green"><ShieldCheck size={12} aria-hidden="true" /> {user?.role || 'Admin'}</span>
        </div>
        <div className="admin-profile-details">
          <div className="admin-card-heading">
            <div>
              <h2>Personal information</h2>
              <p>Your profile details are only used to identify your administrator account.</p>
            </div>
          </div>
          <div className="admin-profile-detail">
            <small>Name</small>
            <strong>{user?.name || 'Not provided'}</strong>
          </div>
          <div className="admin-profile-detail">
            <small>Email address</small>
            <strong><Mail size={14} aria-hidden="true" /> {user?.email || 'Not provided'}</strong>
          </div>
          <div className="admin-profile-detail">
            <small>Bio</small>
            <strong>{user?.bio || 'No bio added yet.'}</strong>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminProfile;
