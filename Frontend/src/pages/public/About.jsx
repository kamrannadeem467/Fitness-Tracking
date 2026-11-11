import { ArrowRight, Heart, Leaf, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import './PublicPages.css';

const principles = [
  {
    icon: Heart,
    title: 'Wellbeing over perfection',
    description: 'Healthy routines should support your life, not make it harder. Start small and keep what works for you.',
  },
  {
    icon: Target,
    title: 'Progress at your pace',
    description: 'Set personal goals, track your efforts, and celebrate the steady work behind every milestone.',
  },
  {
    icon: Leaf,
    title: 'Simple, useful tools',
    description: 'Keep workouts, meals, and progress together so it is easier to stay mindful and consistent.',
  },
];

const About = () => (
  <div className="public-page">
    <section className="public-hero">
      <div className="public-container public-hero-content">
        <span className="public-eyebrow"><span /> A little about us</span>
        <h1>Wellness is a journey.<br /><span>Make it your own.</span></h1>
        <p>Wellnest brings your everyday fitness tools together, helping you build healthy habits with more clarity and less pressure.</p>
        <Link className="public-button public-button-primary" to="/user/register">
          Start your journey <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
      <div className="public-hero-decoration" aria-hidden="true">
        <span className="public-decoration-ring public-decoration-ring-one" />
        <span className="public-decoration-ring public-decoration-ring-two" />
        <span className="public-decoration-center"><Heart size={38} /></span>
      </div>
    </section>

    <section className="public-story">
      <div className="public-container public-story-grid">
        <div className="public-story-label">
          <span className="public-eyebrow"><span /> Our approach</span>
          <h2>Small steps can add up to meaningful change.</h2>
        </div>
        <div className="public-story-copy">
          <p>Fitness is not one-size-fits-all. Your goals, your schedule, and your starting point are uniquely yours. Wellnest is designed to help you keep track of the things that matter to you without losing sight of the bigger picture.</p>
          <p>Log a workout, check in on your nutrition, or note a new milestone. One day at a time, you can learn what helps you feel your best.</p>
          <Link className="public-text-link" to="/contact">Explore ways to get started <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>

    <section className="public-principles">
      <div className="public-container">
        <div className="public-section-heading">
          <span className="public-eyebrow"><span /> What matters to us</span>
          <h2>A healthier routine, built around you.</h2>
        </div>
        <div className="public-principle-grid">
          {principles.map(({ icon: Icon, title, description }, index) => (
            <article className="public-principle-card" key={title}>
              <span className={`public-principle-icon public-principle-icon-${index + 1}`}>
                <Icon size={22} aria-hidden="true" />
              </span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="public-bottom-cta">
      <div className="public-container public-bottom-cta-inner">
        <div>
          <span className="public-eyebrow"><span /> Your next step</span>
          <h2>Make room for progress.</h2>
          <p>Explore the tools and find a routine that feels right for you.</p>
        </div>
        <Link className="public-button public-button-light" to="/home">
          Explore Wellnest <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </section>
  </div>
);

export default About;
