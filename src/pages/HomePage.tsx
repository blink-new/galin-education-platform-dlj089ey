import React from 'react';
import Hero from '../components/Hero';
import ServicesSection from '../components/ServicesSection';
import TestimonialCarousel from '../components/TestimonialCarousel';

const HomePage: React.FC = () => {
  return (
    <div>
      <Hero />
      <ServicesSection />
      <TestimonialCarousel />
    </div>
  );
};

export default HomePage;