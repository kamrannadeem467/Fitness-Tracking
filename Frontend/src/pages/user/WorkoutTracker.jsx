import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Activity, Dumbbell, Plus, Timer } from 'lucide-react';
import EntryModal from '../../components/userLayout/EntryModal';
import WorkoutAnalytics from '../../components/userLayout/home/userdashboard/WorkoutAnalytics';

const WorkoutTracker = () => {
  const [workouts, setWorkouts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('strength');
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const fetchWorkouts = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get('http://localhost:5000/api/workouts', config);
      setWorkouts(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load your workouts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = {
        title,
        category,
        exercises: [{
          exerciseName,
          sets: Number(sets),
          reps: Number(reps),
          weight: Number(weight) || 0,
        }],
      };

      await axios.post('http://localhost:5000/api/workouts', payload, config);
      setMessage('Workout successfully created.');
      setTitle('');
      setExerciseName('');
      setSets('');
      setReps('');
      setWeight('');
      await fetchWorkouts();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save your workout. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const exerciseCount = workouts.reduce((total, workout) => total + (workout.exercises?.length || 0), 0);

  return (
    <div className="portal-page">
      <div className="portal-page-heading">
        <div>
          <span className="portal-eyebrow">MOVE WITH INTENTION</span>
          <h1>Workout tracker</h1>
          <p>Keep a record of your sessions and celebrate every time you show up.</p>
        </div>
        <button className="portal-button" type="button" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} aria-hidden="true" /> Add workout
        </button>
      </div>

      {message && <div className="portal-alert portal-alert-success" role="status">{message}</div>}
      {error && !isModalOpen && <div className="portal-alert portal-alert-error" role="alert">{error}</div>}
      {isModalOpen && (
        <EntryModal
          title="Log a workout"
          description="Add a session and its first exercise to your history."
          onClose={closeModal}
        >
          <form className="portal-form" onSubmit={handleSubmit}>
            <div className="portal-form-grid">
              <div className="portal-field">
                <label htmlFor="workout-title">Workout name</label>
                <input id="workout-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Full body session" required />
              </div>
              <div className="portal-field">
                <label htmlFor="workout-category">Category</label>
                <select id="workout-category" value={category} onChange={(event) => setCategory(event.target.value)}>
                  <option value="strength">Strength</option>
                  <option value="cardio">Cardio</option>
                  <option value="flexibility">Flexibility</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="portal-field">
              <label htmlFor="exercise-name">Exercise</label>
              <input id="exercise-name" value={exerciseName} onChange={(event) => setExerciseName(event.target.value)} placeholder="e.g. Goblet squats" required />
            </div>
            <div className="portal-form-grid-three">
              <div className="portal-field">
                <label htmlFor="workout-sets">Sets</label>
                <input id="workout-sets" type="number" min="1" value={sets} onChange={(event) => setSets(event.target.value)} placeholder="3" required />
              </div>
              <div className="portal-field">
                <label htmlFor="workout-reps">Reps</label>
                <input id="workout-reps" type="number" min="1" value={reps} onChange={(event) => setReps(event.target.value)} placeholder="10" required />
              </div>
              <div className="portal-field">
                <label htmlFor="workout-weight">Weight (kg)</label>
                <input id="workout-weight" type="number" min="0" step="0.1" value={weight} onChange={(event) => setWeight(event.target.value)} placeholder="Optional" />
              </div>
            </div>
            {error && <div className="portal-alert portal-alert-error" role="alert">{error}</div>}
            <div className="portal-form-actions">
              <button className="portal-button" type="submit" disabled={saving}>
                <Plus size={16} aria-hidden="true" /> {saving ? 'Saving workout…' : 'Save workout'}
              </button>
              <button className="portal-button portal-button-secondary" type="button" onClick={closeModal}>Cancel</button>
            </div>
          </form>
        </EntryModal>
      )}

      <div className="portal-summary-grid">
        <div className="portal-summary-card">
          <span><Dumbbell size={17} aria-hidden="true" /></span>
          <strong>{workouts.length}</strong>
          <small>Workouts logged</small>
        </div>
        <div className="portal-summary-card">
          <span><Activity size={17} aria-hidden="true" /></span>
          <strong>{exerciseCount}</strong>
          <small>Exercises recorded</small>
        </div>
        <div className="portal-summary-card">
          <span><Timer size={17} aria-hidden="true" /></span>
          <strong>{workouts.length ? 'In motion' : 'Start today'}</strong>
          <small>Your routine, your pace</small>
        </div>
      </div>

      <section className="portal-card">
        <div className="portal-card-heading">
          <div>
            <h2>Your workout history</h2>
            <p>Every session is another step forward.</p>
          </div>
          <span className="portal-badge">{workouts.length} sessions</span>
        </div>
        {loading ? (
          <div className="portal-empty" role="status">Loading your workout history…</div>
        ) : workouts.length ? (
          <div className="portal-entry-list">
            {workouts.map((workout) => (
              <article className="portal-entry" key={workout._id}>
                <div className="portal-entry-top">
                  <div>
                    <h3>{workout.title}</h3>
                    <div className="portal-entry-meta">{new Date(workout.date).toLocaleDateString()}</div>
                  </div>
                  <span className="portal-badge">{workout.category}</span>
                </div>
                <div className="portal-entry-detail">
                  {workout.exercises.map((exercise, index) => (
                    <div key={`${exercise.exerciseName}-${index}`}>
                      <strong>{exercise.exerciseName}</strong> · {exercise.sets} sets × {exercise.reps} reps
                      {exercise.weight ? ` · ${exercise.weight} kg` : ''}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="portal-empty">No workouts yet. Add your first session above and start building your history.</div>
        )}
      </section>
      <WorkoutAnalytics workouts={workouts} />
    </div>
  );
};

export default WorkoutTracker;
