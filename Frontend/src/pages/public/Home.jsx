import React from 'react';
import HeroSection from '../../components/userLayout/home/HeroSection';
import FeaturesSection from '../../components/userLayout/home/FeaturesSection';
import StatsSection from '../../components/userLayout/home/StatsSection';
import CTASection from '../../components/userLayout/home/CTASection';
import './Home.css';

const Home = () => (
  <div className="home-page">
    <HeroSection />
    <FeaturesSection />
    <StatsSection />
    <CTASection />
  </div>
);

export default Home;
