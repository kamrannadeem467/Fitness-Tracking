import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Activity, Dumbbell, Pencil, Plus, Search, Timer, Trash2 } from 'lucide-react';
import EntryModal from '../../components/userLayout/EntryModal';
import ReportExport from '../../components/userLayout/ReportExport';
import WorkoutAnalytics from '../../components/userLayout/home/userdashboard/WorkoutAnalytics';
import WorkoutPlanner from './WorkoutPlanner';

const WorkoutTracker = () => {
  const historyPageSize = 8;
  const [workouts, setWorkouts] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeSection, setActiveSection] = useState('plan');
  const [historyPage, setHistoryPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
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
  const [deletingWorkoutId, setDeletingWorkoutId] = useState('');
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingWorkout(null);
  }, []);

  const openCreateModal = () => {
    setEditingWorkout(null);
    setTitle('');
    setCategory('strength');
    setExerciseName('');
    setSets('');
    setReps('');
    setWeight('');
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (workout) => {
    const exercise = workout.exercises[0];
    setEditingWorkout(workout);
    setTitle(workout.title);
    setCategory(workout.category);
    setExerciseName(exercise?.exerciseName || '');
    setSets(exercise?.sets ?? '');
    setReps(exercise?.reps ?? '');
    setWeight(exercise?.weight ?? '');
    setError('');
    setIsModalOpen(true);
  };

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

      if (editingWorkout) {
        payload.exercises = [
          { ...editingWorkout.exercises[0], ...payload.exercises[0] },
          ...editingWorkout.exercises.slice(1),
        ];
        await axios.put(`http://localhost:5000/api/workouts/${editingWorkout._id}`, payload, config);
        setMessage('Workout successfully updated.');
      } else {
        await axios.post('http://localhost:5000/api/workouts', payload, config);
        setMessage('Workout successfully created.');
      }
      setActiveSection('history');
      setHistoryPage(1);
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
  const filteredWorkouts = workouts.filter((workout) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [
      workout.title,
      workout.category,
      ...(workout.exercises || []).map((exercise) => exercise.exerciseName),
    ].some((value) => value?.toLowerCase().includes(query));
    return matchesSearch && (categoryFilter === 'all' || workout.category === categoryFilter);
  });
  const handleDeleteWorkout = async (workout) => {
    if (!window.confirm(`Delete "${workout.title}" from your workout history? This cannot be undone.`)) {
      return;
    }

    setDeletingWorkoutId(workout._id);
    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:5000/api/workouts/${workout._id}`, config);
      setWorkouts((current) => current.filter((item) => item._id !== workout._id));
      setHistoryPage((current) => Math.min(
        current,
        Math.max(1, Math.ceil((filteredWorkouts.length - 1) / historyPageSize)),
      ));
      setMessage('Workout deleted successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete this workout. Please try again.');
    } finally {
      setDeletingWorkoutId('');
    }
  };
  const historyPageCount = Math.ceil(filteredWorkouts.length / historyPageSize);
  const visibleWorkouts = filteredWorkouts.slice(
    (historyPage - 1) * historyPageSize,
    historyPage * historyPageSize,
  );
  const reportHeaders = ['Date', 'Workout', 'Category', 'Exercise', 'Sets', 'Reps', 'Weight (kg)'];
  const reportRows = workouts.flatMap((workout) => (
    (workout.exercises || []).map((exercise) => [
      new Date(workout.date).toLocaleDateString(),
      workout.title,
      workout.category,
      exercise.exerciseName,
      exercise.sets,
      exercise.reps,
      exercise.weight,
    ])
  ));

  return (
    <div className="portal-page">
      <div className="portal-page-heading">
        <div>
          <span className="portal-eyebrow">MOVE WITH INTENTION</span>
          <h1>Workout tracker</h1>
          <p>Keep a record of your sessions and celebrate every time you show up.</p>
        </div>
        <div className="portal-page-actions">
          <ReportExport title="Workout report" filename="workout-report" headers={reportHeaders} rows={reportRows} />
          <button className="portal-button" type="button" onClick={openCreateModal}>
            <Plus size={16} aria-hidden="true" /> Add workout
          </button>
        </div>
      </div>

      {message && <div className="portal-alert portal-alert-success" role="status">{message}</div>}
      {error && !isModalOpen && <div className="portal-alert portal-alert-error" role="alert">{error}</div>}
      {isModalOpen && (
        <EntryModal
          title={editingWorkout ? 'Edit workout' : 'Log a workout'}
          description={editingWorkout ? 'Update your session details.' : 'Add a session and its first exercise to your history.'}
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
                {editingWorkout ? <Pencil size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
                {saving ? 'Saving workout…' : editingWorkout ? 'Update workout' : 'Save workout'}
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

      <div className="workout-section-switch" role="group" aria-label="Workout sections">
        <button type="button" aria-pressed={activeSection === 'plan'} onClick={() => setActiveSection('plan')}>Plan</button>
        <button type="button" aria-pressed={activeSection === 'history'} onClick={() => setActiveSection('history')}>
          History <span>{workouts.length}</span>
        </button>
        <button type="button" aria-pressed={activeSection === 'analytics'} onClick={() => setActiveSection('analytics')}>Analytics</button>
      </div>

      {activeSection === 'plan' && <WorkoutPlanner />}

      {activeSection === 'history' && (
        <section className="portal-card">
          <div className="portal-card-heading">
            <div>
              <h2>Your workout history</h2>
              <p>Every session is another step forward.</p>
            </div>
            <span className="portal-badge">{filteredWorkouts.length} of {workouts.length} sessions</span>
          </div>
          <div className="portal-entry-filters">
            <label className="portal-entry-search">
              <Search size={16} aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setHistoryPage(1);
                }}
                placeholder="Search workouts or exercises"
                aria-label="Search workouts or exercises"
              />
            </label>
            <select
              className="portal-entry-filter"
              value={categoryFilter}
              onChange={(event) => {
                setCategoryFilter(event.target.value);
                setHistoryPage(1);
              }}
              aria-label="Filter workouts by category"
            >
              <option value="all">All categories</option>
              <option value="strength">Strength</option>
              <option value="cardio">Cardio</option>
              <option value="flexibility">Flexibility</option>
              <option value="other">Other</option>
            </select>
          </div>
          {loading ? (
            <div className="portal-empty" role="status">Loading your workout history…</div>
          ) : filteredWorkouts.length ? (
            <>
              <div className="portal-entry-list">
                {visibleWorkouts.map((workout) => (
                  <article className="portal-entry" key={workout._id}>
                    <div className="portal-entry-top">
                      <div>
                        <h3>{workout.title}</h3>
                        <div className="portal-entry-meta">{new Date(workout.date).toLocaleDateString()}</div>
                      </div>
                      <div className="portal-entry-actions">
                        <span className="portal-badge">{workout.category}</span>
                        <button className="portal-button portal-button-secondary portal-entry-edit" type="button" onClick={() => openEditModal(workout)} aria-label={`Edit ${workout.title}`}>
                          <Pencil size={14} aria-hidden="true" /> Edit
                        </button>
                        <button
                          className="portal-button portal-button-secondary portal-entry-edit portal-entry-delete"
                          type="button"
                          onClick={() => handleDeleteWorkout(workout)}
                          disabled={deletingWorkoutId === workout._id}
                          aria-label={`Delete ${workout.title}`}
                        >
                          <Trash2 size={14} aria-hidden="true" /> Delete
                        </button>
                      </div>
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
              {historyPageCount > 1 && (
                <div className="workout-history-pagination">
                  <span>
                    Showing {(historyPage - 1) * historyPageSize + 1}–{Math.min(historyPage * historyPageSize, filteredWorkouts.length)} of {filteredWorkouts.length}
                  </span>
                  <div>
                    <button className="portal-button portal-button-secondary" type="button" onClick={() => setHistoryPage((page) => page - 1)} disabled={historyPage === 1}>
                      Previous
                    </button>
                    <span>Page {historyPage} of {historyPageCount}</span>
                    <button className="portal-button portal-button-secondary" type="button" onClick={() => setHistoryPage((page) => page + 1)} disabled={historyPage === historyPageCount}>
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : workouts.length ? (
            <div className="portal-empty">No workouts match your search or selected category.</div>
          ) : (
            <div className="portal-empty">No workouts yet. Add your first session above and start building your history.</div>
          )}
        </section>
      )}

      {activeSection === 'analytics' && <WorkoutAnalytics workouts={workouts} />}
    </div>
  );
};

export default WorkoutTracker;
