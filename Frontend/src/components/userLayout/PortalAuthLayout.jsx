import { Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Portal.css';

const PortalAuthLayout = ({ children, eyebrow, headline, description, title, subtitle }) => (
  <main className="portal-auth-page">
    <div className="portal-auth-layout">
      <aside className="portal-auth-aside">
        <Link className="portal-brand" to="/home">
          <span className="portal-brand-mark"><Activity size={19} aria-hidden="true" /></span>
          <span>wellnest<span>.</span></span>
        </Link>
        <div className="portal-auth-aside-copy">
          <span className="portal-eyebrow">{eyebrow}</span>
          <h1>{headline}</h1>
          <p>{description}</p>
        </div>
        <p className="portal-auth-aside-foot">A little more consistency. A little more confidence.</p>
      </aside>
      <section className="portal-auth-content">
        <h2>{title}</h2>
        <p className="portal-auth-subtitle">{subtitle}</p>
        {children}
      </section>
    </div>
  </main>
);

export default PortalAuthLayout;
