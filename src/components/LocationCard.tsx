import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

interface LocationProps {
  name: string;
  address: string;
  phone: string;
  email: string;
}

const LocationCard: React.FC<LocationProps> = ({ name, address, phone, email }) => {
  return (
    <div className="mb-8">
      <h3 className="text-[#FFB546] text-2xl font-semibold mb-4">{name}</h3>
      <div className="space-y-3">
        <div className="flex items-start">
          <MapPin className="w-5 h-5 mt-1 mr-3 text-white/80" />
          <span className="text-white/90">{address}</span>
        </div>
        <div className="flex items-center">
          <Phone className="w-5 h-5 mr-3 text-white/80" />
          <a href={`tel:${phone}`} className="text-white/90 hover:text-white">
            {phone}
          </a>
        </div>
        <div className="flex items-center">
          <Mail className="w-5 h-5 mr-3 text-white/80" />
          <a href={`mailto:${email}`} className="text-white/90 hover:text-white">
            {email}
          </a>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;