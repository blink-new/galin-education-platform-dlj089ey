import React from 'react';

const ExecutiveFunctioningPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Executive Functioning Coaching</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-lg text-gray-600 mb-6">
              Our executive functioning coaching helps students develop crucial skills for academic and personal success. We focus on building organizational abilities, time management, and study strategies.
            </p>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start">
                <span className="w-2 h-2 mt-2 mr-2 bg-[#0085c2] rounded-full"></span>
                Time Management
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 mt-2 mr-2 bg-[#0085c2] rounded-full"></span>
                Organization Skills
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 mt-2 mr-2 bg-[#0085c2] rounded-full"></span>
                Study Strategies
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 mt-2 mr-2 bg-[#0085c2] rounded-full"></span>
                Goal Setting & Planning
              </li>
            </ul>
          </div>
          <div className="relative">
            <img 
              src="https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg"
              alt="Executive Functioning Coaching"
              className="rounded-lg shadow-lg w-full h-[400px] object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveFunctioningPage;