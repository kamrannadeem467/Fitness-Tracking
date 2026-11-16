import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Check, CheckCircle2, ChevronLeft, ChevronRight, ListChecks, Plus, Trash2 } from 'lucide-react';
import API from '../../api/axiosInstance';

const formatDateInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getPeriodRange = (date, view) => {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (view === 'week') {
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return { start, end };
  }

  return {
    start: new Date(date.getFullYear(), date.getMonth(), 1),
    end: new Date(date.getFullYear(), date.getMonth() + 1, 0),
  };
};

const WorkoutPlanner = () => {
  const [view, setView] = useState('week');
  const [anchorDate, setAnchorDate] = useState(() => new Date());
  const [plans, setPlans] = useState([]);
  const [overduePlans, setOverduePlans] = useState([]);
  const [todayKey, setTodayKey] = useState(() => formatDateInput(new Date()));
  const [planDate, setPlanDate] = useState(() => formatDateInput(new Date()));
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('strength');
  const [loadedRange, setLoadedRange] = useState('');
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState('');
  const [deletingId, setDeletingId] = useState('');
  const [error, setError] = useState('');
  const [overdueError, setOverdueError] = useState('');
  const [message, setMessage] = useState('');
  const [completionNotice, setCompletionNotice] = useState('');

  const { start, end } = useMemo(
    () => getPeriodRange(anchorDate, view),
    [anchorDate, view],
  );
  const startDate = formatDateInput(start);
  const endDate = formatDateInput(end);
  const rangeKey = `${startDate}:${endDate}`;
  const selectedPlanDate = planDate < startDate || planDate > endDate ? startDate : planDate;
  const loading = loadedRange !== rangeKey;
  const plansByDate = useMemo(() => plans.reduce((grouped, plan) => {
    grouped[plan.planDate] = [...(grouped[plan.planDate] || []), plan];
    return grouped;
  }, {}), [plans]);
  const completedCount = plans.filter((plan) => plan.completed).length;
  const periodLabel = view === 'week'
    ? `${start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`
    : anchorDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  useEffect(() => {
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timeout = window.setTimeout(
      () => setTodayKey(formatDateInput(new Date())),
      nextMidnight.getTime() - now.getTime() + 100,
    );

    return () => window.clearTimeout(timeout);
  }, [todayKey]);

  useEffect(() => {
    let active = true;

    API.get('/workout-plans', { params: { startDate, endDate } })
      .then(({ data }) => {
        if (active) {
          setPlans(data);
          setError('');
        }
      })
      .catch((err) => {
        if (active) setError(err.response?.data?.message || 'Could not load your workout plan.');
      })
      .finally(() => {
        if (active) setLoadedRange(rangeKey);
      });

    return () => {
      active = false;
    };
  }, [startDate, endDate, rangeKey]);

  useEffect(() => {
    let active = true;

    API.get('/workout-plans/overdue', { params: { today: todayKey } })
      .then(({ data }) => {
        if (active) {
          setOverduePlans(data);
          setOverdueError('');
        }
      })
      .catch((err) => {
        if (active) setOverdueError(err.response?.data?.message || 'Could not check for missed workouts.');
      });

    return () => {
      active = false;
    };
  }, [todayKey]);

  useEffect(() => {
    if (!completionNotice) return undefined;
    const timeout = window.setTimeout(() => setCompletionNotice(''), 3500);
    return () => window.clearTimeout(timeout);
  }, [completionNotice]);

  const changePeriod = (amount) => {
    setAnchorDate((current) => {
      if (view === 'week') {
        const next = new Date(current);
        next.setDate(next.getDate() + amount * 7);
        return next;
      }
      return new Date(current.getFullYear(), current.getMonth() + amount, 1);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const { data } = await API.post('/workout-plans', { title, category, planDate: selectedPlanDate });
      window.dispatchEvent(new Event('workout-plans-updated'));
      setPlans((current) => [...current, data].sort((a, b) => (
        a.planDate.localeCompare(b.planDate) || a.createdAt.localeCompare(b.createdAt)
      )));
      if (!data.completed && data.planDate < todayKey) {
        setOverduePlans((current) => [...current, data]);
      }
      setTitle('');
      setCategory('strength');
      setMessage('Workout added to your plan.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save your workout plan.');
    } finally {
      setSaving(false);
    }
  };

  const toggleCompleted = async (plan) => {
    setUpdatingId(plan._id);
    setError('');
    setMessage('');

    try {
      const { data } = await API.patch(`/workout-plans/${plan._id}`, { completed: !plan.completed });
      window.dispatchEvent(new Event('workout-plans-updated'));
      setPlans((current) => current.map((item) => (item._id === data._id ? data : item)));
      setOverduePlans((current) => {
        const remaining = current.filter((item) => item._id !== data._id);
        return !data.completed && data.planDate < todayKey ? [...remaining, data] : remaining;
      });
      setCompletionNotice(data.completed ? data.title : '');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update this planned workout.');
    } finally {
      setUpdatingId('');
    }
  };

  const deletePlan = async (plan) => {
    setDeletingId(plan._id);
    setError('');
    setMessage('');

    try {
      await API.delete(`/workout-plans/${plan._id}`);
      window.dispatchEvent(new Event('workout-plans-updated'));
      setPlans((current) => current.filter((item) => item._id !== plan._id));
      setOverduePlans((current) => current.filter((item) => item._id !== plan._id));
      setMessage('Planned workout removed.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not remove this planned workout.');
    } finally {
      setDeletingId('');
    }
  };

  return (
    <section className="portal-card workout-planner">
      <div className="portal-card-heading workout-planner-heading">
        <div>
          <h2>Workout plan</h2>
          <p>Choose what you want to do this week or month, one day at a time.</p>
        </div>
        <div className="workout-planner-views" aria-label="Planning period">
          <button type="button" className={view === 'week' ? 'is-active' : ''} onClick={() => setView('week')}>Week</button>
          <button type="button" className={view === 'month' ? 'is-active' : ''} onClick={() => setView('month')}>Month</button>
        </div>
      </div>

      <div className="workout-planner-period">
        <div className="workout-planner-period-nav">
          <button type="button" className="workout-planner-icon-button" onClick={() => changePeriod(-1)} aria-label={`Previous ${view}`}>
            <ChevronLeft size={17} aria-hidden="true" />
          </button>
          <strong>{periodLabel}</strong>
          <button type="button" className="workout-planner-icon-button" onClick={() => changePeriod(1)} aria-label={`Next ${view}`}>
            <ChevronRight size={17} aria-hidden="true" />
          </button>
          <button type="button" className="workout-planner-today" onClick={() => setAnchorDate(new Date())}>Today</button>
        </div>
        <span className="portal-badge"><ListChecks size={13} aria-hidden="true" /> {completedCount} / {plans.length} done</span>
      </div>

      {message && <div className="portal-alert portal-alert-success" role="status">{message}</div>}
      {error && <div className="portal-alert portal-alert-error" role="alert">{error}</div>}
      {overdueError && <div className="portal-alert portal-alert-error" role="alert">{overdueError}</div>}
      {completionNotice && (
        <div className="workout-completion-toast" role="status" aria-live="polite">
          <CheckCircle2 className="workout-completion-icon" size={23} aria-hidden="true" />
          <span><strong>Great job!</strong> {completionNotice} completed.</span>
        </div>
      )}
      {overduePlans.length > 0 && (
        <div className="workout-overdue-alert" role="alert">
          <CalendarDays size={19} aria-hidden="true" />
          <div>
            <strong>
              {overduePlans.length} planned workout{overduePlans.length === 1 ? '' : 's'} missed
            </strong>
            <p>These planned days passed without being marked complete:</p>
            <ul>
              {overduePlans.slice(0, 3).map((plan) => (
                <li key={plan._id}>
                  {new Date(`${plan.planDate}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · {plan.title}
                </li>
              ))}
              {overduePlans.length > 3 && <li>And {overduePlans.length - 3} more</li>}
            </ul>
          </div>
        </div>
      )}

      <form className="workout-plan-form" onSubmit={handleSubmit}>
        <div className="portal-field">
          <label htmlFor="plan-workout-name">Workout</label>
          <input
            id="plan-workout-name"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Leg day or 30-minute walk"
            required
          />
        </div>
        <div className="portal-field">
          <label htmlFor="plan-workout-date">Day</label>
          <input
            id="plan-workout-date"
            type="date"
            value={selectedPlanDate}
            min={startDate}
            max={endDate}
            onChange={(event) => setPlanDate(event.target.value)}
            required
          />
        </div>
        <div className="portal-field">
          <label htmlFor="plan-workout-category">Type</label>
          <select id="plan-workout-category" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="strength">Strength</option>
            <option value="cardio">Cardio</option>
            <option value="flexibility">Flexibility</option>
            <option value="other">Other</option>
          </select>
        </div>
        <button className="portal-button" type="submit" disabled={saving}>
          <Plus size={15} aria-hidden="true" /> {saving ? 'Adding…' : 'Add plan'}
        </button>
      </form>

      {loading ? (
        <div className="portal-empty" role="status">Loading your plan…</div>
      ) : Object.keys(plansByDate).length ? (
        <div className="workout-plan-days">
          {Object.keys(plansByDate).sort().map((date) => (
            <div className="workout-plan-day" key={date}>
              <h3><CalendarDays size={15} aria-hidden="true" /> {new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</h3>
              <div className="workout-plan-day-list">
                {plansByDate[date].map((plan) => (
                  <article className={`workout-plan-item${plan.completed ? ' is-complete' : ''}${!plan.completed && plan.planDate < todayKey ? ' is-overdue' : ''}`} key={plan._id}>
                    <button
                      type="button"
                      className="workout-plan-check"
                      onClick={() => toggleCompleted(plan)}
                      disabled={updatingId === plan._id}
                      aria-label={plan.completed ? `Mark ${plan.title} as not done` : `Mark ${plan.title} as done`}
                    >
                      {plan.completed && <Check size={14} aria-hidden="true" />}
                    </button>
                    <div className="workout-plan-item-copy">
                      <strong>{plan.title}</strong>
                      <span className="portal-badge">{plan.category}</span>
                      {!plan.completed && plan.planDate < todayKey && <span className="portal-badge workout-plan-missed">Missed</span>}
                    </div>
                    <button
                      type="button"
                      className="workout-planner-icon-button workout-plan-delete"
                      onClick={() => deletePlan(plan)}
                      disabled={deletingId === plan._id}
                      aria-label={`Remove ${plan.title} from plan`}
                    >
                      <Trash2 size={15} aria-hidden="true" />
                    </button>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="portal-empty">No workouts planned for this {view} yet. Add one above to set your target.</div>
      )}
    </section>
  );
};

export default WorkoutPlanner;
