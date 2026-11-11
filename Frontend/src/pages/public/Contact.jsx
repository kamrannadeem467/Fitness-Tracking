import { ArrowRight, CircleHelp, Dumbbell, LockKeyhole, Salad } from 'lucide-react';
import { Link } from 'react-router-dom';
import './PublicPages.css';

const helpTopics = [
  {
    icon: LockKeyhole,
    title: 'Account access',
    description: 'Sign in to your account or create one to save your wellness activity.',
    link: '/user/login',
    action: 'Go to sign in',
  },
  {
    icon: Dumbbell,
    title: 'Workout tracking',
    description: 'Find your workout tools and keep a record of the sessions you complete.',
    link: '/user/workouts',
    action: 'Explore workouts',
  },
  {
    icon: Salad,
    title: 'Nutrition & progress',
    description: 'Visit your trackers to log meals and follow your personal progress.',
    link: '/user/nutrition',
    action: 'Explore trackers',
  },
];

const Contact = () => (
  <div className="public-page">
    <section className="public-hero public-contact-hero">
      <div className="public-container public-hero-content">
        <span className="public-eyebrow"><span /> How can we help?</span>
        <h1>Find the right next<br /><span>step for you.</span></h1>
        <p>Whether you are getting started or looking for a specific tool, use these quick links to find your way around Wellnest.</p>
        <a className="public-button public-button-primary" href="#contact-help">
          Browse help topics <ArrowRight size={17} aria-hidden="true" />
        </a>
      </div>
      <div className="public-hero-decoration public-contact-decoration" aria-hidden="true">
        <span className="public-decoration-ring public-decoration-ring-one" />
        <span className="public-decoration-ring public-decoration-ring-two" />
        <span className="public-decoration-center"><CircleHelp size={38} /></span>
      </div>
    </section>

    <section className="public-contact-help" id="contact-help">
      <div className="public-container">
        <div className="public-section-heading">
          <span className="public-eyebrow"><span /> Quick help</span>
          <h2>What would you like to do?</h2>
          <p>Choose a topic to jump straight to the page or tool you need.</p>
        </div>
        <div className="public-principle-grid public-help-grid">
          {helpTopics.map(({ icon: Icon, title, description, link, action }) => (
            <article className="public-principle-card public-help-card" key={title}>
              <span className="public-principle-icon"><Icon size={22} aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{description}</p>
              <Link className="public-text-link" to={link}>{action} <ArrowRight size={15} aria-hidden="true" /></Link>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="public-faq">
      <div className="public-container public-faq-grid">
        <div className="public-faq-intro">
          <span className="public-eyebrow"><span /> Good to know</span>
          <h2>A few common questions.</h2>
          <p>Helpful details for finding your way around the app.</p>
          <Link className="public-text-link" to="/about">Learn about Wellnest <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
        <div className="public-faq-list">
          <details className="public-faq-item">
            <summary>Do I need an account to track my activity?</summary>
            <p>Yes. Create an account and sign in to use the workout, nutrition, and progress trackers.</p>
          </details>
          <details className="public-faq-item">
            <summary>Where can I find my saved activity?</summary>
            <p>After signing in, open your dashboard to find your personal tools and activity.</p>
          </details>
          <details className="public-faq-item">
            <summary>How do I get started?</summary>
            <p>Create a free account, then choose a tracker that fits the habit you want to focus on first.</p>
          </details>
        </div>
      </div>
    </section>
  </div>
);

export default Contact;
