import React from 'react';

const TestPrepPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Test Preparation</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-lg text-gray-600 mb-6">
              Our test preparation programs are designed to help students achieve their highest potential scores on standardized tests. We offer personalized strategies and comprehensive practice for all major exams.
            </p>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start">
                <span className="w-2 h-2 mt-2 mr-2 bg-[#0085c2] rounded-full"></span>
                SAT Preparation
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 mt-2 mr-2 bg-[#0085c2] rounded-full"></span>
                ACT Preparation
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 mt-2 mr-2 bg-[#0085c2] rounded-full"></span>
                AP Exam Support
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 mt-2 mr-2 bg-[#0085c2] rounded-full"></span>
                Practice Tests & Analysis
              </li>
            </ul>
          </div>
          <div className="relative">
            <img 
              src="https://images.pexels.com/photos/4778621/pexels-photo-4778621.jpeg"
              alt="Test Preparation"
              className="rounded-lg shadow-lg w-full h-[400px] object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPrepPage;