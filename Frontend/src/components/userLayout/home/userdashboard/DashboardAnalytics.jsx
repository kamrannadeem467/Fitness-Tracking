import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const DashboardAnalytics = ({
  workoutActivity = [],
  nutritionActivity = [],
  progressHistory = [],
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dailyActivity = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    return {
      dateKey: formatDateKey(date),
      day: date.toLocaleDateString(undefined, { weekday: 'short' }),
      workouts: 0,
      calories: 0,
    };
  });
  const activityByDate = new Map(dailyActivity.map((day) => [day.dateKey, day]));

  workoutActivity.forEach((workout) => {
    const day = activityByDate.get(formatDateKey(new Date(workout.date)));
    if (day) day.workouts += 1;
  });

  nutritionActivity.forEach((log) => {
    const day = activityByDate.get(formatDateKey(new Date(log.date)));
    if (!day) return;
    day.calories += (log.foodItems || []).reduce(
      (total, item) => total + (Number(item.calories) || 0),
      0,
    );
  });

  const weightData = progressHistory.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    weight: Number(entry.weight),
  }));
  const hasWorkouts = dailyActivity.some((day) => day.workouts > 0);
  const hasCalories = dailyActivity.some((day) => day.calories > 0);

  return (
    <div className="dashboard-analytics-grid">
      <section className="portal-card dashboard-chart-card">
        <div className="portal-card-heading">
          <div>
            <h2>Workout activity</h2>
            <p>Workouts logged each day over the last 7 days.</p>
          </div>
        </div>
        {hasWorkouts ? (
          <div className="dashboard-chart">
            <ResponsiveContainer>
              <BarChart data={dailyActivity} margin={{ top: 5, right: 12, bottom: 5, left: -12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#edf1ed" />
                <XAxis dataKey="day" stroke="#7c8981" fontSize={10} />
                <YAxis allowDecimals={false} stroke="#7c8981" fontSize={10} />
                <Tooltip />
                <Bar dataKey="workouts" name="Workouts" fill="#1b7a56" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="portal-empty">Log a workout this week to see your activity chart.</div>
        )}
      </section>

      <section className="portal-card dashboard-chart-card">
        <div className="portal-card-heading">
          <div>
            <h2>Calories by day</h2>
            <p>Daily calories from meals logged over the last 7 days.</p>
          </div>
        </div>
        {hasCalories ? (
          <div className="dashboard-chart">
            <ResponsiveContainer>
              <BarChart data={dailyActivity} margin={{ top: 5, right: 12, bottom: 5, left: -12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#edf1ed" />
                <XAxis dataKey="day" stroke="#7c8981" fontSize={10} />
                <YAxis stroke="#7c8981" fontSize={10} />
                <Tooltip />
                <Bar dataKey="calories" name="Calories" fill="#e6a23c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="portal-empty">Log meals this week to see your calorie chart.</div>
        )}
      </section>

      <section className="portal-card dashboard-chart-card dashboard-chart-card-wide">
        <div className="portal-card-heading">
          <div>
            <h2>Weight progress</h2>
            <p>Your 12 most recent weight check-ins.</p>
          </div>
        </div>
        {weightData.length > 0 ? (
          <div className="dashboard-chart">
            <ResponsiveContainer>
              <LineChart data={weightData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#edf1ed" />
                <XAxis dataKey="date" stroke="#7c8981" fontSize={10} />
                <YAxis stroke="#7c8981" fontSize={10} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="weight"
                  name="Weight"
                  stroke="#1b7a56"
                  strokeWidth={2}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="portal-empty">Record your weight in Progress to see your trend.</div>
        )}
      </section>
    </div>
  );
};

export default DashboardAnalytics;
