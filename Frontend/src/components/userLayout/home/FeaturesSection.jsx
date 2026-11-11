import React from 'react';
import { ArrowRight, ChartNoAxesColumnIncreasing, Salad, Dumbbell } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturesSection = () => {
  const features = [
    { title: 'Workout tracker', desc: 'Record your strength, cardio, and flexibility sessions. Keep your routine and training history in one place.', icon: Dumbbell, link: '/user/workouts', action: 'Explore workouts' },
    { title: 'Nutrition & meals', desc: 'Log what you eat and keep an eye on daily calories and nutrients as you build better habits.', icon: Salad, link: '/user/nutrition', action: 'Track nutrition' },
    { title: 'Progress insights', desc: 'Save your measurements and follow your changes over time, one milestone at a time.', icon: ChartNoAxesColumnIncreasing, link: '/user/progress', action: 'View progress' },
  ];

  return (
    <section className="home-features" id="home-features">
      <div className="home-container">
        <div className="home-section-heading">
          <span className="home-eyebrow"><span className="home-eyebrow-dot" /> Your wellness toolkit</span>
          <h2>Everything in one place.<br />Progress that feels like yours.</h2>
          <p>Simple tools to help you stay consistent, understand your habits, and make the next step count.</p>
        </div>
        <div className="home-feature-grid">
          {features.map(({ title, desc, icon: Icon, link, action }) => (
            <Link className="home-feature-card" key={title} to={link}>
              <span className="home-feature-icon"><Icon size={22} aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{desc}</p>
              <span className="home-feature-link">{action}<ArrowRight size={15} aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;