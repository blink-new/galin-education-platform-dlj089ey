interface TeamMember {
  id: string;
  name: string;
  title: string;
  image: string;
  degrees: string[];
  bio: string;
  category: 'leadership' | 'counselor' | 'coach' | 'tutor';
}

export const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'FirstName LastName',
    title: 'Founder & President',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    degrees: ['Ph.D. Educational Psychology', 'M.Ed. Counseling'],
    bio: 'Bio goes here.',
    category: 'leadership'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    title: 'Director of College Counseling',
    image: 'https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg',
    degrees: ['M.A. Higher Education', 'B.A. Psychology'],
    bio: 'Sarah has helped hundreds of students navigate the college admissions process, with a focus on helping students find their perfect college match.',
    category: 'leadership'
  },
  {
    id: '3',
    name: 'Michael Thompson',
    title: 'Director of Test Prep',
    image: 'https://images.pexels.com/photos/5397723/pexels-photo-5397723.jpeg',
    degrees: ['M.S. Mathematics Education', 'B.S. Mathematics', 'SAT/ACT Master Trainer Certification'],
    bio: 'Michael leads our test prep program with expertise in SAT and ACT preparation. His innovative teaching methods have helped students achieve significant score improvements.',
    category: 'tutor'
  }
  // Add more team members as needed
];