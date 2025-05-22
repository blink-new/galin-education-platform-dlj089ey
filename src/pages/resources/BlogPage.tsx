import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { BlogPost, BlogTag } from '../../types/blog';

interface BlogPost {
  id: string;
  title: string;
  preview: string;
  content: string;
  image_url: string;
  author: {
    id: string;
    name: string;
    role: string;
    avatar_url: string;
  };
  created_at: string;
  tags: {
    id: string;
    tag: {
      id: string;
      name: string;
    };
  }[];
}

interface BlogTag {
  id: string;
  name: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'How to Make the Most of Your College Waitlist Status',
    preview: 'Being placed on a college waitlist can be frustrating, but there are proactive steps you can take to improve your chances of admission.',
    content: 'Full blog content here...',
    image_url: 'https://images.pexels.com/photos/2982449/pexels-photo-2982449.jpeg',
    author: {
      id: '1',
      name: 'Sarah Chen',
      role: 'Director of College Counseling',
      avatar_url: 'https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg'
    },
    created_at: '2024-03-15T00:00:00.000Z',
    tags: [
      {
        id: '1',
        tag: {
          id: '1',
          name: 'Waitlist'
        }
      },
      {
        id: '2',
        tag: {
          id: '2',
          name: 'College Success'
        }
      }
    ]
  },
  {
    id: '2',
    title: 'SAT vs ACT: Which Test is Right for You?',
    preview: 'A comprehensive comparison of the SAT and ACT to help you decide which test better aligns with your strengths.',
    content: 'Full blog content here...',
    image_url: 'https://images.pexels.com/photos/4778621/pexels-photo-4778621.jpeg',
    author: {
      id: '2',
      name: 'Michael Thompson',
      role: 'Director of Test Prep',
      avatar_url: 'https://images.pexels.com/photos/5397723/pexels-photo-5397723.jpeg'
    },
    created_at: '2024-03-10T00:00:00.000Z',
    tags: [
      {
        id: '3',
        tag: {
          id: '3',
          name: 'SAT'
        }
      },
      {
        id: '4',
        tag: {
          id: '4',
          name: 'ACT'
        }
      }
    ]
  },
  {
    id: '3',
    title: 'Time Management Tips for College Success',
    preview: 'Essential strategies for managing your time effectively in college, from organizing your schedule to maintaining work-life balance.',
    content: 'Full blog content here...',
    image_url: 'https://images.pexels.com/photos/1410226/pexels-photo-1410226.jpeg',
    author: {
      id: '3',
      name: 'Emma Davis',
      role: 'Executive Function Coach',
      avatar_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'
    },
    created_at: '2024-03-05T00:00:00.000Z',
    tags: [
      {
        id: '5',
        tag: {
          id: '5',
          name: 'College Success'
        }
      },
      {
        id: '6',
        tag: {
          id: '6',
          name: 'EF'
        }
      }
    ]
  }
];

const allTags: BlogTag[] = [
  {
    id: '1',
    name: 'Waitlist'
  },
  {
    id: '2',
    name: 'College Success'
  },
  {
    id: '3',
    name: 'SAT'
  },
  {
    id: '4',
    name: 'ACT'
  },
  {
    id: '5',
    name: 'EF'
  }
];

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [allTags, setAllTags] = useState<BlogTag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
    fetchTags();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        author:blog_authors(*),
        tags:blog_posts_tags(tag:blog_tags(*))
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      return;
    }

    setPosts(data || []);
    setLoading(false);
  };

  const fetchTags = async () => {
    const { data, error } = await supabase
      .from('blog_tags')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching tags:', error);
      return;
    }

    setAllTags(data || []);
  };

  const filteredPosts = posts.filter(post => {
    const matchesTag = selectedTag 
      ? post.tags?.some(tagObj => tagObj.tag.id === selectedTag) 
      : true;
    
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        post.preview.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTag && matchesSearch;
  });

  if (loading) {
    return <div className="container mx-auto px-4 py-8 flex justify-center items-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Blog</h1>
        
        {/* Search and Filter Section */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search posts..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0085c2] focus:border-[#0085c2]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag.id}
                onClick={() => setSelectedTag(selectedTag === tag.id ? null : tag.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTag === tag.id
                    ? 'bg-[#0085c2] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No blog posts found matching your criteria.</p>
          </div>
        ) : (
          /* Blog Posts Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
              <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src={post.image_url} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags?.map(tagObj => (
                      <span 
                        key={tagObj.tag.id}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tagObj.tag.name}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    <Link to={`/blog/${post.id}`} className="hover:text-[#0085c2]">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.preview}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img 
                        src={post.author?.avatar_url || 'https://via.placeholder.com/50'}
                        alt={post.author?.name || 'Author'}
                        className="w-8 h-8 rounded-full mr-2 object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{post.author?.name}</p>
                        <p className="text-xs text-gray-500">{post.author?.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(post.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;