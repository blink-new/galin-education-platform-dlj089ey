export interface TeamMember {
  id: string;
  name: string;
  title: string;
  image_url: string;
  degrees: string[];
  bio: string;
  category: 'leadership' | 'counselor' | 'coach' | 'tutor';
  created_at: string;
  updated_at: string;
}