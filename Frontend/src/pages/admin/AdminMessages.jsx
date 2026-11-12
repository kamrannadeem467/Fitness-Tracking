import { useEffect, useState } from 'react';
import axios from 'axios';
import { Mail, Search, Trash2 } from 'lucide-react';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [deletingId, setDeletingId] = useState('');

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get('http://localhost:5000/api/contact/messages', config);
      setMessages(data.messages || []);
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to load messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    setError('');
    setNotice('');
    setDeletingId(id);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:5000/api/contact/messages/${id}`, config);
      setMessages((currentMessages) => currentMessages.filter((message) => message._id !== id));
      setNotice('Message deleted successfully.');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to delete message.');
    } finally {
      setDeletingId('');
    }
  };

  const filteredMessages = messages.filter((message) => (
    `${message.name || ''} ${message.email || ''} ${message.message || ''}`.toLowerCase().includes(search.toLowerCase())
  ));

  return (
    <div className="admin-page">
      <header className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">INBOX</span>
          <h1>Contact messages</h1>
          <p>Read and follow up on messages sent through the public contact form.</p>
        </div>
        <span className="admin-badge is-green"><Mail size={13} aria-hidden="true" /> {messages.length} messages</span>
      </header>

      {error && <div className="admin-alert admin-alert-error" role="alert">{error}</div>}
      {notice && <div className="admin-alert admin-alert-success" role="status">{notice}</div>}

      <section className="admin-card">
        <div className="admin-card-heading">
          <div>
            <h2>Your inbox</h2>
            <p>Messages are shown with the newest submissions first.</p>
          </div>
          <label className="admin-search">
            <Search size={16} aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search messages"
              aria-label="Search contact messages"
            />
          </label>
        </div>

        {loading ? (
          <div className="admin-loading" role="status">Loading messages…</div>
        ) : filteredMessages.length ? (
          <div>
            {filteredMessages.map((message) => (
              <article className="admin-message-card" key={message._id}>
                <div className="admin-message-top">
                  <div className="admin-message-sender">
                    <strong>{message.name}</strong>
                    <a href={`mailto:${message.email}`}>{message.email}</a>
                  </div>
                  <time className="admin-message-date" dateTime={message.createdAt}>
                    {new Date(message.createdAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </time>
                </div>
                <p className="admin-message-body">{message.message}</p>
                <div className="admin-message-actions">
                  <button
                    className="admin-button admin-button-danger"
                    type="button"
                    onClick={() => handleDelete(message._id)}
                    disabled={deletingId === message._id}
                  >
                    <Trash2 size={14} aria-hidden="true" />
                    {deletingId === message._id ? 'Deleting…' : 'Delete message'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="admin-empty">
            {search ? 'No messages match your search.' : 'No contact messages have arrived yet.'}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminMessages;
