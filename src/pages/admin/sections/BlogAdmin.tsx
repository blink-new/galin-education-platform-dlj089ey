import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { BlogPost, BlogAuthor, BlogTag } from '../../../types/blog';
import { PlusCircle, Edit, Trash2, Save, X, UserPlus, Tag as TagIcon } from 'lucide-react';
import { useToast } from '../../../hooks/use-toast';

const BlogAdmin: React.FC = () => {
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
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
    fetchAuthors();
    fetchTags();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
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
      toast({
        title: "Error",
        description: "Failed to load blog posts. Please try again.",
        variant: "destructive"
      });
      setLoading(false);
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
      toast({
        title: "Error",
        description: "Failed to load authors. Please try again.",
        variant: "destructive"
      });
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
      toast({
        title: "Error",
        description: "Failed to load tags. Please try again.",
        variant: "destructive"
      });
      return;
    }

    setTags(data || []);
  };

  const handleCreateAuthor = async () => {
    if (!newAuthor.name?.trim()) {
      toast({
        title: "Validation Error",
        description: "Author name is required",
        variant: "destructive"
      });
      return;
    }

    if (!newAuthor.role?.trim()) {
      toast({
        title: "Validation Error",
        description: "Author role is required",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await supabase
        .from('blog_authors')
        .insert([newAuthor])
        .select();

      if (result.error) {
        throw result.error;
      }

      toast({
        title: "Author created",
        description: `Successfully created author: ${newAuthor.name}`,
      });

      // Update the authors state with the new author
      setAuthors([...authors, result.data[0]]);
      setShowAuthorModal(false);
      setNewAuthor({});
    } catch (error) {
      console.error('Error creating author:', error);
      toast({
        title: "Error",
        description: `Failed to create author: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleCreateTag = async () => {
    if (!newTag.trim()) {
      toast({
        title: "Validation Error",
        description: "Tag name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await supabase
        .from('blog_tags')
        .insert([{ name: newTag }])
        .select();

      if (result.error) {
        throw result.error;
      }

      toast({
        title: "Tag created",
        description: `Successfully created tag: ${newTag}`,
      });

      // Update the tags state with the new tag
      setTags([...tags, result.data[0]]);
      setShowTagModal(false);
      setNewTag('');
    } catch (error) {
      console.error('Error creating tag:', error);
      toast({
        title: "Error",
        description: `Failed to create tag: ${error.message}`,
        variant: "destructive"
      });
    }
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

    // Validate required fields
    if (!editingPost.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive"
      });
      return;
    }

    if (!editingPost.preview.trim()) {
      toast({
        title: "Validation Error",
        description: "Preview is required",
        variant: "destructive"
      });
      return;
    }

    if (!editingPost.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Content is required",
        variant: "destructive"
      });
      return;
    }

    if (!editingPost.image_url.trim()) {
      toast({
        title: "Validation Error",
        description: "Image URL is required",
        variant: "destructive"
      });
      return;
    }

    if (!editingPost.author_id) {
      toast({
        title: "Validation Error",
        description: "Author is required",
        variant: "destructive"
      });
      return;
    }

    try {
      const isNewPost = !editingPost.id;
      let result;
      
      if (isNewPost) {
        // For new posts, remove unnecessary properties
        const { id, author, tags, created_at, updated_at, ...postData } = editingPost as any;
        result = await supabase
          .from('blog_posts')
          .insert([{ 
            ...postData, 
            updated_at: new Date().toISOString() 
          }])
          .select()
          .single();
      } else {
        // For existing posts, update with current timestamp
        const { author, tags, ...postToUpdate } = editingPost as any;
        result = await supabase
          .from('blog_posts')
          .update({ 
            ...postToUpdate, 
            updated_at: new Date().toISOString() 
          })
          .eq('id', editingPost.id)
          .select()
          .single();
      }

      if (result.error) {
        throw result.error;
      }

      // Update tags
      if (isNewPost) {
        if (selectedTags.length > 0) {
          const tagInserts = selectedTags.map(tagId => ({
            post_id: result.data.id,
            tag_id: tagId
          }));
          
          const tagResult = await supabase
            .from('blog_posts_tags')
            .insert(tagInserts);
            
          if (tagResult.error) {
            throw tagResult.error;
          }
        }
      } else {
        // Delete existing tags and insert new ones
        await supabase
          .from('blog_posts_tags')
          .delete()
          .eq('post_id', result.data.id);

        if (selectedTags.length > 0) {
          const tagInserts = selectedTags.map(tagId => ({
            post_id: result.data.id,
            tag_id: tagId
          }));
          
          const tagResult = await supabase
            .from('blog_posts_tags')
            .insert(tagInserts);
            
          if (tagResult.error) {
            throw tagResult.error;
          }
        }
      }

      toast({
        title: isNewPost ? "Post created" : "Post updated",
        description: `Successfully ${isNewPost ? 'created' : 'updated'} post: ${editingPost.title}`,
      });

      // Refresh the posts to get the updated data with tags and author
      fetchPosts();
      setEditingPost(null);
      setSelectedTags([]);
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: "Error",
        description: `Failed to save post: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      // Delete post (this will cascade delete tags due to foreign key constraint)
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: "Post deleted",
        description: "Successfully deleted post",
      });

      // Update local state by filtering out the deleted post
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: `Failed to delete post: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading blog posts...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold">Manage Blog Posts</h2>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
                  Name *
                </label>
                <input
                  type="text"
                  value={newAuthor.name || ''}
                  onChange={(e) => setNewAuthor({ ...newAuthor, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <input
                  type="text"
                  value={newAuthor.role || ''}
                  onChange={(e) => setNewAuthor({ ...newAuthor, role: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Avatar URL *
                </label>
                <input
                  type="text"
                  value={newAuthor.avatar_url || ''}
                  onChange={(e) => setNewAuthor({ ...newAuthor, avatar_url: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="https://example.com/avatar.jpg"
                  required
                />
                {newAuthor.avatar_url && (
                  <div className="mt-2">
                    <img 
                      src={newAuthor.avatar_url} 
                      alt="Preview" 
                      className="w-16 h-16 object-cover rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/150?text=Invalid+URL';
                      }}
                    />
                  </div>
                )}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
                  Tag Name *
                </label>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  required
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
                  Title *
                </label>
                <input
                  type="text"
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preview *
                </label>
                <textarea
                  value={editingPost.preview}
                  onChange={(e) => setEditingPost({ ...editingPost, preview: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content *
                </label>
                <textarea
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md font-mono"
                  rows={15}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL *
                </label>
                <input
                  type="text"
                  value={editingPost.image_url}
                  onChange={(e) => setEditingPost({ ...editingPost, image_url: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="https://example.com/image.jpg"
                  required
                />
                {editingPost.image_url && (
                  <div className="mt-2">
                    <img 
                      src={editingPost.image_url} 
                      alt="Preview" 
                      className="h-32 object-cover rounded-md"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/640x360?text=Invalid+URL';
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author *
                </label>
                <select
                  value={editingPost.author_id}
                  onChange={(e) => setEditingPost({ ...editingPost, author_id: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
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

      {posts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">No blog posts found. Create your first post!</p>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default BlogAdmin;