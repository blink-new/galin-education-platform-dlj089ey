import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  stars: number;
  image?: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ quote, author, role, stars, image }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 md:p-8 h-full flex flex-col justify-between">
      <div>
        <div className="flex mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
        <p className="text-gray-700 italic mb-6">"{quote}"</p>
      </div>

      <div className="flex items-center">
        {image ? (
          <img
            src={image}
            alt={author}
            className="h-12 w-12 rounded-full object-cover mr-4"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-4">
            <span className="font-medium text-lg">{author.charAt(0)}</span>
          </div>
        )}
        <div>
          <h4 className="font-semibold text-gray-900">{author}</h4>
          <p className="text-sm text-gray-600">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;