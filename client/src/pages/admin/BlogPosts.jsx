import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiEdit, FiTrash2, FiSearch, FiFilter, FiChevronLeft, FiChevronRight, FiPlus, FiEye, FiAlertCircle } from 'react-icons/fi'
import { useLoading } from '../../contexts/LoadingContext'
import { useError } from '../../contexts/ErrorContext'
import { useApi } from '../../hooks/useApi'
import blogService from '../../services/blogService'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const BlogPosts = () => {
  const { isLoading, setLoading, clearLoading } = useLoading()
  const { setError, clearError, getError } = useError()
  const { request } = useApi()
  
  const [posts, setPosts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [selectedPosts, setSelectedPosts] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false)
  const [postToDelete, setPostToDelete] = useState(null)
  const [categories, setCategories] = useState([])

  const postsPerPage = 10

  // Fetch categories for filter dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      clearError('blog-categories')
      setLoading('blog-categories', true)
      
      try {
        const data = await request(
          () => blogService.getCategories(),
          'blog-categories'
        )
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        clearLoading('blog-categories')
      }
    }
    
    fetchCategories()
  }, [])
  
  // Fetch blog posts with pagination, search, and filters
  useEffect(() => {
    const fetchPosts = async () => {
      clearError('admin-blog-posts')
      setLoading('admin-blog-posts', true)
      
      try {
        const params = {
          page: currentPage,
          limit: postsPerPage,
          search: searchTerm,
          category: filterCategory,
          // Include draft posts for admin view
          status: 'all'
        }
        
        const data = await request(
          () => blogService.getBlogPosts(params),
          'admin-blog-posts'
        )
        
        setPosts(data.posts)
        setTotalPages(data.totalPages)
        setTotalCount(data.totalCount)
      } catch (error) {
        console.error('Error fetching blog posts:', error)
        setError('admin-blog-posts', 'Failed to load blog posts. Please try again.')
      } finally {
        clearLoading('admin-blog-posts')
      }
    }
    
    fetchPosts()
  }, [currentPage, searchTerm, filterCategory, request, setLoading, clearLoading, setError, clearError])
  
  // Handle deleting a blog post
  const handleDeletePost = async (id) => {
    clearError('delete-blog-post')
    setLoading('delete-blog-post', true)
    
    try {
      await request(
        () => blogService.deleteBlogPost(id),
        'delete-blog-post'
      )
      
      // Remove the deleted post from state
      setPosts(posts.filter(post => post.id !== id))
      setSelectedPosts(selectedPosts.filter(postId => postId !== id))
      
      // Close the modal
      setShowDeleteModal(false)
      setPostToDelete(null)
    } catch (error) {
      console.error('Error deleting blog post:', error)
      setError('delete-blog-post', 'Failed to delete blog post. Please try again.')
    } finally {
      clearLoading('delete-blog-post')
    }
  }
  
  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedPosts.length === 0) return
    
    clearError('bulk-delete-blog-posts')
    setLoading('bulk-delete-blog-posts', true)
    
    try {
      // Delete all selected posts
      await Promise.all(
        selectedPosts.map(id => 
          request(
            () => blogService.deleteBlogPost(id),
            `delete-blog-post-${id}`
          )
        )
      )
      
      // Remove deleted posts from state
      setPosts(posts.filter(post => !selectedPosts.includes(post._id)))
      setSelectedPosts([])
      setShowBulkDeleteModal(false)
    } catch (error) {
      console.error('Error bulk deleting blog posts:', error)
      setError('bulk-delete-blog-posts', 'Failed to delete some blog posts. Please try again.')
    } finally {
      clearLoading('bulk-delete-blog-posts')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page on new search
    // Search is already handled by the useEffect dependency
  }

  // Bulk actions
  const handleSelectAll = () => {
    if (selectedPosts.length === posts.length) {
      setSelectedPosts([])
    } else {
      setSelectedPosts(posts.map(post => post._id))
    }
  }

  const handleSelectPost = (postId) => {
    if (selectedPosts.includes(postId)) {
      setSelectedPosts(selectedPosts.filter(id => id !== postId))
    } else {
      setSelectedPosts([...selectedPosts, postId])
    }
  }

  const handleBulkAction = (action) => {
    // In a real app, you would call your API to perform the bulk action
    // axios.post('/api/admin/blog-posts/bulk', { ids: selectedPosts, action })
    
    // For now, just update the state
    if (action === 'publish') {
      setPosts(posts.map(post => 
        selectedPosts.includes(post._id) ? { ...post, status: 'published' } : post
      ))
    } else if (action === 'draft') {
      setPosts(posts.map(post => 
        selectedPosts.includes(post._id) ? { ...post, status: 'draft' } : post
      ))
    } else if (action === 'feature') {
      setPosts(posts.map(post => 
        selectedPosts.includes(post._id) ? { ...post, featured: true } : post
      ))
    } else if (action === 'unfeature') {
      setPosts(posts.map(post => 
        selectedPosts.includes(post._id) ? { ...post, featured: false } : post
      ))
    } else if (action === 'delete') {
      setShowBulkDeleteModal(true)
    }
    
    if (action !== 'delete') {
      setSelectedPosts([])
    }
  }

  const handleDeleteClick = (post) => {
    setPostToDelete(post)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = () => {
    // In a real app, you would call your API to delete the post
    // axios.delete(`/api/admin/blog-posts/${postToDelete.id}`)
    
    // For now, just remove it from the state
    setPosts(posts.filter(post => post.id !== postToDelete.id))
    setShowDeleteModal(false)
    setPostToDelete(null)
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setPostToDelete(null)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text
    return text.substr(0, maxLength) + '...'
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
        <Link
          to="/admin/blog-posts/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <FiPlus className="mr-2" /> New Post
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <label htmlFor="filterCategory" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              id="filterCategory"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">All Categories</option>
              <option value="Real Estate Tips">Real Estate Tips</option>
              <option value="Market Trends">Market Trends</option>
              <option value="Investment Advice">Investment Advice</option>
              <option value="Home Improvement">Home Improvement</option>
              <option value="Buying Guide">Buying Guide</option>
              <option value="Selling Tips">Selling Tips</option>
            </select>
          </div>
          
          <form onSubmit={handleSearch} className="flex w-full md:w-auto">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <button
              type="submit"
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <FiFilter className="mr-2" /> Filter
            </button>
          </form>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedPosts.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <span className="font-medium">{selectedPosts.length} posts</span> selected.
                <button
                  onClick={() => handleBulkAction('publish')}
                  className="ml-2 font-medium text-yellow-700 underline hover:text-yellow-600"
                >
                  Publish
                </button>
                <button
                  onClick={() => handleBulkAction('draft')}
                  className="ml-2 font-medium text-yellow-700 underline hover:text-yellow-600"
                >
                  Move to Draft
                </button>
                <button
                  onClick={() => handleBulkAction('feature')}
                  className="ml-2 font-medium text-yellow-700 underline hover:text-yellow-600"
                >
                  Feature
                </button>
                <button
                  onClick={() => handleBulkAction('unfeature')}
                  className="ml-2 font-medium text-yellow-700 underline hover:text-yellow-600"
                >
                  Unfeature
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="ml-2 font-medium text-red-600 underline hover:text-red-700"
                >
                  Delete All
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {getError('admin-blog-posts') && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start">
          <FiAlertCircle className="mr-2 mt-0.5 flex-shrink-0" />
          <span>{getError('admin-blog-posts')}</span>
        </div>
      )}
      
      {/* Blog Posts Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {isLoading('admin-blog-posts') ? (
          <div className="p-6 flex justify-center items-center">
            <LoadingSpinner size="lg" />
            <span className="ml-2 text-gray-600">Loading blog posts...</span>
          </div>
        ) : posts.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No blog posts found. Try adjusting your filters or <Link to="/admin/blog-posts/new" className="text-primary-600 hover:text-primary-500">create a new post</Link>.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        checked={selectedPosts.length === posts.length && posts.length > 0}
                        onChange={handleSelectAll}
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Post
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          checked={selectedPosts.includes(post._id)}
                          onChange={() => handleSelectPost(post._id)}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {post.featuredImage ? (
                            <img className="h-10 w-10 rounded-md object-cover" src={post.featuredImage} alt="" />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-xs">No image</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{post.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">{truncateText(post.excerpt, 60)}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {post.featured && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mr-2">
                                Featured
                              </span>
                            )}
                            <span>{post.views || 0} views</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {post.author ? post.author.name : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(post.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/blog/${post.slug}`}
                          target="_blank"
                          className="text-gray-400 hover:text-gray-500"
                          title="View Post"
                        >
                          <FiEye />
                        </Link>
                        <Link
                          to={`/admin/blog/edit/${post._id}`}
                          className="text-blue-400 hover:text-blue-500"
                          title="Edit Post"
                        >
                          <FiEdit />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(post)}
                          className="text-red-400 hover:text-red-500"
                          title="Delete Post"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading('admin-blog-posts') && posts.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * postsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * postsPerPage, totalCount)}</span> of <span className="font-medium">{totalCount}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  
                  {/* Page numbers */}
                  {[...Array(totalPages).keys()].map(page => (
                    <button
                      key={page + 1}
                      onClick={() => handlePageChange(page + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page + 1 ? 'z-10 bg-primary-50 border-primary-500 text-primary-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                    >
                      {page + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Delete Blog Post
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete the post "{postToDelete?.title}"? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => handleDeletePost(postToDelete._id)}
                  disabled={isLoading('delete-blog-post')}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading('delete-blog-post') ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleDeleteCancel}
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

export default BlogPosts