import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section 
      id="home" 
      className="pt-24 md:pt-32 pb-16 md:pb-24 bg-[#0085c2]"
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-16">
        <div className="flex flex-col xl:flex-row items-center justify-between gap-12 xl:gap-24">
          <div className="w-full xl:w-[45%] text-center xl:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white leading-tight">
              Unlock Your <span className="text-[#FFB546]">Academic</span> Potential
            </h1>
            <p className="mt-4 md:mt-6 text-base md:text-lg 2xl:text-xl text-white/90 max-w-2xl mx-auto xl:mx-0">
              Personalized educational services designed to help students excel academically and prepare for their future. Our expert educators provide the guidance you need to succeed.
            </p>
            <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-center justify-center xl:justify-start gap-4">
              <Link 
                to="/contact" 
                className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-[#FFB546] bg-[#FFB546] text-white font-medium rounded-md hover:bg-[#0085c2] hover:border-white transition-colors duration-200"
              >
                Schedule Free Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a 
                href="#services" 
                className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-white text-white font-medium rounded-md hover:bg-[#FFB546] hover:border-[#FFB546] transition-colors duration-200"
              >
                Explore Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
          <div className="w-full xl:w-[50%]">
            <div className="relative max-w-2xl mx-auto xl:ml-auto xl:mr-0">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#FFB546] rounded-full opacity-20"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white rounded-full opacity-20"></div>
              <img 
                src="https://res.cloudinary.com/davwtxoeo/image/upload/v1747796981/180407_GalinEducation_00981_ci8s6n.jpg" 
                alt="Students studying together" 
                className="rounded-2xl shadow-xl object-cover w-full h-[300px] md:h-[400px] xl:h-[500px] 2xl:h-[600px] relative z-10"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;