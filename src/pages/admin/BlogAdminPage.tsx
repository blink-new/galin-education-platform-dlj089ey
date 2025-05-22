import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { BlogPost, BlogAuthor, BlogTag } from '../../types/blog';
import { PlusCircle, Edit, Trash2, Save, X, UserPlus, Tag as TagIcon } from 'lucide-react';

const BlogAdminPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [authors, setAuthors] = useState<BlogAuthor[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAuthorModal, setShowAuthorModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [newAuthor, setNewAuthor] = useState<Partial<BlogAuthor>>({});
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    fetchPosts();
    fetchAuthors();
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

  const fetchAuthors = async () => {
    const { data, error } = await supabase
      .from('blog_authors')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching authors:', error);
      return;
    }

    setAuthors(data || []);
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

    setTags(data || []);
  };

  const handleCreateAuthor = async () => {
    const { data, error } = await supabase
      .from('blog_authors')
      .insert([newAuthor])
      .select();

    if (error) {
      console.error('Error creating author:', error);
      return;
    }

    fetchAuthors();
    setShowAuthorModal(false);
    setNewAuthor({});
  };

  const handleCreateTag = async () => {
    const { data, error } = await supabase
      .from('blog_tags')
      .insert([{ name: newTag }])
      .select();

    if (error) {
      console.error('Error creating tag:', error);
      return;
    }

    fetchTags();
    setShowTagModal(false);
    setNewTag('');
  };

  const handleCreatePost = () => {
    setEditingPost({
      id: '',
      title: '',
      content: '',
      preview: '',
      image_url: '',
      author_id: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    setSelectedTags([]);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setSelectedTags(post.tags?.map(t => t.tag.id) || []);
  };

  const handleSavePost = async () => {
    if (!editingPost) return;

    const isNewPost = !editingPost.id;
    const { data, error } = isNewPost
      ? await supabase
          .from('blog_posts')
          .insert([editingPost])
          .select()
          .single()
      : await supabase
          .from('blog_posts')
          .update(editingPost)
          .eq('id', editingPost.id)
          .select()
          .single();

    if (error) {
      console.error('Error saving post:', error);
      return;
    }

    if (data) {
      // Update tags
      if (isNewPost) {
        await supabase
          .from('blog_posts_tags')
          .insert(selectedTags.map(tagId => ({
            post_id: data.id,
            tag_id: tagId
          })));
      } else {
        // Delete existing tags and insert new ones
        await supabase
          .from('blog_posts_tags')
          .delete()
          .eq('post_id', data.id);

        await supabase
          .from('blog_posts_tags')
          .insert(selectedTags.map(tagId => ({
            post_id: data.id,
            tag_id: tagId
          })));
      }

      fetchPosts();
      setEditingPost(null);
      setSelectedTags([]);
    }
  };

  const handleDeletePost = async (id: string) => {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting post:', error);
      return;
    }

    fetchPosts();
  };

  const renderFormattingHelp = () => (
    <div className="bg-gray-50 p-4 rounded-md mb-4">
      <h3 className="font-medium mb-2">Formatting Guide:</h3>
      <ul className="text-sm space-y-1">
        <li><code className="bg-gray-200 px-1 rounded"># Heading 1</code></li>
        <li><code className="bg-gray-200 px-1 rounded">## Heading 2</code></li>
        <li><code className="bg-gray-200 px-1 rounded">### Heading 3</code></li>
        <li><code className="bg-gray-200 px-1 rounded">**bold text**</code></li>
        <li><code className="bg-gray-200 px-1 rounded">*italic text*</code></li>
        <li><code className="bg-gray-200 px-1 rounded">[link text](url)</code></li>
        <li><code className="bg-gray-200 px-1 rounded">- List item</code></li>
        <li><code className="bg-gray-200 px-1 rounded">1. Numbered list</code></li>
      </ul>
    </div>
  );

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Management</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowAuthorModal(true)}
            className="flex items-center px-4 py-2 bg-[#0085c2] text-white rounded-md hover:bg-[#FFB546]"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            New Author
          </button>
          <button
            onClick={() => setShowTagModal(true)}
            className="flex items-center px-4 py-2 bg-[#0085c2] text-white rounded-md hover:bg-[#FFB546]"
          >
            <TagIcon className="w-5 h-5 mr-2" />
            New Tag
          </button>
          <button
            onClick={handleCreatePost}
            className="flex items-center px-4 py-2 bg-[#0085c2] text-white rounded-md hover:bg-[#FFB546]"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            New Post
          </button>
        </div>
      </div>

      {/* Author Modal */}
      {showAuthorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">New Author</h2>
              <button
                onClick={() => setShowAuthorModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newAuthor.name || ''}
                  onChange={(e) => setNewAuthor({ ...newAuthor, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  value={newAuthor.role || ''}
                  onChange={(e) => setNewAuthor({ ...newAuthor, role: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Avatar URL
                </label>
                <input
                  type="text"
                  value={newAuthor.avatar_url || ''}
                  onChange={(e) => setNewAuthor({ ...newAuthor, avatar_url: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <button
                onClick={handleCreateAuthor}
                className="w-full px-4 py-2 bg-[#0085c2] text-white rounded-md hover:bg-[#FFB546]"
              >
                Create Author
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tag Modal */}
      {showTagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">New Tag</h2>
              <button
                onClick={() => setShowTagModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tag Name
                </label>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <button
                onClick={handleCreateTag}
                className="w-full px-4 py-2 bg-[#0085c2] text-white rounded-md hover:bg-[#FFB546]"
              >
                Create Tag
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Editor Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingPost.id ? 'Edit Post' : 'New Post'}
              </h2>
              <button
                onClick={() => setEditingPost(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preview
                </label>
                <textarea
                  value={editingPost.preview}
                  onChange={(e) => setEditingPost({ ...editingPost, preview: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                {renderFormattingHelp()}
                <div className="relative">
                  <textarea
                    value={editingPost.content}
                    onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md font-mono"
                    rows={15}
                    placeholder="Use Markdown formatting for rich text..."
                  />
                  <div className="absolute bottom-2 right-2 text-sm text-gray-500">
                    {editingPost.content.length} characters
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={editingPost.image_url}
                  onChange={(e) => setEditingPost({ ...editingPost, image_url: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author
                </label>
                <select
                  value={editingPost.author_id}
                  onChange={(e) => setEditingPost({ ...editingPost, author_id: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Select an author</option>
                  {authors.map((author) => (
                    <option key={author.id} value={author.id}>
                      {author.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <label key={tag.id} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTags([...selectedTags, tag.id]);
                          } else {
                            setSelectedTags(selectedTags.filter(id => id !== tag.id));
                          }
                        }}
                        className="mr-2"
                      />
                      {tag.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleSavePost}
                  className="flex items-center px-4 py-2 bg-[#0085c2] text-white rounded-md hover:bg-[#FFB546]"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-4">{post.preview}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-4">By: {post.author?.name}</span>
                  <span>
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditPost(post)}
                  className="p-2 text-blue-600 hover:text-blue-800"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogAdminPage;