import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Dumbbell } from 'lucide-react';
import API from '../../api/axiosInstance';
import { AuthContext } from '../../context/AuthContext';
import './WorkoutNotificationBell.css';

const getDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const WorkoutNotificationBell = ({ variant = 'portal' }) => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [todayKey, setTodayKey] = useState(() => getDateKey(new Date()));
  const notificationRef = useRef(null);
  const isOpenRef = useRef(false);
  const userId = user?._id || user?.id || user?.email;
  const storageKey = userId ? `wellnest-read-workout-notifications:${userId}` : '';
  const unreadCount = notifications.filter((plan) => !readIds.includes(plan._id)).length;

  const fetchNotifications = useCallback(async () => {
    if (!storageKey) return;

    setLoading(true);
    try {
      const { data } = await API.get('/workout-plans/overdue', { params: { today: todayKey } });
      setNotifications(data);

      let savedIds = [];
      let storageError = '';
      try {
        const stored = localStorage.getItem(storageKey);
        const parsed = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(parsed)) throw new Error('Saved notification state is invalid.');
        savedIds = parsed.filter((id) => typeof id === 'string');
      } catch {
        storageError = 'Could not read saved notification status.';
      }

      const activeReadIds = savedIds.filter((id) => data.some((plan) => plan._id === id));
      const visibleReadIds = isOpenRef.current
        ? [...new Set([...activeReadIds, ...data.map((plan) => plan._id)])]
        : activeReadIds;
      setReadIds(visibleReadIds);
      try {
        localStorage.setItem(storageKey, JSON.stringify(visibleReadIds));
      } catch {
        storageError = 'Could not save notification read status.';
      }
      setError(storageError);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load workout notifications.');
    } finally {
      setLoading(false);
    }
  }, [storageKey, todayKey]);

  useEffect(() => {
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timeout = window.setTimeout(
      () => setTodayKey(getDateKey(new Date())),
      nextMidnight.getTime() - now.getTime() + 100,
    );
    return () => window.clearTimeout(timeout);
  }, [todayKey]);

  useEffect(() => {
    if (!storageKey) return undefined;
    const initialRequest = window.setTimeout(fetchNotifications, 0);
    window.addEventListener('workout-plans-updated', fetchNotifications);
    return () => {
      window.clearTimeout(initialRequest);
      window.removeEventListener('workout-plans-updated', fetchNotifications);
    };
  }, [fetchNotifications, storageKey]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOnOutsideClick = (event) => {
      if (!notificationRef.current?.contains(event.target)) {
        isOpenRef.current = false;
        setIsOpen(false);
      }
    };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick);
  }, [isOpen]);

  const togglePanel = () => {
    const opening = !isOpen;
    isOpenRef.current = opening;
    setIsOpen(opening);
    if (!opening || loading || !notifications.length) return;

    const nextReadIds = [...new Set([...readIds, ...notifications.map((plan) => plan._id)])];
    setReadIds(nextReadIds);
    try {
      localStorage.setItem(storageKey, JSON.stringify(nextReadIds));
    } catch {
      setError('Could not save notification read status.');
    }
  };

  return (
    <div className={`workout-notification-wrap${variant === 'site' ? ' is-site' : ''}`} ref={notificationRef}>
      <button
        className="workout-notification-button"
        type="button"
        aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : 'Notifications'}
        aria-expanded={isOpen}
        onClick={togglePanel}
      >
        <Bell size={19} aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="workout-notification-count">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>
      {isOpen && (
        <div className="workout-notification-panel" role="region" aria-label="Notifications">
          <div className="workout-notification-heading">
            <strong>Workout notifications</strong>
            {unreadCount > 0 && <span>{unreadCount} new</span>}
          </div>
          {loading ? (
            <div className="workout-notification-empty" role="status">Checking for missed workouts…</div>
          ) : error ? (
            <div className="workout-notification-error" role="alert">
              <span>{error}</span>
              <button type="button" onClick={fetchNotifications}>Try again</button>
            </div>
          ) : notifications.length ? (
            <div className="workout-notification-list">
              {notifications.map((plan) => (
                <Link
                  className={`workout-notification-item${readIds.includes(plan._id) ? '' : ' is-unread'}`}
                  key={plan._id}
                  to="/user/workouts"
                  onClick={() => {
                    isOpenRef.current = false;
                    setIsOpen(false);
                  }}
                >
                  <span className="workout-notification-icon"><Dumbbell size={16} aria-hidden="true" /></span>
                  <span className="workout-notification-copy">
                    <strong>Workout missed</strong>
                    <small>{plan.title} · {new Date(`${plan.planDate}T00:00:00`).toLocaleDateString()}</small>
                  </span>
                  {!readIds.includes(plan._id) && <span className="workout-notification-unread-dot" />}
                </Link>
              ))}
            </div>
          ) : (
            <div className="workout-notification-empty">No missed workouts. Keep it up!</div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkoutNotificationBell;
