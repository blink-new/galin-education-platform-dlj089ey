import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    quote: "The college counseling services at Galin Education were instrumental in helping me get accepted to my dream school. The personalized attention and expert guidance made all the difference.",
    author: "Sarah J.",
    school: "Harvard University '24"
  },
  {
    quote: "Thanks to Galin's test prep program, I improved my SAT score by 200 points. The strategies and practice materials were exactly what I needed.",
    author: "Michael C.",
    school: "Stanford University '25"
  },
  {
    quote: "Working with Galin Education transformed my college application journey. Their guidance was invaluable.",
    author: "Emma L.",
    school: "Yale University '23"
  },
  {
    quote: "The tutoring services helped me excel in my AP classes. I couldn't have done it without their support.",
    author: "David R.",
    school: "Princeton University '24"
  }
];

const successStories = [
  {
    name: "Emily Chen",
    title: "Emily's Journey to Yale",
    image: "https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg?auto=compress&cs=tinysrgb&h=400&w=600&fit=crop",
    preview: "Emily worked with our college counselors for two years, developing a strong academic profile and crafting compelling applications. Her hard work paid off with acceptance to Yale University.",
    fullStory: `Emily came to Galin Education as a sophomore with dreams of attending an Ivy League university. Through dedicated work with our college counselors, she developed a strategic academic plan that included challenging coursework and meaningful extracurricular activities.

Our counselors helped Emily identify her passion for environmental science and guided her in creating a research project that earned state-wide recognition. With support from our test prep team, she achieved a 1580 on her SAT.

Emily's college essays, refined through multiple drafts with her counselor, beautifully captured her intellectual curiosity and commitment to environmental advocacy. Her acceptance to Yale's Class of 2023 was a testament to her hard work and the comprehensive support provided by the Galin team.`,
    class: "Class of 2023"
  },
  {
    name: "David Martinez",
    title: "David's Academic Transformation",
    image: "https://images.pexels.com/photos/1181695/pexels-photo-1181695.jpeg?auto=compress&cs=tinysrgb&h=400&w=600&fit=crop&top=30",
    preview: "Through executive functioning coaching and subject tutoring, David improved his GPA from 2.8 to 3.9 and gained acceptance to his top-choice engineering program.",
    fullStory: `David's journey with Galin Education began during his junior year when he was struggling to balance his challenging course load with his passion for robotics. Our executive functioning coach worked with David to develop personalized organization systems and study strategies that transformed his academic performance.

Through targeted tutoring in AP Physics and Calculus, David not only improved his grades but developed a deeper understanding of these subjects that enhanced his robotics projects. His GPA rose from 2.8 to 3.9, and his improved time management skills allowed him to take on leadership roles in his school's robotics club.

David's newfound academic confidence and demonstrated leadership abilities helped him secure acceptance to his dream engineering program. Today, he continues to excel in his studies while mentoring other students in robotics competitions.`,
    class: "Class of 2024"
  }
];

const ResultsPage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [direction, setDirection] = useState(0);
  const [expandedStory, setExpandedStory] = useState<number | null>(null);
  const [hoveredStory, setHoveredStory] = useState<number | null>(null);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentTestimonial((prev) => {
      let next = prev + newDirection;
      if (next >= testimonials.length) next = 0;
      if (next < 0) next = testimonials.length - 1;
      return next;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Results</h1>
      
      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Student Success</h3>
          <p className="text-4xl font-bold text-blue-600 mb-2">95%</p>
          <p className="text-gray-600">Program completion rate</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">College Acceptance</h3>
          <p className="text-4xl font-bold text-blue-600 mb-2">89%</p>
          <p className="text-gray-600">Students accepted to top universities</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Scholarship Awards</h3>
          <p className="text-4xl font-bold text-blue-600 mb-2">$2.5M+</p>
          <p className="text-gray-600">Total scholarships awarded</p>
        </div>
      </div>

      {/* Testimonials Carousel */}
      <div className="bg-[#0085c2] text-white rounded-lg p-8 my-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Testimonials</h2>
        <div className="relative h-[200px] overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentTestimonial}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              className="absolute w-full h-full"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mx-auto max-w-3xl">
                <p className="italic mb-4 text-lg">{testimonials[currentTestimonial].quote}</p>
                <div className="font-semibold">
                  - {testimonials[currentTestimonial].author}, {testimonials[currentTestimonial].school}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors cursor-pointer z-10"
            onClick={() => paginate(-1)}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors cursor-pointer z-10"
            onClick={() => paginate(1)}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentTestimonial ? 'bg-white w-4' : 'bg-white/50'
                }`}
                onClick={() => {
                  const direction = index - currentTestimonial;
                  setDirection(direction);
                  setCurrentTestimonial(index);
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Student Success Stories */}
      <div className="my-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Student Success Stories</h2>
        <div className="space-y-6 max-w-4xl mx-auto">
          {successStories.map((story, index) => (
            <motion.div 
              key={index}
              layout
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer relative"
              onClick={() => setExpandedStory(expandedStory === index ? null : index)}
              onMouseEnter={() => setHoveredStory(index)}
              onMouseLeave={() => setHoveredStory(null)}
            >
              <motion.div layout className="flex relative">
                <div className="w-1/3 relative h-[200px]">
                  <img 
                    src={story.image}
                    alt={story.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <motion.div className="w-2/3 p-6">
                  <motion.h3 layout="position" className="text-xl font-semibold text-gray-800 mb-2">
                    {story.title}
                  </motion.h3>
                  <AnimatePresence mode="wait">
                    {expandedStory === index ? (
                      <motion.div
                        key="full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {story.fullStory.split('\n\n').map((paragraph, i) => (
                          <p key={i} className="text-gray-600 mb-4">
                            {paragraph}
                          </p>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="preview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="text-gray-600">{story.preview}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="text-[#0085c2] font-semibold mt-4">{story.class}</div>
                </motion.div>
                
                {/* Overlay for hover effect */}
                <AnimatePresence>
                  {hoveredStory === index && expandedStory !== index && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center"
                    >
                      <span className="text-white text-2xl font-semibold">
                        Read {story.name}'s Story
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;