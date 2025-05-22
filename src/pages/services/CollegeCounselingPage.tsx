import React from 'react';

const CollegeCounselingPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">College Counseling</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-lg text-gray-600 mb-6">
              Our comprehensive college counseling services guide students through every step of the college admissions process. From selecting the right schools to crafting compelling applications, we're here to help you succeed.
            </p>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start">
                <span className="w-2 h-2 mt-2 mr-2 bg-[#0085c2] rounded-full"></span>
                College List Development
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 mt-2 mr-2 bg-[#0085c2] rounded-full"></span>
                Application Strategy
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 mt-2 mr-2 bg-[#0085c2] rounded-full"></span>
                Essay Writing Support
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 mt-2 mr-2 bg-[#0085c2] rounded-full"></span>
                Interview Preparation
              </li>
            </ul>
          </div>
          <div className="relative">
            <img 
              src="https://images.pexels.com/photos/4778611/pexels-photo-4778611.jpeg"
              alt="College Counseling"
              className="rounded-lg shadow-lg w-full h-[400px] object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeCounselingPage;