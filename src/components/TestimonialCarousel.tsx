import React, { useState, useEffect, useRef } from 'react';
import Testimonial from './Testimonial';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TestimonialCarousel: React.FC = () => {
  const testimonials = [
    {
      quote: "The college counseling services made a huge difference in my application process. I was accepted to my top-choice school!",
      author: "Sarah Johnson",
      role: "High School Senior",
      stars: 5,
      image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      quote: "The test prep program improved my SAT score by over 200 points. The strategies they taught were invaluable.",
      author: "Michael Chen",
      role: "College Freshman",
      stars: 5,
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      quote: "Executive functioning coaching helped my son develop organization skills that have transformed his academic performance.",
      author: "Jennifer Davis",
      role: "Parent",
      stars: 5,
      image: "https://images.pexels.com/photos/773371/pexels-photo-773371.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      quote: "The tutoring services helped me raise my grade from a C to an A in AP Calculus. My tutor explained concepts in ways that finally made sense to me.",
      author: "Ethan Rodriguez",
      role: "High School Junior",
      stars: 4,
      image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      quote: "My daughter's confidence has soared since working with her EduExcel tutor. The personalized attention has made all the difference.",
      author: "Amy Wilson",
      role: "Parent",
      stars: 5,
      image: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPaused]);

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-gradient-to-br from-secondary-50 to-primary-50">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-16">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            What Galin Students and Parents Say
          </h2>
          <Link 
            to="/about/story/results" 
            className="inline-flex items-center justify-center px-6 py-3 bg-[#0085c2] text-white font-medium rounded-md hover:bg-[#FFB546] transition-colors duration-200"
          >
            See Results
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
        
        <div 
          className="relative max-w-5xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="min-w-full px-4">
                  <div className="max-w-2xl mx-auto">
                    <Testimonial {...testimonial} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            className="absolute top-1/2 left-0 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md z-10"
            onClick={prevSlide}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </button>
          
          <button 
            className="absolute top-1/2 right-0 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md z-10"
            onClick={nextSlide}
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6 text-gray-700" />
          </button>
          
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-primary-600 w-6' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;