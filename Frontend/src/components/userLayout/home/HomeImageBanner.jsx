import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomeImageBanner = () => (
  <section className="home-image-banner" aria-labelledby="home-image-banner-title">
    <div className="home-container">
      <div className="home-image-banner-content">
        <span className="home-image-banner-kicker">YOUR NEXT REP. YOUR NEXT MILESTONE.</span>
        <h2 id="home-image-banner-title">Make every move count.</h2>
        <p>Bring your training, nutrition, and progress together. Start with one step today.</p>
        <Link className="home-button home-button-primary" to="/user/register">
          Start your journey <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </div>
  </section>
);

export default HomeImageBanner;
