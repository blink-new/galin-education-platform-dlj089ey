import React from 'react';

const GraduateAdmissionsPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Graduate Admissions Advising</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-lg text-gray-600 mb-6">
              Our graduate admissions advising services help you navigate the complex process of applying to graduate programs. From selecting the right programs to crafting compelling personal statements, we provide comprehensive support for your graduate school journey.
            </p>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start">
                <span className="w-2 h-2 mt-2 mr-2 bg-[#0085c2] rounded-full"></span>
                Program Selection Strategy
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 mt-2 mr-2 bg-[#0085c2] rounded-full"></span>
                Personal Statement Development
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 mt-2 mr-2 bg-[#0085c2] rounded-full"></span>
                Application Timeline Planning
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 mt-2 mr-2 bg-[#0085c2] rounded-full"></span>
                Interview Preparation
              </li>
            </ul>
          </div>
          <div className="relative">
            <img 
              src="https://images.pexels.com/photos/7092613/pexels-photo-7092613.jpeg"
              alt="Graduate Admissions"
              className="rounded-lg shadow-lg w-full h-[400px] object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraduateAdmissionsPage;