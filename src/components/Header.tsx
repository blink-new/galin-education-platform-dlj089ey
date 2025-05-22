import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogIn } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownTimer, setDropdownTimer] = useState<NodeJS.Timeout | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleMouseEnter = (itemName: string) => {
    if (dropdownTimer) clearTimeout(dropdownTimer);
    setActiveDropdown(itemName);
  };

  const handleMouseLeave = () => {
    const timer = setTimeout(() => {
      setActiveDropdown(null);
    }, 300);
    setDropdownTimer(timer);
  };

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setIsMenuOpen(false);
  };

  const handleServicesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const servicesSection = document.getElementById('services');
      if (servicesSection) {
        const yOffset = -180; // Increased offset for better framing
        const y = servicesSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } else {
      navigate('/', { state: { scrollToServices: true } });
    }
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (location.state?.scrollToServices) {
      const servicesSection = document.getElementById('services');
      if (servicesSection) {
        const yOffset = -180; // Increased offset for better framing
        const y = servicesSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
      // Clear the state to prevent scrolling on subsequent navigation
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const navigationItems = [
    { name: 'Home', path: '/' },
    {
      name: 'Services',
      path: '/#services',
      dropdownItems: [
        { name: 'College Counseling', path: '/services/college-counseling' },
        { name: 'Graduate Admissions', path: '/services/graduate-admissions' },
        { name: 'Test Prep', path: '/services/test-prep' },
        { name: 'Executive Functioning Coaching', path: '/services/executive-functioning' },
        { name: 'Tutoring', path: '/services/tutoring' }
      ]
    },
    {
      name: 'About',
      path: '/about',
      dropdownItems: [
        { name: 'Our Story', path: '/about/story' },
        { name: 'Results', path: '/about/story/results' },
        { name: 'Team', path: '/about/team' },
      ]
    },
    {
      name: 'Resources',
      path: '/resources',
      dropdownItems: [
        { name: 'Blog', path: '/resources/blog' },
        { name: 'Events', path: '/resources/events' },
      ]
    }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 backdrop-blur-sm py-4'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1">
            <Link to="/" onClick={handleNavClick} className="flex-shrink-0">
              <img 
                src="https://res.cloudinary.com/davwtxoeo/image/upload/v1747795724/Galin-Small-Color_cjcsvu.png" 
                alt="Galin Education" 
                className="h-12" 
              />
            </Link>
            
            <nav className="hidden lg:flex items-center ml-16">
              <div className="flex items-center space-x-12">
                {navigationItems.map((item) => (
                  <div
                    key={item.name}
                    className="relative group"
                    onMouseEnter={() => handleMouseEnter(item.name)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {item.name === 'Services' ? (
                      <a
                        href="#services"
                        onClick={handleServicesClick}
                        className="text-base lg:text-lg font-medium transition-colors duration-200 text-[#0085c2] hover:text-[#FFB546]"
                      >
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={handleNavClick}
                        className={`text-base lg:text-lg font-medium transition-colors duration-200 text-[#0085c2] hover:text-[#FFB546] ${
                          location.pathname === item.path || 
                          (item.dropdownItems && item.dropdownItems.some(dropItem => location.pathname === dropItem.path))
                            ? 'border-b-2 border-[#FFB546]'
                            : ''
                        }`}
                      >
                        {item.name}
                      </Link>
                    )}
                    
                    {item.dropdownItems && activeDropdown === item.name && (
                      <div 
                        className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg py-2 w-64"
                        onMouseEnter={() => handleMouseEnter(item.name)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="flex flex-col">
                          {item.dropdownItems.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              to={dropdownItem.path}
                              onClick={handleNavClick}
                              className={`block px-4 py-2 text-base text-[#0085c2] hover:text-[#FFB546] transition-colors duration-200 ${
                                location.pathname === dropdownItem.path
                                  ? 'border-l-4 border-[#FFB546] bg-gray-50'
                                  : ''
                              }`}
                            >
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/contact"
              onClick={handleNavClick}
              className={`px-6 py-2 rounded-md text-base lg:text-lg font-medium transition-colors duration-200 ${
                location.pathname === '/contact'
                  ? 'bg-[#FFB546] text-white'
                  : 'bg-[#0085c2] text-white hover:bg-[#FFB546]'
              }`}
            >
              Contact
            </Link>

            <Link
              to="/login"
              onClick={handleNavClick}
              className="p-2 text-[#0085c2] hover:text-[#FFB546] transition-colors duration-200"
              aria-label="Login"
            >
              <LogIn className="w-6 h-6" />
            </Link>
          </div>

          <button 
            className="lg:hidden ml-4 text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 lg:hidden" onClick={() => setIsMenuOpen(false)}>
          <div 
            className="absolute right-0 top-[72px] w-full max-w-sm h-[calc(100vh-72px)] bg-white overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 space-y-2">
              {navigationItems.map((item) => (
                <div key={item.name}>
                  {item.name === 'Services' ? (
                    <a
                      href="#services"
                      onClick={handleServicesClick}
                      className="block px-3 py-2 rounded-md text-lg font-medium text-[#0085c2] hover:text-[#FFB546]"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={handleNavClick}
                      className={`block px-3 py-2 rounded-md text-lg font-medium text-[#0085c2] hover:text-[#FFB546] ${
                        location.pathname === item.path
                          ? 'border-l-4 border-[#FFB546] bg-gray-50'
                          : ''
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                  {item.dropdownItems && (
                    <div className="pl-4 space-y-1">
                      {item.dropdownItems.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          to={dropdownItem.path}
                          onClick={handleNavClick}
                          className={`block px-3 py-2 text-base text-[#0085c2] hover:text-[#FFB546] ${
                            location.pathname === dropdownItem.path
                              ? 'border-l-4 border-[#FFB546] bg-gray-50'
                              : ''
                          }`}
                        >
                          {dropdownItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;