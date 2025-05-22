import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  
  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleServicesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const servicesSection = document.getElementById('services');
      if (servicesSection) {
        const yOffset = -100;
        const y = servicesSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } else {
      window.location.href = '/#services';
    }
  };
  
  return (
    <footer className="bg-[#7CADD3] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 flex flex-col items-center justify-center">
            <img 
              src="https://res.cloudinary.com/davwtxoeo/image/upload/v1747795610/galinnbwhite_zrilut.png" 
              alt="Galin Education" 
              className="h-24 mb-8" 
            />
            <div className="flex space-x-4">
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <button onClick={handleServicesClick} className="text-lg font-semibold mb-4 block hover:text-white transition-colors">Services</button>
            <ul className="space-y-2">
              <li><Link to="/services/college-counseling" onClick={handleNavClick} className="text-white/80 hover:text-white transition-colors">College Counseling</Link></li>
              <li><Link to="/services/test-prep" onClick={handleNavClick} className="text-white/80 hover:text-white transition-colors">Test Prep</Link></li>
              <li><Link to="/services/executive-functioning" onClick={handleNavClick} className="text-white/80 hover:text-white transition-colors">Executive Functioning</Link></li>
              <li><Link to="/services/tutoring" onClick={handleNavClick} className="text-white/80 hover:text-white transition-colors">Tutoring</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/resources/blog" onClick={handleNavClick} className="text-white/80 hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/resources/events" onClick={handleNavClick} className="text-white/80 hover:text-white transition-colors">Events</Link></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Testimonials</a></li>
              <li><Link to="/careers" onClick={handleNavClick} className="text-white/80 hover:text-white transition-colors">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <Link to="/contact" onClick={handleNavClick} className="text-lg font-semibold mb-4 block hover:text-white transition-colors">Contact</Link>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-2 mt-0.5 text-white/80" />
                <a href="mailto:info@galined.com" className="text-white/80 hover:text-white transition-colors">info@galined.com</a>
              </li>
              <li className="text-white/80">(555) 123-4567</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/80 text-sm">
            © {currentYear} Galin Education. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-white/80 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-white/80 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-white/80 hover:text-white text-sm transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;