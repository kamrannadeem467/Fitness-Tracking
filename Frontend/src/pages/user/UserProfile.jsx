import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, LockKeyhole, Pencil, UserRound } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const avatarUrl = user?.avatar ? `http://localhost:5000${user.avatar}` : '';
  const initial = user?.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="portal-page">
      <div className="portal-page-heading">
        <div>
          <span className="portal-eyebrow">YOUR ACCOUNT</span>
          <h1>My profile</h1>
          <p>Manage your personal information and account preferences.</p>
        </div>
      </div>

      <section className="portal-card portal-profile-card">
        <div className="portal-profile-header">
          {avatarUrl ? (
            <img className="portal-profile-avatar" src={avatarUrl} alt={`${user?.name || 'Your'} profile`} />
          ) : (
            <span className="portal-profile-avatar portal-profile-placeholder" aria-hidden="true">{initial}</span>
          )}
          <div>
            <h2>{user?.name || 'Your name'}</h2>
            <p>{user?.email || 'Add an email address to your account'}</p>
            <span className="portal-badge">{user?.role || 'member'}</span>
          </div>
        </div>

        <div className="portal-profile-details">
          <div className="portal-profile-detail">
            <span>Full name</span>
            <strong>{user?.name || 'Not added yet'}</strong>
          </div>
          <div className="portal-profile-detail">
            <span>Email address</span>
            <strong>{user?.email || 'Not added yet'}</strong>
          </div>
          <div className="portal-profile-detail">
            <span>About you</span>
            <strong>{user?.bio || 'Add a short bio to tell us about yourself.'}</strong>
          </div>
          <div className="portal-profile-detail">
            <span>Account type</span>
            <strong>{user?.role || 'Member'}</strong>
          </div>
        </div>

        <div className="portal-form-actions">
          <Link className="portal-button" to="/user/profile/edit"><Pencil size={15} aria-hidden="true" /> Edit profile</Link>
          <Link className="portal-button portal-button-secondary" to="/user/change-password">
            <LockKeyhole size={15} aria-hidden="true" /> Change password <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="portal-card portal-profile-card">
        <div className="portal-card-heading">
          <div>
            <h2>Make it yours</h2>
            <p>Your profile is a simple place to keep your account details up to date.</p>
          </div>
          <UserRound size={19} color="#1b7a56" aria-hidden="true" />
        </div>
        <Link className="portal-quick-link" to="/user/profile/edit">
          <span><Pencil size={16} aria-hidden="true" /></span>
          <span className="portal-quick-link-copy">
            <strong>Update your details</strong>
            <small>Change your name, email, bio, or profile picture</small>
          </span>
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
};

export default UserProfile;
