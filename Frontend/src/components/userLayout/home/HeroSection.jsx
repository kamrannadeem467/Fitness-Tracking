import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, Check, Dumbbell, Flame, Sparkles } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="home-hero">
      <div className="home-container home-hero-grid">
        <div className="home-hero-copy">
          <span className="home-eyebrow"><span className="home-eyebrow-dot" /> Fitness, made personal</span>
          <h1>Small steps.<br /><span>Stronger you.</span></h1>
          <p>Bring your workouts, nutrition, and progress into one simple space. Build healthy routines at your pace and see how far you have come.</p>
          <div className="home-hero-actions">
            <Link to="/user/register" className="home-button home-button-primary">
              Start your journey <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <a href="#home-features" className="home-button home-button-outline">
              Explore features <ArrowDown size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="home-hero-note">
            <Check size={15} aria-hidden="true" />
            A simple toolkit for your everyday wellness
          </div>
        </div>

        <div className="home-hero-art" aria-label="Fitness dashboard preview">
          <div className="home-orbit" aria-hidden="true" />
          <div className="home-floating-badge home-floating-badge-one">
            <Sparkles size={16} aria-hidden="true" /> Your goals, your pace
          </div>
          <div className="home-workout-card">
            <div className="home-workout-card-top">
              <span>YOUR WEEKLY OVERVIEW</span>
              <span className="home-workout-pill">This week</span>
            </div>
            <div className="home-workout-title">
              <span className="home-workout-icon"><Dumbbell size={21} aria-hidden="true" /></span>
              <span>
                <h3>Workout goal</h3>
                <p>Keep showing up</p>
              </span>
            </div>
            <div className="home-workout-metric">
              <strong>3 of 4</strong>
              <span>sessions logged</span>
            </div>
            <div className="home-progress-track" aria-label="75 percent of weekly workout goal">
              <span />
            </div>
            <div className="home-workout-footer">
              <span>One day at a time</span><span>75%</span>
            </div>
          </div>
          <div className="home-floating-badge home-floating-badge-two">
            <Flame size={16} aria-hidden="true" /> Progress you can feel
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;