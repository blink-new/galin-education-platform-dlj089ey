import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, BookOpen, ClipboardList, PencilRuler, School, Calendar } from "lucide-react";

const services = [
  {
    title: "College Counseling",
    description: "Expert guidance for the college admissions process, from applications to decisions.",
    link: "/services/college-counseling",
    icon: <GraduationCap className="w-24 h-24 mb-4 text-white" />,
  },
  {
    title: "Graduate Admissions",
    description: "Comprehensive support for graduate school applications and admissions.",
    link: "/services/graduate-admissions",
    icon: <School className="w-24 h-24 mb-4 text-white" />,
  },
  {
    title: "Test Prep",
    description: "Customized strategies to excel in SAT, ACT, and other standardized tests.",
    link: "/services/test-prep",
    icon: <BookOpen className="w-24 h-24 mb-4 text-white" />,
  },
  {
    title: "Executive Functioning Coaching",
    description: "Build organization, time management, and goal-setting skills.",
    link: "/services/executive-functioning",
    icon: <ClipboardList className="w-24 h-24 mb-4 text-white" />,
  },
  {
    title: "Tutoring",
    description: "Personalized support across subjects to boost academic success.",
    link: "/services/tutoring",
    icon: <PencilRuler className="w-24 h-24 mb-4 text-white" />,
  },
  {
    title: "Events",
    description: "Join our educational workshops, seminars, and college preparation events.",
    link: "/resources/events",
    icon: <Calendar className="w-24 h-24 mb-4 text-white" />,
  }
];

const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="py-16 md:py-24 bg-gray-100">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-16">
        <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-8">
          {services.map((service) => (
            <Link
              key={service.title}
              to={service.link}
              className="group block h-72 [perspective:1000px]"
            >
              <div className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                <div className="absolute w-full h-full [background-color:#0085c2] text-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center text-center text-3xl font-semibold [backface-visibility:hidden]">
                  {service.icon}
                  <span>{service.title}</span>
                </div>
                <div className="absolute w-full h-full [background-color:#FFB546] text-white rounded-2xl shadow-lg p-6 [transform:rotateY(180deg)] [backface-visibility:hidden] flex items-center justify-center text-center text-base font-bold">
                  {service.description}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;