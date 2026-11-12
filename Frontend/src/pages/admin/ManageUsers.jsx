import { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, ShieldCheck, UsersRound } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const ManageUsers = () => {
  const { user: currentAdmin } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [pendingUserId, setPendingUserId] = useState('');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get('http://localhost:5000/api/admin/users', config);
      setUsers(data.users || []);
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    setError('');
    setNotice('');
    setPendingUserId(id);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, config);
      setUsers((currentUsers) => currentUsers.filter((item) => item._id !== id));
      setNotice('User deleted successfully.');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to delete user.');
    } finally {
      setPendingUserId('');
    }
  };

  const handleRoleChange = async (id, newRole) => {
    setError('');
    setNotice('');
    setPendingUserId(id);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.patch(`http://localhost:5000/api/admin/users/${id}/role`, { role: newRole }, config);
      setUsers((currentUsers) => currentUsers.map((item) => (
        item._id === id ? { ...item, role: newRole } : item
      )));
      setNotice('User role updated successfully.');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to update user role.');
    } finally {
      setPendingUserId('');
    }
  };

  const filteredUsers = users.filter((item) => (
    `${item.name || ''} ${item.email || ''} ${item.role || ''}`.toLowerCase().includes(search.toLowerCase())
  ));

  return (
    <div className="admin-page">
      <header className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">PEOPLE</span>
          <h1>Manage users</h1>
          <p>Review accounts, verification status, and admin access.</p>
        </div>
        <span className="admin-badge is-green"><UsersRound size={13} aria-hidden="true" /> {users.length} accounts</span>
      </header>

      {error && <div className="admin-alert admin-alert-error" role="alert">{error}</div>}
      {notice && <div className="admin-alert admin-alert-success" role="status">{notice}</div>}

      <section className="admin-card">
        <div className="admin-card-heading">
          <div>
            <h2>User directory</h2>
            <p>Changing an account’s role takes effect as soon as the update is saved.</p>
          </div>
          <label className="admin-search">
            <Search size={16} aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search users"
              aria-label="Search users"
            />
          </label>
        </div>

        {loading ? (
          <div className="admin-loading" role="status">Loading users…</div>
        ) : filteredUsers.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Verification</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((item) => {
                  const isSelf = item._id === currentAdmin?._id;
                  return (
                    <tr key={item._id}>
                      <td className="admin-table-primary">
                        {item.name || 'Unnamed user'} {isSelf && <span className="admin-badge">You</span>}
                      </td>
                      <td>{item.email}</td>
                      <td>
                        <select
                          className="admin-select"
                          aria-label={`Role for ${item.name || item.email}`}
                          value={item.role}
                          onChange={(event) => handleRoleChange(item._id, event.target.value)}
                          disabled={isSelf || pendingUserId === item._id}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        <span className={`admin-badge${item.isVerified ? ' is-green' : ' is-amber'}`}>
                          <ShieldCheck size={12} aria-hidden="true" />
                          {item.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td>
                        {isSelf ? (
                          <span className="admin-message-meta">Your account</span>
                        ) : (
                          <button
                            className="admin-button admin-button-danger"
                            type="button"
                            onClick={() => handleDelete(item._id)}
                            disabled={pendingUserId === item._id}
                          >
                            {pendingUserId === item._id ? 'Updating…' : 'Delete'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty">
            {search ? 'No users match your search.' : 'No user accounts to show yet.'}
          </div>
        )}
      </section>
    </div>
  );
};

export default ManageUsers;
