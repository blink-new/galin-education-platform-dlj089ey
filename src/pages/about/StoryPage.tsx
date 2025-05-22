import React from 'react';

const StoryPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Story</h1>
      <div className="prose max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          Our journey began with a vision to transform education and empower the next generation of leaders. Through dedication, innovation, and unwavering commitment to excellence, we've grown into a trusted partner for educational advancement.
        </p>
        <div className="grid md:grid-cols-2 gap-8 my-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600">
              To provide exceptional educational opportunities that inspire growth, foster innovation, and create lasting positive impact in our communities.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Vision</h2>
            <p className="text-gray-600">
              To be the leading force in educational transformation, setting new standards for academic excellence and student success.
            </p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-8 my-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Timeline</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="font-bold text-blue-600">2020</div>
              <div>Founded with the mission to revolutionize education</div>
            </div>
            <div className="flex gap-4">
              <div className="font-bold text-blue-600">2021</div>
              <div>Launched our first comprehensive educational program</div>
            </div>
            <div className="flex gap-4">
              <div className="font-bold text-blue-600">2022</div>
              <div>Expanded services to reach more students nationwide</div>
            </div>
            <div className="flex gap-4">
              <div className="font-bold text-blue-600">2023</div>
              <div>Achieved milestone of supporting over 1000 students</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryPage;