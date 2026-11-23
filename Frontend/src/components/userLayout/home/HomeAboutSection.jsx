import { ArrowRight, Dumbbell, Heart, Salad, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomeAboutSection = () => (
  <section className="home-about" id="home-about">
    <div className="home-container home-about-grid">
      <div className="home-about-copy">
        <span className="home-eyebrow">
          <span className="home-eyebrow-dot" /> About Wellnest
        </span>
        <h2>Fitness that fits <span>your life.</span></h2>
        <p>
          Building a healthier routine should feel motivating, not complicated.
          Wellnest brings the essentials together so you can focus on showing up
          and making progress at your own pace.
        </p>
        <Link className="home-about-link" to="/about">
          Get to know us <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>

      <div className="home-about-list" aria-label="What you can do with Wellnest">
        <div className="home-about-item">
          <span className="home-about-icon"><Dumbbell size={19} aria-hidden="true" /></span>
          <span><strong>Move with a plan</strong><small>Keep workouts and routines in one place.</small></span>
        </div>
        <div className="home-about-item">
          <span className="home-about-icon"><Salad size={19} aria-hidden="true" /></span>
          <span><strong>Build mindful habits</strong><small>Track meals and stay aware of your nutrition.</small></span>
        </div>
        <div className="home-about-item">
          <span className="home-about-icon"><TrendingUp size={19} aria-hidden="true" /></span>
          <span><strong>See your progress</strong><small>Notice the small wins that add up over time.</small></span>
        </div>
        <Heart className="home-about-watermark" size={74} aria-hidden="true" />
      </div>
    </div>
  </section>
);

export default HomeAboutSection;
