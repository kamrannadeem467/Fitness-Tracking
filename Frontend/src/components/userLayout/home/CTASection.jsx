import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="home-cta">
      <div className="home-container">
        <div className="home-cta-panel">
          <div className="home-cta-copy">
            <span className="home-eyebrow"><span className="home-eyebrow-dot" /> Start where you are</span>
            <h2>Ready to make your next move?</h2>
            <p>Create your free account and bring your workouts, meals, and milestones together in one place.</p>
          </div>
          <Link to="/user/register" className="home-button">
            Create free account <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;