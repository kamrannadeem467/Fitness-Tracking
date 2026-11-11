import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Save } from 'lucide-react';
import API from '../../api/axiosInstance';
import { AuthContext } from '../../context/AuthContext';

const EditProfile = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(user?.avatar ? `http://localhost:5000${user.avatar}` : '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setBio(user.bio || '');
      setPreview(user.avatar ? `http://localhost:5000${user.avatar}` : '');
    }
  }, [user]);

  useEffect(() => () => {
    if (preview.startsWith('blob:')) URL.revokeObjectURL(preview);
  }, [preview]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
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
      navigate('/user/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="portal-page">
      <div className="portal-page-heading">
        <div>
          <span className="portal-eyebrow">YOUR ACCOUNT</span>
          <h1>Edit profile</h1>
          <p>Keep your account details current and make your profile feel like you.</p>
        </div>
        <Link className="portal-button portal-button-secondary" to="/user/profile">
          <ArrowLeft size={15} aria-hidden="true" /> Back to profile
        </Link>
      </div>

      <section className="portal-card portal-profile-card">
        <div className="portal-card-heading">
          <div>
            <h2>Personal details</h2>
            <p>Your profile information is used to personalize your account.</p>
          </div>
        </div>
        {message && <div className="portal-alert portal-alert-success" role="status">{message}</div>}
        {error && <div className="portal-alert portal-alert-error" role="alert">{error}</div>}

        <form className="portal-form" onSubmit={handleSubmit}>
          <div className="portal-avatar-editor">
            {preview ? (
              <img className="portal-profile-avatar" src={preview} alt="Profile preview" />
            ) : (
              <span className="portal-profile-avatar portal-profile-placeholder" aria-hidden="true">
                {name.charAt(0).toUpperCase() || 'U'}
              </span>
            )}
            <div className="portal-avatar-editor-copy">
              <strong>Profile picture</strong>
              <label className="portal-button portal-button-secondary portal-file-label" htmlFor="profile-avatar">
                <Camera size={15} aria-hidden="true" /> Choose image
              </label>
              <input className="portal-visually-hidden" id="profile-avatar" type="file" accept="image/*" onChange={handleFileChange} />
            </div>
          </div>

          <div className="portal-form-grid">
            <div className="portal-field">
              <label htmlFor="profile-name">Full name</label>
              <input id="profile-name" type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required />
            </div>
            <div className="portal-field">
              <label htmlFor="profile-email">Email address</label>
              <input id="profile-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>
          </div>
          <div className="portal-field">
            <label htmlFor="profile-bio">About you</label>
            <textarea id="profile-bio" value={bio} onChange={(event) => setBio(event.target.value)} placeholder="Share a little about yourself…" rows="4" />
          </div>
          <div className="portal-form-actions">
            <button className="portal-button" type="submit" disabled={saving}>
              <Save size={15} aria-hidden="true" /> {saving ? 'Saving changes…' : 'Save changes'}
            </button>
            <Link className="portal-button portal-button-secondary" to="/user/profile">Cancel</Link>
          </div>
        </form>
      </section>
    </div>
  );
};

export default EditProfile;
