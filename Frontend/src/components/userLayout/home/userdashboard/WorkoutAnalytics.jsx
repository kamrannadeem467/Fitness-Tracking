import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const WorkoutAnalytics = ({ workouts }) => {
  // Agar workouts nahi hain toh message show karein
  if (!workouts || workouts.length === 0) {
    return (
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', marginTop: '20px', textAlign: 'center' }}>
        <h3 style={{ color: '#333', fontSize: '16px' }}>Workout Analytics</h3>
        <p style={{ color: '#777', fontSize: '14px' }}>Log some workouts to see your performance charts here!</p>
      </div>
    );
  }

  // Data ko chart ke format mein map karein (Date aur Weight extract kar ke)
  const chartData = workouts.map((w, index) => {
    // Workout ke pehle exercise ka weight nikal rahe hain (agar available ho)
    const firstExercise = w.exercises && w.exercises[0] ? w.exercises[0] : {};
    return {
      name: `Workout ${index + 1}`,
      date: new Date(w.date).toLocaleDateString(),
      weight: firstExercise.weight || 0,
      reps: firstExercise.reps || 0
    };
  });

  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', marginTop: '20px' }}>
      <h3 style={{ color: '#333', fontSize: '18px', marginBottom: '15px' }}>Workout Weight Progress (Analytics)</h3>
      
      <div style={{ width: '100%', height: '250px' }}>
        <ResponsiveContainer>
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="date" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip />
            <Line type="monotone" dataKey="weight" stroke="#0d6efd" strokeWidth={2} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p style={{ fontSize: '12px', color: '#888', textAlign: 'center', marginTop: '10px' }}>
        *Graphing weight lifted across your recent workout sessions.
      </p>
    </div>
  );
};

export default WorkoutAnalytics;