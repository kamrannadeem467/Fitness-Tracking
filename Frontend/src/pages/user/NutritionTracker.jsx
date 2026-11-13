import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Apple, Flame, Pencil, Plus, Salad, Search } from 'lucide-react';
import EntryModal from '../../components/userLayout/EntryModal';
import ReportExport from '../../components/userLayout/ReportExport';
import NutritionAnalytics from '../../components/userLayout/home/userdashboard/NutritionAnalytics';

const NutritionTracker = () => {
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [mealTypeFilter, setMealTypeFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [mealType, setMealType] = useState('breakfast');
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
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
    setMealType('breakfast');
    setFoodName('');
    setQuantity('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFats('');
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (log) => {
    const food = log.foodItems[0];
    setEditingLog(log);
    setMealType(log.mealType);
    setFoodName(food?.name || '');
    setQuantity(food?.quantity || '');
    setCalories(food?.calories ?? '');
    setProtein(food?.protein ?? '');
    setCarbs(food?.carbs ?? '');
    setFats(food?.fats ?? '');
    setError('');
    setIsModalOpen(true);
  };

  const fetchNutrition = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get('http://localhost:5000/api/nutrition', config);
      setNutritionLogs(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load your meal history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNutrition();
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
        mealType,
        foodItems: [{
          name: foodName,
          quantity,
          calories: Number(calories) || 0,
          protein: Number(protein) || 0,
          carbs: Number(carbs) || 0,
          fats: Number(fats) || 0,
        }],
      };

      if (editingLog) {
        payload.foodItems = [
          payload.foodItems[0],
          ...editingLog.foodItems.slice(1),
        ];
        await axios.put(`http://localhost:5000/api/nutrition/${editingLog._id}`, payload, config);
        setMessage('Meal successfully updated.');
      } else {
        await axios.post('http://localhost:5000/api/nutrition', payload, config);
        setMessage('Meal successfully logged.');
      }
      setFoodName('');
      setQuantity('');
      setCalories('');
      setProtein('');
      setCarbs('');
      setFats('');
      await fetchNutrition();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save your meal. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const totalCalories = nutritionLogs.reduce(
    (total, log) => total + log.foodItems.reduce((mealTotal, item) => mealTotal + (Number(item.calories) || 0), 0),
    0,
  );
  const totalProtein = nutritionLogs.reduce(
    (total, log) => total + log.foodItems.reduce((mealTotal, item) => mealTotal + (Number(item.protein) || 0), 0),
    0,
  );
  const filteredNutritionLogs = nutritionLogs.filter((log) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [
      log.mealType,
      ...(log.foodItems || []).map((item) => item.name),
    ].some((value) => value?.toLowerCase().includes(query));
    return matchesSearch && (mealTypeFilter === 'all' || log.mealType === mealTypeFilter);
  });
  const reportHeaders = ['Date', 'Meal', 'Food', 'Quantity', 'Calories (kcal)', 'Protein (g)', 'Carbs (g)', 'Fats (g)'];
  const reportRows = nutritionLogs.flatMap((log) => (
    (log.foodItems || []).map((item) => [
      new Date(log.date).toLocaleDateString(),
      log.mealType,
      item.name,
      item.quantity,
      item.calories,
      item.protein,
      item.carbs,
      item.fats,
    ])
  ));

  return (
    <div className="portal-page">
      <div className="portal-page-heading">
        <div>
          <span className="portal-eyebrow">NOURISH YOUR ROUTINE</span>
          <h1>Nutrition tracker</h1>
          <p>Keep a mindful record of your meals and the nutrients that fuel your day.</p>
        </div>
        <div className="portal-page-actions">
          <ReportExport title="Nutrition report" filename="nutrition-report" headers={reportHeaders} rows={reportRows} />
          <button className="portal-button" type="button" onClick={openCreateModal}>
            <Plus size={16} aria-hidden="true" /> Add meal
          </button>
        </div>
      </div>

      {message && <div className="portal-alert portal-alert-success" role="status">{message}</div>}
      {error && !isModalOpen && <div className="portal-alert portal-alert-error" role="alert">{error}</div>}
      {isModalOpen && (
        <EntryModal
          title={editingLog ? 'Edit meal' : 'Log a meal'}
          description={editingLog ? 'Update your meal and nutrition details.' : 'Add a food item and its nutrition details.'}
          onClose={closeModal}
        >
          <form className="portal-form" onSubmit={handleSubmit}>
            <div className="portal-form-grid">
              <div className="portal-field">
                <label htmlFor="meal-type">Meal</label>
                <select id="meal-type" value={mealType} onChange={(event) => setMealType(event.target.value)}>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snacks">Snacks</option>
                </select>
              </div>
              <div className="portal-field">
                <label htmlFor="food-quantity">Quantity</label>
                <input id="food-quantity" value={quantity} onChange={(event) => setQuantity(event.target.value)} placeholder="e.g. 1 bowl" required />
              </div>
            </div>
            <div className="portal-field">
              <label htmlFor="food-name">Food name</label>
              <input id="food-name" value={foodName} onChange={(event) => setFoodName(event.target.value)} placeholder="e.g. Oats with milk" required />
            </div>
            <div className="portal-form-grid portal-form-grid-three">
              <div className="portal-field">
                <label htmlFor="food-calories">Calories (kcal)</label>
                <input id="food-calories" type="number" min="0" value={calories} onChange={(event) => setCalories(event.target.value)} placeholder="0" required />
              </div>
              <div className="portal-field">
                <label htmlFor="food-protein">Protein (g)</label>
                <input id="food-protein" type="number" min="0" step="0.1" value={protein} onChange={(event) => setProtein(event.target.value)} placeholder="Optional" />
              </div>
              <div className="portal-field">
                <label htmlFor="food-carbs">Carbs (g)</label>
                <input id="food-carbs" type="number" min="0" step="0.1" value={carbs} onChange={(event) => setCarbs(event.target.value)} placeholder="Optional" />
              </div>
              <div className="portal-field">
                <label htmlFor="food-fats">Fats (g)</label>
                <input id="food-fats" type="number" min="0" step="0.1" value={fats} onChange={(event) => setFats(event.target.value)} placeholder="Optional" />
              </div>
            </div>
            {error && <div className="portal-alert portal-alert-error" role="alert">{error}</div>}
            <div className="portal-form-actions">
              <button className="portal-button" type="submit" disabled={saving}>
                {editingLog ? <Pencil size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
                {saving ? 'Saving meal…' : editingLog ? 'Update meal' : 'Save meal'}
              </button>
              <button className="portal-button portal-button-secondary" type="button" onClick={closeModal}>Cancel</button>
            </div>
          </form>
        </EntryModal>
      )}

      <div className="portal-summary-grid">
        <div className="portal-summary-card">
          <span><Flame size={17} aria-hidden="true" /></span>
          <strong>{totalCalories.toLocaleString()}</strong>
          <small>Calories logged</small>
        </div>
        <div className="portal-summary-card">
          <span><Salad size={17} aria-hidden="true" /></span>
          <strong>{nutritionLogs.length}</strong>
          <small>Meal entries</small>
        </div>
        <div className="portal-summary-card">
          <span><Apple size={17} aria-hidden="true" /></span>
          <strong>{Math.round(totalProtein)} g</strong>
          <small>Protein logged</small>
        </div>
      </div>

      <section className="portal-card">
        <div className="portal-card-heading">
          <div>
            <h2>Meal history</h2>
            <p>Your recorded meals and their nutrition details.</p>
          </div>
          <span className="portal-badge">{filteredNutritionLogs.length} of {nutritionLogs.length} entries</span>
        </div>
        <div className="portal-entry-filters">
          <label className="portal-entry-search">
            <Search size={16} aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search meals or foods"
              aria-label="Search meals or foods"
            />
          </label>
          <select
            className="portal-entry-filter"
            value={mealTypeFilter}
            onChange={(event) => setMealTypeFilter(event.target.value)}
            aria-label="Filter meals by type"
          >
            <option value="all">All meal types</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snacks">Snacks</option>
          </select>
        </div>
        {loading ? (
          <div className="portal-empty" role="status">Loading your meal history…</div>
        ) : filteredNutritionLogs.length ? (
          <div className="portal-entry-list">
            {filteredNutritionLogs.map((log) => {
              const mealCalories = log.foodItems.reduce((total, item) => total + (Number(item.calories) || 0), 0);
              return (
                <article className="portal-entry" key={log._id}>
                  <div className="portal-entry-top">
                    <div>
                      <h3>{log.mealType}</h3>
                      <div className="portal-entry-meta">{new Date(log.date).toLocaleDateString()}</div>
                    </div>
                    <div className="portal-entry-actions">
                      <span className="portal-badge">{mealCalories.toLocaleString()} kcal</span>
                      <button className="portal-button portal-button-secondary portal-entry-edit" type="button" onClick={() => openEditModal(log)} aria-label={`Edit ${log.mealType} entry`}>
                        <Pencil size={14} aria-hidden="true" /> Edit
                      </button>
                    </div>
                  </div>
                  <div className="portal-entry-detail">
                    {log.foodItems.map((item, index) => (
                      <div key={`${item.name}-${index}`}>
                        <strong>{item.name}</strong> ({item.quantity}) · {item.calories} kcal
                        {' · '}Protein {item.protein}g · Carbs {item.carbs}g · Fats {item.fats}g
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        ) : nutritionLogs.length ? (
          <div className="portal-empty">No meals match your search or selected meal type.</div>
        ) : (
          <div className="portal-empty">No meals logged yet. Add your first meal above to start your food journal.</div>
        )}
      </section>
      <NutritionAnalytics nutritionLogs={nutritionLogs} />
    </div>
  );
};

export default NutritionTracker;
