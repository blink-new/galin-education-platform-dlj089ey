import React from 'react';

const TutoringPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Subject Tutoring</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-lg text-gray-600 mb-6">
              Our subject tutoring services provide targeted support across all academic disciplines. Our experienced tutors work one-on-one with students to build understanding and confidence.
            </p>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start">
                <span className="w-2 h-2 mt-2 mr-2 bg-[#0085c2] rounded-full"></span>
                Mathematics
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 mt-2 mr-2 bg-[#0085c2] rounded-full"></span>
                Sciences
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 mt-2 mr-2 bg-[#0085c2] rounded-full"></span>
                English & Writing
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 mt-2 mr-2 bg-[#0085c2] rounded-full"></span>
                Foreign Languages
              </li>
            </ul>
          </div>
          <div className="relative">
            <img 
              src="https://images.pexels.com/photos/4778664/pexels-photo-4778664.jpeg"
              alt="Subject Tutoring"
              className="rounded-lg shadow-lg w-full h-[400px] object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutoringPage;