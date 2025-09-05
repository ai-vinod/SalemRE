import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { FiCalendar, FiUser, FiTag, FiSearch } from 'react-icons/fi'
import BlogPreviewCard from '../components/BlogPreviewCard'

const Blog = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        // In a real app, you would fetch from your API
        // const response = await axios.get('/api/blog-posts')
        // setPosts(response.data)
        
        // Using dummy data for now
        setPosts([
          {
            id: 1,
            title: 'Top 10 Neighborhoods in Salem for Investment',
            excerpt: 'Discover the best areas in Salem to invest in real estate for maximum returns and growth potential.',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            image_url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
            author: 'Rajesh Kumar',
            date: '2023-10-15',
            category: 'Investment'
          },
          {
            id: 2,
            title: 'How to Get the Best Home Loan Rates in 2023',
            excerpt: 'Learn the strategies to secure the most favorable home loan interest rates in the current market.',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            image_url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
            author: 'Priya Singh',
            date: '2023-09-28',
            category: 'Finance'
          },
          {
            id: 3,
            title: 'Salem Real Estate Market Trends for 2023',
            excerpt: 'An in-depth analysis of the current real estate market trends in Salem and predictions for the coming year.',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            image_url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
            author: 'Arun Prakash',
            date: '2023-09-10',
            category: 'Market Trends'
          },
          {
            id: 4,
            title: '5 Things to Check Before Buying a Plot in Salem',
            excerpt: 'Essential checklist for buyers to ensure they make a sound investment when purchasing land in Salem.',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            image_url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
            author: 'Kavitha Raman',
            date: '2023-08-22',
            category: 'Buying Tips'
          },
          {
            id: 5,
            title: 'The Impact of Infrastructure Development on Salem Property Values',
            excerpt: 'How ongoing and planned infrastructure projects are affecting real estate prices across different areas of Salem.',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            image_url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
            author: 'Suresh Kumar',
            date: '2023-08-05',
            category: 'Market Trends'
          },
          {
            id: 6,
            title: 'Vastu Tips for Your New Home in Salem',
            excerpt: 'Traditional Vastu Shastra principles to consider when buying or building a new home in Salem.',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            image_url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
            author: 'Lakshmi Narayan',
            date: '2023-07-19',
            category: 'Home Tips'
          }
        ])
      } catch (error) {
        console.error('Error fetching blog posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // Get unique categories from posts
  const categories = ['All', ...new Set(posts.map(post => post.category))]

  // Filter posts based on search term and category
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || post.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
  }

  return (
    <div className="bg-gray-50 py-10">
      <div className="container">
        {/* Blog Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Real Estate Blog</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest trends, tips, and insights about Salem's real estate market
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search blog posts..."
                className="form-input pl-10 w-full"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${selectedCategory === category ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Posts */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary-200 rounded-full animate-spin border-t-primary-600"></div>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
              <BlogPreviewCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No blog posts found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('')
              }}
              className="btn btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination - To be implemented */}
        {filteredPosts.length > 0 && (
          <div className="mt-12 flex justify-center">
            <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <a
                href="#"
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="#"
                aria-current="page"
                className="relative inline-flex items-center px-4 py-2 border border-primary-500 bg-primary-50 text-sm font-medium text-primary-600"
              >
                1
              </a>
              <a
                href="#"
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                2
              </a>
              <a
                href="#"
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </a>
            </nav>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16 bg-primary-50 rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Subscribe to Our Newsletter</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Get the latest updates, market insights, and exclusive property listings delivered directly to your inbox.
          </p>
          <form className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Your email address"
              className="form-input flex-grow rounded-r-none"
              required
            />
            <button type="submit" className="btn btn-primary rounded-l-none">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Blog