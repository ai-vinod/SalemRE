import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiSave, FiEye, FiX, FiImage, FiLink, FiList, FiAlignLeft, FiAlignCenter, FiAlignRight, FiArrowLeft, FiAlertCircle } from 'react-icons/fi'
import { useLoading, useError, useApi } from '../../contexts'
import blogService from '../../services/blogService'
import uploadService from '../../services/uploadService'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const BlogEditor = ({ isEditMode = false, postId }) => {
  const navigate = useNavigate()
  const idFromParams = useParams().id
  const id = postId || idFromParams
  
  const [post, setPost] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    image: '',
    featured: false,
    status: 'draft'
  })
  
  const { isLoading, setLoading, clearLoading } = useLoading()
  const { setError, clearError, getError } = useError()
  const { request } = useApi()
  
  const [previewMode, setPreviewMode] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [imageUploadProgress, setImageUploadProgress] = useState(0)
  const [showImageUploadModal, setShowImageUploadModal] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  
  const categories = [
    'Real Estate Tips',
    'Market Trends',
    'Investment Advice',
    'Home Improvement',
    'Buying Guide',
    'Selling Tips'
  ]

  useEffect(() => {
    if (isEditMode) {
      const fetchPost = async () => {
        clearError('blog-editor')
        setLoading('blog-editor')
        
        try {
          const blogPost = await request(
            () => blogService.getBlogPost(id),
            'blog-editor'
          )
          
          if (blogPost) {
            setPost(blogPost)
          }
        } catch (error) {
          console.error('Error fetching blog post:', error)
          setError('blog-editor', 'Failed to load blog post. Please try again.')
        } finally {
          clearLoading('blog-editor')
        }
      }

      fetchPost()
    }
  }, [id, isEditMode, request, setLoading, clearLoading, setError, clearError])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setPost({
      ...post,
      [name]: type === 'checkbox' ? checked : value
    })
    
    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-')
      
      setPost(prev => ({ ...prev, slug }))
    }
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const handleContentChange = (e) => {
    setPost({ ...post, content: e.target.value })
    
    if (formErrors.content) {
      setFormErrors(prev => ({ ...prev, content: null }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!post.title.trim()) newErrors.title = 'Title is required'
    if (!post.slug.trim()) newErrors.slug = 'Slug is required'
    if (!post.excerpt.trim()) newErrors.excerpt = 'Excerpt is required'
    if (!post.content.trim()) newErrors.content = 'Content is required'
    if (!post.category) newErrors.category = 'Category is required'
    if (!isEditMode && !imageFile && !post.featuredImage) newErrors.image = 'Featured image is required'
    
    setFormErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async (publishStatus) => {
    if (!validateForm()) return
    
    clearError('blog-editor-save')
    setLoading('blog-editor-save')
    
    try {
      const postData = {
        ...post,
        status: publishStatus || post.status
      }
      
      // Handle image upload if there's a new image
      if (imageFile) {
        const formData = new FormData()
        formData.append('image', imageFile)
        
        const uploadResult = await request(
          () => uploadService.uploadBlogImage(formData),
          'blog-image-upload'
        )
        
        if (uploadResult && uploadResult.imageUrl) {
          postData.image = uploadResult.imageUrl
        }
      }
      
      // Save the blog post
      if (isEditMode) {
        await request(
          () => blogService.updateBlogPost(id, postData),
          'blog-editor-save'
        )
      } else {
        await request(
          () => blogService.createBlogPost(postData),
          'blog-editor-save'
        )
      }
      
      // Navigate back to blog posts list
      navigate('/admin/blog-posts')
    } catch (error) {
      console.error('Error saving blog post:', error)
      setError('blog-editor-save', 'Failed to save blog post. Please try again.')
    } finally {
      clearLoading('blog-editor-save')
    }
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }
    
    setImageFile(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
      
      // Clear any image-related errors
      if (formErrors.image) {
        setFormErrors({
          ...formErrors,
          image: null
        })
      }
    }
    reader.readAsDataURL(file)
  }

  const handleImageUpload = async () => {
    if (!imageFile) return
    
    clearError('blog-image-upload')
    
    try {
      const formData = new FormData()
      formData.append('image', imageFile)
      
      // Track upload progress
      const onUploadProgress = (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        setImageUploadProgress(percentCompleted)
      }
      
      const uploadResult = await request(
        () => uploadService.uploadBlogImage(formData, onUploadProgress),
        'blog-image-upload'
      )
      
      if (uploadResult && uploadResult.imageUrl) {
        setPost({ ...post, image: uploadResult.imageUrl })
        setShowImageUploadModal(false)
        setImageFile(null)
        setImagePreview('')
        setImageUploadProgress(0)
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      setError('blog-image-upload', 'Failed to upload image. Please try again.')
      setImageUploadProgress(0)
    }
  }

  const handleFormatText = (format) => {
    // In a real app, you would implement rich text editing
    // This is a simplified example
    const textarea = document.getElementById('content')
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = post.content.substring(start, end)
    let formattedText = ''
    
    switch (format) {
      case 'bold':
        formattedText = `<strong>${selectedText}</strong>`
        break
      case 'italic':
        formattedText = `<em>${selectedText}</em>`
        break
      case 'h2':
        formattedText = `<h2>${selectedText}</h2>`
        break
      case 'h3':
        formattedText = `<h3>${selectedText}</h3>`
        break
      case 'ul':
        formattedText = `<ul>\n  <li>${selectedText}</li>\n</ul>`
        break
      case 'ol':
        formattedText = `<ol>\n  <li>${selectedText}</li>\n</ol>`
        break
      case 'link':
        const url = prompt('Enter URL:', 'https://')
        if (url) formattedText = `<a href="${url}">${selectedText || url}</a>`
        break
      case 'alignLeft':
        formattedText = `<div style="text-align: left">${selectedText}</div>`
        break
      case 'alignCenter':
        formattedText = `<div style="text-align: center">${selectedText}</div>`
        break
      case 'alignRight':
        formattedText = `<div style="text-align: right">${selectedText}</div>`
        break
      default:
        formattedText = selectedText
    }
    
    if (formattedText && formattedText !== selectedText) {
      const newContent = post.content.substring(0, start) + formattedText + post.content.substring(end)
      setPost({ ...post, content: newContent })
    }
  }

  if (isLoading('blog-editor')) {
    return (
      <div className="p-6 flex justify-center items-center">
        <LoadingSpinner size="lg" />
        <span className="ml-2 text-gray-600">Loading blog post...</span>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/admin/blog-posts')}
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h1>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {previewMode ? <FiX className="mr-2" /> : <FiEye className="mr-2" />}
            {previewMode ? 'Exit Preview' : 'Preview'}
          </button>
          
          <button
            onClick={() => handleSave('draft')}
            disabled={isLoading('blog-editor-save')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading('blog-editor-save') ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Saving...
              </>
            ) : (
              <>
                <FiSave className="mr-2" />
                Save as Draft
              </>
            )}
          </button>
          
          <button
            onClick={() => handleSave('published')}
            disabled={isLoading('blog-editor-save')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading('blog-editor-save') ? (
              <>
                <LoadingSpinner size="sm" className="text-white mr-2" />
                Publishing...
              </>
            ) : (
              <>
                <FiSave className="mr-2" />
                Publish
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error message */}
      {getError('blog-editor-save') && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start">
          <FiAlertCircle className="mr-2 mt-0.5 flex-shrink-0" />
          <span>{getError('blog-editor-save')}</span>
        </div>
      )}

      {previewMode ? (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
            
            {post.image && (
              <div className="mb-6">
                <img src={post.image} alt={post.title} className="w-full h-64 object-cover rounded-lg" />
              </div>
            )}
            
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 mr-2">
                {post.category}
              </span>
              <span>Published {new Date().toLocaleDateString()}</span>
              {post.featured && (
                <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                  Featured
                </span>
              )}
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 mb-6">{post.excerpt}</p>
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={post.title}
                onChange={handleInputChange}
                className={`block w-full rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${formErrors.title ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Enter post title"
              />
              {formErrors.title && <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>}
            </div>
            
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                  /blog/
                </span>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={post.slug}
                  onChange={handleInputChange}
                  className={`flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${formErrors.slug ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="enter-post-slug"
                />
              </div>
              {formErrors.slug && <p className="mt-1 text-sm text-red-600">{formErrors.slug}</p>}
            </div>
            
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows="3"
                value={post.excerpt}
                onChange={handleInputChange}
                className={`block w-full rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${formErrors.excerpt ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Brief summary of the post (appears in previews)"
              />
              {formErrors.excerpt && <p className="mt-1 text-sm text-red-600">{formErrors.excerpt}</p>}
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-md">
                  <button
                    type="button"
                    onClick={() => handleFormatText('bold')}
                    className="p-1 rounded hover:bg-gray-200"
                    title="Bold"
                  >
                    <span className="font-bold">B</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatText('italic')}
                    className="p-1 rounded hover:bg-gray-200"
                    title="Italic"
                  >
                    <span className="italic">I</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatText('h2')}
                    className="p-1 rounded hover:bg-gray-200"
                    title="Heading 2"
                  >
                    <span className="font-bold">H2</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatText('h3')}
                    className="p-1 rounded hover:bg-gray-200"
                    title="Heading 3"
                  >
                    <span className="font-bold">H3</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatText('ul')}
                    className="p-1 rounded hover:bg-gray-200"
                    title="Bullet List"
                  >
                    <FiList />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatText('ol')}
                    className="p-1 rounded hover:bg-gray-200"
                    title="Numbered List"
                  >
                    <span className="font-bold">1.</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatText('link')}
                    className="p-1 rounded hover:bg-gray-200"
                    title="Insert Link"
                  >
                    <FiLink />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatText('alignLeft')}
                    className="p-1 rounded hover:bg-gray-200"
                    title="Align Left"
                  >
                    <FiAlignLeft />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatText('alignCenter')}
                    className="p-1 rounded hover:bg-gray-200"
                    title="Align Center"
                  >
                    <FiAlignCenter />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatText('alignRight')}
                    className="p-1 rounded hover:bg-gray-200"
                    title="Align Right"
                  >
                    <FiAlignRight />
                  </button>
                </div>
              </div>
              <textarea
                id="content"
                name="content"
                rows="15"
                value={post.content}
                onChange={handleContentChange}
                className={`block w-full rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm font-mono ${formErrors.content ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Write your post content here..."
              />
              {formErrors.content && <p className="mt-1 text-sm text-red-600">{formErrors.content}</p>}
              <p className="mt-1 text-xs text-gray-500">HTML formatting is supported. Use the toolbar above to format your content.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  id="category"
                  name="category"
                  value={post.category}
                  onChange={handleInputChange}
                  className={`block w-full rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${formErrors.category ? 'border-red-300' : 'border-gray-300'}`}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {formErrors.category && <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Featured Post</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={post.featured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                    Mark as featured post (appears in homepage)
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
              {post.image ? (
                <div className="relative">
                  <img src={post.image} alt="Featured" className="h-48 w-full object-cover rounded-md" />
                  <button
                    type="button"
                    onClick={() => setShowImageUploadModal(true)}
                    className="absolute bottom-2 right-2 inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Change Image
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => setShowImageUploadModal(true)}
                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer hover:border-gray-400 ${formErrors.image ? 'border-red-300' : 'border-gray-300'}`}
                >
                  <div className="space-y-1 text-center">
                    <FiImage className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                        <span>Upload an image</span>
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                </div>
              )}
              {formErrors.image && <p className="mt-1 text-sm text-red-600">{formErrors.image}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Image Upload Modal */}
      {showImageUploadModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Upload Featured Image
                    </h3>
                    <div className="mt-2">
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="mx-auto h-64 object-contain" />
                          ) : (
                            <>
                              <FiImage className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="flex text-sm text-gray-600">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                                  <span>Upload a file</span>
                                  <input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    className="sr-only"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {imageUploadProgress > 0 && imageUploadProgress < 100 && (
                        <div className="mt-4">
                          <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                              <div>
                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary-600 bg-primary-200">
                                  Uploading
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-primary-600">
                                  {imageUploadProgress}%
                                </span>
                              </div>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-200">
                              <div
                                style={{ width: `${imageUploadProgress}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Error message */}
                      {getError('blog-image-upload') && (
                        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start">
                          <FiAlertCircle className="mr-2 mt-0.5 flex-shrink-0" />
                          <span>{getError('blog-image-upload')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={!imageFile || imageUploadProgress > 0}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowImageUploadModal(false)
                    setImageFile(null)
                    setImagePreview('')
                    setImageUploadProgress(0)
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BlogEditor