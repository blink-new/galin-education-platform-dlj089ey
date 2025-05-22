import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TeamMember } from '../types/team';

type TeamMemberCardProps = Omit<TeamMember, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
};

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ 
  name, 
  title, 
  image_url, 
  degrees, 
  bio, 
  category 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div 
      className="h-[400px] perspective-1000"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div className={`relative w-full h-full duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front of card */}
        <div className="absolute w-full h-full backface-hidden bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-3/5">
            <img 
              src={image_url} 
              alt={name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
            <p className="text-[#0085c2] font-medium">{title}</p>
          </div>
        </div>

        {/* Back of card */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white rounded-lg shadow-lg p-6">
          <div className="h-full flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
            <p className="text-[#0085c2] font-medium mb-4">{title}</p>
            <div className="mb-4 flex flex-wrap gap-2">
              {degrees.map((degree, index) => (
                <span 
                  key={index} 
                  className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
                >
                  {degree}
                </span>
              ))}
            </div>
            <p className="text-gray-600 text-sm line-clamp-6">
              {bio}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamMemberCard;