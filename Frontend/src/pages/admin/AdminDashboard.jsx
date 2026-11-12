import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowRight, BadgeCheck, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get('http://localhost:5000/api/admin/dashboard', config);
        setStats(data.stats);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Failed to load admin stats. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  return (
    <div className="admin-page">
      <header className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">OVERVIEW</span>
          <h1>Dashboard</h1>
          <p>Keep an eye on your community and the latest account activity.</p>
        </div>
        <Link className="admin-button admin-button-secondary" to="/admin/users">
          View all users <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </header>

      {error && <div className="admin-alert admin-alert-error" role="alert">{error}</div>}

      {loading ? (
        <div className="admin-card admin-loading" role="status">Loading dashboard statistics…</div>
      ) : !error ? (
        <>
          <section className="admin-stat-grid" aria-label="User statistics">
            <article className="admin-stat-card is-blue">
              <span className="admin-stat-icon"><UsersRound size={21} aria-hidden="true" /></span>
              <div>
                <small>Total registered users</small>
                <strong>{stats?.totalUsers ?? 0}</strong>
              </div>
            </article>
            <article className="admin-stat-card">
              <span className="admin-stat-icon"><BadgeCheck size={21} aria-hidden="true" /></span>
              <div>
                <small>Verified users</small>
                <strong>{stats?.verifiedUsers ?? 0}</strong>
              </div>
            </article>
          </section>

          <section className="admin-card">
            <div className="admin-card-heading">
              <div>
                <h2>Quick actions</h2>
                <p>Jump directly to the areas you manage most.</p>
              </div>
            </div>
            <div className="admin-quick-links">
              <Link className="admin-button" to="/admin/users">
                <UsersRound size={16} aria-hidden="true" /> Manage users
              </Link>
              <Link className="admin-button admin-button-secondary" to="/admin/contacts">
                Open contact messages <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
};

export default AdminDashboard;
