import HeroSection from '../../components/userLayout/home/HeroSection';
import HomeAboutSection from '../../components/userLayout/home/HomeAboutSection';
import FeaturesSection from '../../components/userLayout/home/FeaturesSection';
import StatsSection from '../../components/userLayout/home/StatsSection';
import HomeImageBanner from '../../components/userLayout/home/HomeImageBanner';
import CTASection from '../../components/userLayout/home/CTASection';
import './Home.css';

const Home = () => (
  <div className="home-page">
    <HeroSection />
    <HomeAboutSection />
    <FeaturesSection />
    <StatsSection />
    <HomeImageBanner />
    <CTASection />
  </div>
);

export default Home;
