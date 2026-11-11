import React from 'react';

const StatsSection = () => {
  const stats = [
    { value: '3-in-1', label: 'Workouts, nutrition & progress' },
    { value: 'Your pace', label: 'Build routines that fit your life' },
    { value: 'Anytime', label: 'Your wellness tools, in one place' },
  ];

  return (
    <section className="home-stats" aria-label="Platform highlights">
      <div className="home-container home-stats-grid">
        {stats.map(({ value, label }) => (
          <div className="home-stat" key={value}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;