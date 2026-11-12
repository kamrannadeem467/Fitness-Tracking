import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

const NutritionAnalytics = ({ nutritionLogs }) => {
  if (!nutritionLogs || nutritionLogs.length === 0) {
    return (
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', marginTop: '20px', textAlign: 'center' }}>
        <h3 style={{ color: '#333', fontSize: '16px' }}>Nutrition Analytics</h3>
        <p style={{ color: '#777', fontSize: '14px' }}>Log some meals to see your calorie and macro trends here!</p>
      </div>
    );
  }

  // Data ko chart ke format mein map karein
  const chartData = nutritionLogs.map((log, index) => {
    // Total calories calculate karein is meal log ki
    const totalCalories = log.foodItems ? log.foodItems.reduce((acc, curr) => acc + (curr.calories || 0), 0) : 0;
    const totalProtein = log.foodItems ? log.foodItems.reduce((acc, curr) => acc + (curr.protein || 0), 0) : 0;
    const totalCarbs = log.foodItems ? log.foodItems.reduce((acc, curr) => acc + (curr.carbs || 0), 0) : 0;
    const totalFats = log.foodItems ? log.foodItems.reduce((acc, curr) => acc + (curr.fats || 0), 0) : 0;

    return {
      name: `${log.mealType} (${index + 1})`,
      date: new Date(log.date).toLocaleDateString(),
      Calories: totalCalories,
      Protein: totalProtein,
      Carbs: totalCarbs,
      Fats: totalFats
    };
  });

  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', marginTop: '20px' }}>
      <h3 style={{ color: '#333', fontSize: '18px', marginBottom: '15px' }}>Nutrition & Calorie Trends</h3>
      
      <div style={{ width: '100%', height: '280px' }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="name" stroke="#666" fontSize={11} />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Calories" fill="#28a745" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Protein" fill="#007bff" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Carbs" fill="#ffc107" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Fats" fill="#dc3545" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p style={{ fontSize: '12px', color: '#888', textAlign: 'center', marginTop: '10px' }}>
        *Tracking calories and macronutrients (Protein, Carbs, Fats) across your logged meals.
      </p>
    </div>
  );
};

export default NutritionAnalytics;