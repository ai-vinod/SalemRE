import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiX, FiImage, FiTag, FiCalendar, FiPlus, FiTrash2 } from 'react-icons/fi';

const EditBlogPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [tagInput, setTagInput] = useState('');
  
  // Blog post state
  const [blogPost, setBlogPost] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
    featured: false,
    status: 'draft',
    image: null,
    imagePreview: null
  });

  // Available categories
  const [categories, setCategories] = useState([
    'Real Estate News',
    'Market Trends',
    'Home Buying Tips',
    'Selling Advice',
    'Investment Strategies',
    'Property Management',
    'Interior Design',
    'Neighborhood Guides'
  ]);

  // Fetch blog post data
  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        // Simulate API call to fetch blog post
        // In a real application, you would fetch data from your backend
        console.log('Fetching blog post with ID:', id);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Dummy data for demonstration
        const dummyPost = {
          id: id,
          title: 'How to Stage Your Home for a Quick Sale',
          slug: 'how-to-stage-your-home-for-quick-sale',
          excerpt: 'Learn the best techniques to stage your home and attract potential buyers.',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.',
          category: 'Selling Advice',
          tags: ['Home Staging', 'Selling Tips', 'Interior Design'],
          featured: true,
          status: 'published',
          image: null,
          imageUrl: 'https://via.placeholder.com/800x600'
        };
        
        setBlogPost({
          ...dummyPost,
          imagePreview: dummyPost.imageUrl
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Failed to load blog post. Please try again.');
        setLoading(false);
      }
    };
    
    fetchBlogPost();
  }, [id]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBlogPost(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Auto-generate slug from title if slug is empty or matches the original title-based slug
    if (name === 'title') {
      const newSlug = value
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      
      // Only update slug if it was auto-generated before (or empty)
      const currentTitleSlug = blogPost.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      
      if (blogPost.slug === currentTitleSlug || blogPost.slug === '') {
        setBlogPost(prev => ({ ...prev, slug: newSlug }));
      }
    }
  };
  
  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBlogPost(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };
  
  // Handle tag input
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };
  
  // Add tag to blog post
  const addTag = () => {
    if (tagInput.trim() !== '' && !blogPost.tags.includes(tagInput.trim())) {
      setBlogPost(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };
  
  // Remove tag from blog post
  const removeTag = (tagToRemove) => {
    setBlogPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    // Validate form
    if (!blogPost.title || !blogPost.content || !blogPost.category) {
      setError('Please fill in all required fields');
      setSaving(false);
      return;
    }
    
    try {
      // Simulate API call to update blog post
      // In a real application, you would send the data to your backend
      console.log('Updating blog post:', blogPost);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/blog-posts');
      }, 1500);
    } catch (err) {
      console.error('Error updating blog post:', err);
      setError('Failed to update blog post. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    navigate('/admin/blog-posts');
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2 text-gray-700">Loading blog post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Edit Blog Post</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md flex items-center"
            disabled={saving}
          >
            <FiX className="mr-2" /> Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center"
            disabled={saving}
          >
            <FiSave className="mr-2" /> {saving ? 'Saving...' : 'Update Post'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          Blog post updated successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={blogPost.title}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug
              </label>
              <input
                type="text"
                name="slug"
                value={blogPost.slug}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={blogPost.category}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Excerpt
              </label>
              <textarea
                name="excerpt"
                value={blogPost.excerpt}
                onChange={handleChange}
                rows="2"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief summary of the post"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Content</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              value={blogPost.content}
              onChange={handleChange}
              rows="10"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            ></textarea>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Tags</h2>
          <div className="flex items-center mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={handleTagInputChange}
              className="flex-grow p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add a tag"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-blue-600 text-white rounded-r-md"
            >
              <FiPlus />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {blogPost.tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
              >
                <span className="mr-1">{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Image */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Featured Image</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Image
            </label>
            <div className="flex items-center">
              <label className="cursor-pointer flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                <FiImage className="mr-2" />
                Choose File
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
              <span className="ml-3 text-sm text-gray-500">
                {blogPost.image ? blogPost.image.name : 'No new file chosen'}
              </span>
            </div>
          </div>
          {blogPost.imagePreview && (
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-1">Current Image:</p>
              <img
                src={blogPost.imagePreview}
                alt="Preview"
                className="max-w-xs h-auto rounded-md"
              />
            </div>
          )}
        </div>

        {/* Publishing Options */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Publishing Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={blogPost.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={blogPost.featured}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                Featured Post
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md flex items-center"
            disabled={saving}
          >
            <FiX className="mr-2" /> Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center"
            disabled={saving}
          >
            <FiSave className="mr-2" /> {saving ? 'Saving...' : 'Update Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlogPost;