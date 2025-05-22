import React, { useState } from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  details: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon: Icon, color, details }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="h-96 perspective-1000"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div className={`relative w-full h-full duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front of card */}
        <div className="absolute w-full h-full backface-hidden border border-gray-200 rounded-xl shadow-md p-8 flex flex-col items-center justify-center bg-white">
          <div className={`w-24 h-24 ${color} rounded-full flex items-center justify-center mb-6 transform transition-all duration-300 group-hover:scale-110 shadow-lg`}>
            <Icon className="h-12 w-12 text-white stroke-[1.5]" strokeLinecap="round" strokeLinejoin="round" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">{title}</h3>
          <p className="text-gray-600 text-center">{description}</p>
        </div>
        
        {/* Back of card */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 border border-gray-200 rounded-xl shadow-md p-8 bg-gradient-to-br from-gray-50 to-white">
          <div className="h-full flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">{title}</h3>
              <p className="text-gray-600">{details}</p>
            </div>
            <button className="mt-4 w-full bg-primary-600 text-white py-3 rounded-md hover:bg-primary-700 transition-colors duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;