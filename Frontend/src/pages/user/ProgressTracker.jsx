import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowDownRight, Pencil, Plus, Ruler, Scale } from 'lucide-react';
import EntryModal from '../../components/userLayout/EntryModal';
import ReportExport from '../../components/userLayout/ReportExport';

const ProgressTracker = () => {
  const [progressLogs, setProgressLogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [weight, setWeight] = useState('');
  const [bodyFatPercentage, setBodyFatPercentage] = useState('');
  const [chest, setChest] = useState('');
  const [waist, setWaist] = useState('');
  const [arms, setArms] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingLog(null);
  }, []);

  const openCreateModal = () => {
    setEditingLog(null);
    setWeight('');
    setBodyFatPercentage('');
    setChest('');
    setWaist('');
    setArms('');
    setNotes('');
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (log) => {
    setEditingLog(log);
    setWeight(log.weight ?? '');
    setBodyFatPercentage(log.bodyFatPercentage ?? '');
    setChest(log.measurements?.chest ?? '');
    setWaist(log.measurements?.waist ?? '');
    setArms(log.measurements?.arms ?? '');
    setNotes(log.notes || '');
    setError('');
    setIsModalOpen(true);
  };

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get('http://localhost:5000/api/progress', config);
      setProgressLogs(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load your progress history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
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
        weight: Number(weight),
        bodyFatPercentage: bodyFatPercentage ? Number(bodyFatPercentage) : undefined,
        measurements: {
          chest: chest ? Number(chest) : undefined,
          waist: waist ? Number(waist) : undefined,
          arms: arms ? Number(arms) : undefined,
        },
        notes,
      };

      if (editingLog) {
        await axios.put(`http://localhost:5000/api/progress/${editingLog._id}`, payload, config);
        setMessage('Progress updated successfully.');
      } else {
        await axios.post('http://localhost:5000/api/progress', payload, config);
        setMessage('Progress recorded successfully.');
      }
      setWeight('');
      setBodyFatPercentage('');
      setChest('');
      setWaist('');
      setArms('');
      setNotes('');
      await fetchProgress();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save your progress. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const latestLog = progressLogs[0];
  const reportHeaders = ['Date', 'Weight (kg)', 'Body fat (%)', 'Chest (in)', 'Waist (in)', 'Arms (in)', 'Thighs (in)', 'Notes'];
  const reportRows = progressLogs.map((log) => [
    new Date(log.date).toLocaleDateString(),
    log.weight,
    log.bodyFatPercentage,
    log.measurements?.chest,
    log.measurements?.waist,
    log.measurements?.arms,
    log.measurements?.thighs,
    log.notes,
  ]);

  return (
    <div className="portal-page">
      <div className="portal-page-heading">
        <div>
          <span className="portal-eyebrow">NOTICE YOUR PROGRESS</span>
          <h1>Progress tracker</h1>
          <p>Keep personal milestones in one place and look back at how far you have come.</p>
        </div>
        <div className="portal-page-actions">
          <ReportExport title="Progress report" filename="progress-report" headers={reportHeaders} rows={reportRows} />
          <button className="portal-button" type="button" onClick={openCreateModal}>
            <Plus size={16} aria-hidden="true" /> Add check-in
          </button>
        </div>
      </div>

      {message && <div className="portal-alert portal-alert-success" role="status">{message}</div>}
      {error && !isModalOpen && <div className="portal-alert portal-alert-error" role="alert">{error}</div>}
      {isModalOpen && (
        <EntryModal
          title={editingLog ? 'Edit check-in' : 'Record a check-in'}
          description={editingLog ? 'Update the details in this progress check-in.' : 'Measurements are optional. Add what feels useful to track.'}
          onClose={closeModal}
        >
          <form className="portal-form" onSubmit={handleSubmit}>
            <div className="portal-form-grid">
              <div className="portal-field">
                <label htmlFor="progress-weight">Weight (kg / lbs)</label>
                <input id="progress-weight" type="number" min="0" step="0.1" value={weight} onChange={(event) => setWeight(event.target.value)} placeholder="e.g. 72.5" required />
              </div>
              <div className="portal-field">
                <label htmlFor="progress-fat">Body fat (%)</label>
                <input id="progress-fat" type="number" min="0" max="100" step="0.1" value={bodyFatPercentage} onChange={(event) => setBodyFatPercentage(event.target.value)} placeholder="Optional" />
              </div>
            </div>
            <div className="portal-field">
              <label>Body measurements <span className="portal-field-hint">(optional, inches)</span></label>
              <div className="portal-form-grid-three">
                <input aria-label="Chest measurement in inches" type="number" min="0" step="0.1" value={chest} onChange={(event) => setChest(event.target.value)} placeholder="Chest" />
                <input aria-label="Waist measurement in inches" type="number" min="0" step="0.1" value={waist} onChange={(event) => setWaist(event.target.value)} placeholder="Waist" />
                <input aria-label="Arms measurement in inches" type="number" min="0" step="0.1" value={arms} onChange={(event) => setArms(event.target.value)} placeholder="Arms" />
              </div>
            </div>
            <div className="portal-field">
              <label htmlFor="progress-notes">Notes</label>
              <textarea id="progress-notes" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="How are you feeling? Add a note for your future self." rows="3" />
            </div>
            {error && <div className="portal-alert portal-alert-error" role="alert">{error}</div>}
            <div className="portal-form-actions">
              <button className="portal-button" type="submit" disabled={saving}>
                {editingLog ? <Pencil size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
                {saving ? 'Saving check-in…' : editingLog ? 'Update check-in' : 'Save check-in'}
              </button>
              <button className="portal-button portal-button-secondary" type="button" onClick={closeModal}>Cancel</button>
            </div>
          </form>
        </EntryModal>
      )}

      <div className="portal-summary-grid">
        <div className="portal-summary-card">
          <span><Scale size={17} aria-hidden="true" /></span>
          <strong>{latestLog?.weight ? `${latestLog.weight} kg` : '—'}</strong>
          <small>Latest weight</small>
        </div>
        <div className="portal-summary-card">
          <span><ArrowDownRight size={17} aria-hidden="true" /></span>
          <strong>{latestLog?.bodyFatPercentage ? `${latestLog.bodyFatPercentage}%` : '—'}</strong>
          <small>Latest body fat</small>
        </div>
        <div className="portal-summary-card">
          <span><Ruler size={17} aria-hidden="true" /></span>
          <strong>{progressLogs.length}</strong>
          <small>Progress check-ins</small>
        </div>
      </div>

      <section className="portal-card">
        <div className="portal-card-heading">
          <div>
            <h2>Your progress history</h2>
            <p>Your check-ins are a record of effort, not a measure of your worth.</p>
          </div>
          <span className="portal-badge">{progressLogs.length} check-ins</span>
        </div>
        {loading ? (
          <div className="portal-empty" role="status">Loading your progress history…</div>
        ) : progressLogs.length ? (
          <div className="portal-entry-list">
            {progressLogs.map((log) => (
              <article className="portal-entry" key={log._id}>
                <div className="portal-entry-top">
                  <div>
                    <h3>{log.weight} kg</h3>
                    <div className="portal-entry-meta">{new Date(log.date).toLocaleDateString()}</div>
                  </div>
                  <div className="portal-entry-actions">
                    {log.bodyFatPercentage && <span className="portal-badge">{log.bodyFatPercentage}% body fat</span>}
                    <button className="portal-button portal-button-secondary portal-entry-edit" type="button" onClick={() => openEditModal(log)} aria-label={`Edit progress check-in from ${new Date(log.date).toLocaleDateString()}`}>
                      <Pencil size={14} aria-hidden="true" /> Edit
                    </button>
                  </div>
                </div>
                <div className="portal-entry-detail">
                  {log.measurements && (
                    <div>
                      Measurements · Chest {log.measurements.chest || '—'} in · Waist {log.measurements.waist || '—'} in · Arms {log.measurements.arms || '—'} in
                    </div>
                  )}
                  {log.notes && <div><strong>Note:</strong> {log.notes}</div>}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="portal-empty">No check-ins yet. Save your first progress record above whenever you are ready.</div>
        )}
      </section>
    </div>
  );
};

export default ProgressTracker;
