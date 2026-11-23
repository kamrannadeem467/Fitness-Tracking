import { useContext, useEffect, useState } from 'react';
import { Activity, ArrowRight, ChartNoAxesColumnIncreasing, Dumbbell, Salad, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../api/axiosInstance';
import { AuthContext } from '../../context/AuthContext';
import DashboardAnalytics from '../../components/userLayout/home/userdashboard/DashboardAnalytics';

const UserDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await API.get('/dashboard');
      setDashboardData(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="portal-page"><div className="portal-empty" role="status">Getting your wellness overview ready…</div></div>;
  }

  if (error) {
    return (
      <div className="portal-page">
        <div className="portal-page-heading">
          <div><span className="portal-eyebrow">YOUR WELLNESS, YOUR WAY</span><h1>Your overview</h1></div>
        </div>
        <div className="portal-alert portal-alert-error" role="alert">{error}</div>
        <button className="portal-button" type="button" onClick={fetchDashboardData}>Try again</button>
      </div>
    );
  }

  const stats = [
    { label: 'Workouts logged', value: dashboardData?.stats?.totalWorkouts ?? 0, icon: Dumbbell },
    { label: 'Meal entries', value: dashboardData?.stats?.totalNutritionLogs ?? 0, icon: Salad },
    { label: 'Latest weight', value: dashboardData?.stats?.currentWeight ? `${dashboardData.stats.currentWeight} kg` : '—', icon: Scale },
  ];

  const quickLinks = [
    { to: '/user/workouts', label: 'Log a workout', description: 'Keep your training history up to date', icon: Dumbbell },
    { to: '/user/nutrition', label: 'Add a meal', description: 'Make a note of what is fueling your day', icon: Salad },
    { to: '/user/progress', label: 'Record progress', description: 'Capture a new milestone or check-in', icon: ChartNoAxesColumnIncreasing },
  ];

  return (
    <div className="portal-page">
      <div className="portal-page-heading">
        <div>
          <span className="portal-eyebrow">YOUR WELLNESS, YOUR WAY</span>
          <h1>Welcome back, {user?.name?.split(' ')[0] || 'friend'}.</h1>
          <p>Here is a snapshot of your journey. Keep showing up, one small step at a time.</p>
        </div>
      </div>

      <div className="portal-summary-grid">
        {stats.map(({ label, value, icon: Icon }) => (
          <div className="portal-summary-card" key={label}>
            <span><Icon size={17} aria-hidden="true" /></span>
            <strong>{value}</strong>
            <small>{label}</small>
          </div>
        ))}
      </div>

      <div className="portal-dashboard-grid">
        <section className="portal-card">
          <div className="portal-card-heading">
            <div>
              <h2>Small steps, steady progress</h2>
              <p>Choose one thing to focus on today.</p>
            </div>
            <Activity size={19} color="var(--app-accent)" aria-hidden="true" />
          </div>
          <div className="portal-quick-links">
            {quickLinks.map(({ to, label, description, icon: Icon }) => (
              <Link className="portal-quick-link" to={to} key={to}>
                <span><Icon size={17} aria-hidden="true" /></span>
                <span className="portal-quick-link-copy">
                  <strong>{label}</strong>
                  <small>{description}</small>
                </span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>

        <section className="portal-card">
          <div className="portal-card-heading">
            <div>
              <h2>Your next step</h2>
              <p>Build a routine that feels right for you.</p>
            </div>
          </div>
          <div className="portal-entry-detail">
            Your dashboard brings your activity together. Visit your trackers whenever you want to add a workout, meal, or progress check-in.
          </div>
          <Link className="portal-button" style={{ marginTop: '18px' }} to="/user/profile">
            View your profile <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </section>
      </div>

      <DashboardAnalytics
        workoutActivity={dashboardData?.workoutActivity}
        nutritionActivity={dashboardData?.nutritionActivity}
        progressHistory={dashboardData?.progressHistory}
      />
    </div>
  );
};

export default UserDashboard;
