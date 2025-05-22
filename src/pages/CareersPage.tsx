import React from 'react';

const CareersPage: React.FC = () => {
  const openings = [
    {
      title: 'College Counselor',
      type: 'Full-time',
      location: 'Madison, WI',
      description: 'Seeking experienced college counselor to guide students through the college admissions process.'
    },
    {
      title: 'Test Prep Instructor',
      type: 'Part-time',
      location: 'Milwaukee, WI',
      description: 'Looking for dedicated SAT/ACT prep instructors to help students achieve their target scores.'
    },
    {
      title: 'Executive Function Coach',
      type: 'Full-time',
      location: 'San Francisco, CA',
      description: 'Join our team helping students develop crucial organizational and study skills.'
    }
  ];

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Join Our Team</h1>
          <p className="text-lg text-gray-600 mb-12">
            At Galin Education, we're always looking for talented educators who are passionate about helping students succeed. Explore our current openings below.
          </p>

          <div className="space-y-6">
            {openings.map((job, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">{job.title}</h2>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className="text-sm bg-[#0085c2] text-white px-3 py-1 rounded-full">
                        {job.type}
                      </span>
                      <span className="text-sm text-gray-600">
                        {job.location}
                      </span>
                    </div>
                  </div>
                  <a
                    href={`mailto:info@galined.com?subject=Application for ${job.title} Position&body=I am interested in the ${job.title} position in ${job.location}.`}
                    className="bg-[#0085c2] text-white px-6 py-2 rounded-md hover:bg-[#FFB546] transition-colors duration-200"
                  >
                    Apply Now
                  </a>
                </div>
                <p className="text-gray-600">{job.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gray-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Don't see the right position?</h2>
            <p className="text-gray-600 mb-6">
              We're always interested in meeting talented educators. Send us your resume and let us know how you can contribute to our team.
            </p>
            <a
              href="mailto:info@galined.com?subject=General Application Inquiry"
              className="inline-block bg-[#0085c2] text-white px-8 py-3 rounded-md hover:bg-[#FFB546] transition-colors duration-200"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareersPage;