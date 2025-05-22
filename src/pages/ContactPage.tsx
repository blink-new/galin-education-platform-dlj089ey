import React from 'react';
import ContactForm from '../components/ContactForm';
import LocationCard from '../components/LocationCard';

const locations = [
  {
    name: 'Madison',
    address: '5102 Silvertree Run, Madison, WI 53705',
    phone: '(608) 841-1053',
    email: 'info@galined.com'
  },
  {
    name: 'Milwaukee',
    address: '10555 North Port Washington Road, Mequon, WI 53092',
    phone: '(608) 841-1053',
    email: 'info@galined.com'
  },
  {
    name: 'San Francisco',
    address: '1328 4th St., San Rafael, CA 94901',
    phone: '(415) 846-6243',
    email: 'info@galined.com'
  }
];

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24">
      <div className="grid md:grid-cols-2">
        {/* Left Column - Locations */}
        <div className="bg-[#0085c2] p-8 md:p-12 lg:p-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Locations</h2>
          {locations.map((location, index) => (
            <LocationCard key={index} {...location} />
          ))}
        </div>
        
        {/* Right Column - Contact Form */}
        <div className="p-8 md:p-12 lg:p-16 bg-white flex flex-col items-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Get in Touch</h2>
          <div className="w-full">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;