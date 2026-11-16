import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const NutritionAnalytics = ({ nutritionLogs, weekStartDate }) => {
  if (!nutritionLogs || nutritionLogs.length === 0) {
    return (
      <section className="portal-card">
        <div className="portal-card-heading">
          <div>
            <h2>This week&apos;s nutrition trends</h2>
            <p>Daily calories and macronutrients for the selected week.</p>
          </div>
        </div>
        <div className="portal-empty">No meals recorded this week to show in your charts.</div>
      </section>
    );
  }

  const chartData = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(`${weekStartDate}T00:00:00`);
    date.setDate(date.getDate() + index);
    return {
      dateKey: formatDateKey(date),
      name: date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' }),
      Calories: 0,
      Protein: 0,
      Carbs: 0,
      Fats: 0,
    };
  });
  const dataByDate = new Map(chartData.map((day) => [day.dateKey, day]));

  nutritionLogs.forEach((log) => {
    const day = dataByDate.get(formatDateKey(new Date(log.date)));
    if (!day) return;

    (log.foodItems || []).forEach((item) => {
      day.Calories += Number(item.calories) || 0;
      day.Protein += Number(item.protein) || 0;
      day.Carbs += Number(item.carbs) || 0;
      day.Fats += Number(item.fats) || 0;
    });
  });

  return (
    <div className="nutrition-analytics-grid">
      <section className="portal-card nutrition-chart-card">
        <div className="portal-card-heading">
          <div>
            <h2>Calories by day</h2>
            <p>Total calories logged each day this week.</p>
          </div>
        </div>
        <div className="nutrition-chart">
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 5, right: 12, bottom: 5, left: -12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#edf1ed" />
              <XAxis dataKey="name" stroke="#7c8981" fontSize={10} interval={0} />
              <YAxis stroke="#7c8981" fontSize={10} />
              <Tooltip />
              <Bar dataKey="Calories" fill="#1b7a56" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="portal-card nutrition-chart-card">
        <div className="portal-card-heading">
          <div>
            <h2>Macros by day</h2>
            <p>Protein, carbs, and fats in grams each day.</p>
          </div>
        </div>
        <div className="nutrition-chart">
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 5, right: 12, bottom: 5, left: -12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#edf1ed" />
              <XAxis dataKey="name" stroke="#7c8981" fontSize={10} interval={0} />
              <YAxis stroke="#7c8981" fontSize={10} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Protein" fill="#1b7a56" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Carbs" fill="#78ae48" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Fats" fill="#e6a23c" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default NutritionAnalytics;
