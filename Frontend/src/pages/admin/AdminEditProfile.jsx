import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, UserRound } from 'lucide-react';
import API from '../../api/axiosInstance';
import { AuthContext } from '../../context/AuthContext';

const AdminEditProfile = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setBio(user.bio || '');
      setPreview(user.avatar ? `http://localhost:5000${user.avatar}` : '');
    }
  }, [user]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setAvatar(file || null);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setSaving(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('bio', bio);
    if (avatar) formData.append('avatar', avatar);

    try {
      const response = await API.put('/user/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const token = localStorage.getItem('token');
      login(response.data, token);
      navigate('/admin/profile');
    } catch (requestError) {
      setMessage(requestError.response?.data?.message || 'Failed to update admin profile. Please try again.');
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">ACCOUNT SETTINGS</span>
          <h1>Edit profile</h1>
          <p>Update the name, contact details, and profile image for your admin account.</p>
        </div>
        <Link className="admin-button admin-button-secondary" to="/admin/profile">
          <ArrowLeft size={15} aria-hidden="true" /> Back to profile
        </Link>
      </header>

      <section className="admin-card">
        <div className="admin-card-heading">
          <div>
            <h2>Profile details</h2>
            <p>Your updated information will appear across the admin workspace.</p>
          </div>
        </div>

        {message && <div className="admin-alert admin-alert-error" role="alert">{message}</div>}

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-field">
            <label htmlFor="admin-avatar">Profile picture</label>
            {preview ? (
              <span className="admin-avatar"><img src={preview} alt="Profile preview" /></span>
            ) : (
              <span className="admin-avatar"><UserRound size={25} aria-hidden="true" /></span>
            )}
            <input
              className="admin-file-input"
              id="admin-avatar"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="admin-name">Name</label>
              <input id="admin-name" type="text" value={name} onChange={(event) => setName(event.target.value)} required />
            </div>
            <div className="admin-field">
              <label htmlFor="admin-email">Email address</label>
              <input id="admin-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>
          </div>

          <div className="admin-field">
            <label htmlFor="admin-bio">Bio <span className="admin-message-meta">(optional)</span></label>
            <textarea id="admin-bio" value={bio} onChange={(event) => setBio(event.target.value)} placeholder="A short introduction" />
          </div>

          <div className="admin-form-actions">
            <button className="admin-button" type="submit" disabled={saving}>
              <Save size={15} aria-hidden="true" /> {saving ? 'Saving changes…' : 'Save changes'}
            </button>
            <button className="admin-button admin-button-secondary" type="button" onClick={() => navigate('/admin/profile')}>
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AdminEditProfile;
