import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { FiCalendar, FiUser, FiTag, FiArrowLeft, FiShare2 } from 'react-icons/fi'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const BlogPost = () => {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState([])
 
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true)
      try {
        // In a real app, you would fetch from your API
        // const response = await axios.get(`/api/blog-posts/${id}`)
        // setPost(response.data)
        
        // Using dummy data for now
        const dummyPost = {
          id: parseInt(id),
          title: 'Top 10 Neighborhoods in Salem for Investment',
          excerpt: 'Discover the best areas in Salem to invest in real estate for maximum returns and growth potential.',
          content: `<p>Salem, the fifth largest city in Tamil Nadu, has been experiencing significant growth in its real estate market. With its strategic location, improving infrastructure, and growing economy, Salem offers excellent investment opportunities for real estate investors.</p>

          <p>In this comprehensive guide, we'll explore the top 10 neighborhoods in Salem that promise the best returns on your real estate investments.</p>

          <h2>1. Hasthampatti</h2>
          <p>Hasthampatti is one of the most premium residential areas in Salem. Located in the heart of the city, it offers excellent connectivity to all major parts of Salem.</p>
          <p>Key investment advantages:</p>
          <ul>
            <li>Premium location with high property values</li>
            <li>Excellent infrastructure and amenities</li>
            <li>Proximity to schools, hospitals, and shopping centers</li>
            <li>Consistent appreciation in property values</li>
          </ul>

          <h2>2. Fairlands</h2>
          <p>Fairlands is another upscale residential area that has seen significant development in recent years. It's known for its spacious layouts and green surroundings.</p>
          <p>Key investment advantages:</p>
          <ul>
            <li>Upscale residential area with good appreciation potential</li>
            <li>Well-planned layouts with good road connectivity</li>
            <li>Proximity to educational institutions and healthcare facilities</li>
            <li>Growing commercial development</li>
          </ul>

          <h2>3. Alagapuram</h2>
          <p>Alagapuram is rapidly developing as a residential hub due to its strategic location and affordable property prices compared to more central areas.</p>
          <p>Key investment advantages:</p>
          <ul>
            <li>Affordable property prices with good appreciation potential</li>
            <li>Developing infrastructure</li>
            <li>Good connectivity to the city center</li>
            <li>Growing residential demand</li>
          </ul>

          <h2>4. Suramangalam</h2>
          <p>Suramangalam is gaining popularity among investors due to its balanced mix of residential and commercial properties.</p>
          <p>Key investment advantages:</p>
          <ul>
            <li>Mixed development with both residential and commercial properties</li>
            <li>Good road connectivity</li>
            <li>Proximity to educational institutions</li>
            <li>Steady appreciation in property values</li>
          </ul>

          <h2>5. Shevapet</h2>
          <p>Shevapet is primarily a commercial area but has been seeing increased interest in residential properties as well.</p>
          <p>Key investment advantages:</p>
          <ul>
            <li>Strong commercial presence driving residential demand</li>
            <li>Good rental yield potential</li>
            <li>Central location with excellent connectivity</li>
            <li>Established market with stable property values</li>
          </ul>

          <h2>6. Junction Main Road</h2>
          <p>Junction Main Road is a prime commercial area that offers excellent investment opportunities, especially for commercial properties.</p>
          <p>Key investment advantages:</p>
          <ul>
            <li>Prime commercial location</li>
            <li>High rental yield potential</li>
            <li>Excellent visibility and footfall</li>
            <li>Consistent demand for commercial spaces</li>
          </ul>

          <h2>7. Ammapet</h2>
          <p>Ammapet is a well-established residential area that continues to attract homebuyers and investors alike.</p>
          <p>Key investment advantages:</p>
          <ul>
            <li>Established residential area with stable property values</li>
            <li>Good infrastructure and amenities</li>
            <li>Proximity to schools and hospitals</li>
            <li>Strong rental demand</li>
          </ul>

          <h2>8. Five Roads</h2>
          <p>Five Roads is a central location that offers a mix of residential and commercial properties.</p>
          <p>Key investment advantages:</p>
          <ul>
            <li>Central location with excellent connectivity</li>
            <li>Mixed development potential</li>
            <li>High visibility for commercial properties</li>
            <li>Good appreciation potential</li>
          </ul>

          <h2>9. Kondalampatti</h2>
          <p>Kondalampatti is an emerging residential area that offers affordable property prices with good growth potential.</p>
          <p>Key investment advantages:</p>
          <ul>
            <li>Affordable property prices</li>
            <li>Developing infrastructure</li>
            <li>Growing residential demand</li>
            <li>Good potential for long-term appreciation</li>
          </ul>

          <h2>10. Cherry Road</h2>
          <p>Cherry Road is known for its premium properties and is considered one of the most prestigious addresses in Salem.</p>
          <p>Key investment advantages:</p>
          <ul>
            <li>Premium location with high-end properties</li>
            <li>Excellent infrastructure and amenities</li>
            <li>Prestigious address with strong brand value</li>
            <li>Consistent appreciation in property values</li>
          </ul>

          <h2>Conclusion</h2>
          <p>Salem's real estate market offers diverse investment opportunities across different neighborhoods. Whether you're looking for high-end properties with stable returns or affordable options with good growth potential, Salem has something to offer for every type of investor.</p>

          <p>Before making any investment decision, it's advisable to conduct thorough research, visit the locations, and consult with local real estate experts to make an informed choice.</p>`,
          image_url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
          author: 'Rajesh Kumar',
          date: '2023-10-15',
          category: 'Investment',
          tags: ['investment', 'neighborhoods', 'property', 'salem']
        }
        
        setPost(dummyPost)
        
        // Fetch related posts
        // const relatedResponse = await axios.get(`/api/blog-posts/related/${id}`)
        // setRelatedPosts(relatedResponse.data)
        
        // Using dummy related posts
        setRelatedPosts([
          {
            id: 3,
            title: 'Salem Real Estate Market Trends for 2023',
            excerpt: 'An in-depth analysis of the current real estate market trends in Salem and predictions for the coming year.',
            image_url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
            date: '2023-09-10',
            category: 'Market Trends'
          },
          {
            id: 5,
            title: 'The Impact of Infrastructure Development on Salem Property Values',
            excerpt: 'How ongoing and planned infrastructure projects are affecting real estate prices across different areas of Salem.',
            image_url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
            date: '2023-08-05',
            category: 'Market Trends'
          },
          {
            id: 4,
            title: '5 Things to Check Before Buying a Plot in Salem',
            excerpt: 'Essential checklist for buyers to ensure they make a sound investment when purchasing land in Salem.',
            image_url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
            date: '2023-08-22',
            category: 'Buying Tips'
          }
        ])
      } catch (error) {
        console.error('Error fetching blog post:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
    // Scroll to top when component mounts
    window.scrollTo(0, 0)
  }, [id])

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error))
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch((error) => console.error('Could not copy text: ', error))
    }
  }

  if (loading) {
    return (
      <div className="container py-16 flex justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container py-16">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h2>
          <p className="text-gray-600 mb-6">The blog post you are looking for does not exist or has been removed.</p>
          <Link to="/blog" className="btn btn-primary">
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 py-10">
      <div className="container max-w-4xl mx-auto">
        {/* Back to Blog */}
        <div className="mb-6">
          <Link to="/blog" className="inline-flex items-center text-primary-600 hover:text-primary-700">
            <FiArrowLeft className="mr-2" />
            Back to Blog
          </Link>
        </div>

        {/* Blog Post Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="relative h-[400px]">
            <img 
              src={post.image_url} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                <FiTag className="mr-1" />
                {post.category}
              </span>
              {post.tags && post.tags.map((tag, index) => (
                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  #{tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
            
            <div className="flex items-center text-gray-600 mb-6">
              <div className="flex items-center mr-6">
                <FiUser className="mr-2" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <FiCalendar className="mr-2" />
                <span>{formatDate(post.date)}</span>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }}></div>
            
            {/* Share Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button 
                onClick={sharePost}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <FiShare2 className="mr-2" />
                Share this article
              </button>
            </div>
          </div>
        </div>

        {/* Author Bio */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
              <FiUser className="text-2xl text-gray-500" />
            </div>
            <div>
              <h3 className="font-medium text-lg">{post.author}</h3>
              <p className="text-gray-600">Real Estate Expert</p>
            </div>
          </div>
          <p className="mt-4 text-gray-700">
            A seasoned real estate professional with over 10 years of experience in the Salem property market. Specializes in investment properties and market analysis.
          </p>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map(relatedPost => (
                <div key={relatedPost.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <Link to={`/blog/${relatedPost.id}`}>
                    <img 
                      src={relatedPost.image_url} 
                      alt={relatedPost.title} 
                      className="w-full h-48 object-cover"
                    />
                  </Link>
                  <div className="p-4">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mb-2">
                      {relatedPost.category}
                    </span>
                    <Link to={`/blog/${relatedPost.id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600">
                        {relatedPost.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 text-sm mb-2">
                      {formatDate(relatedPost.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comment Section - To be implemented */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Comments</h2>
          <p className="text-gray-600 italic">Comments section will be implemented here</p>
        </div>
      </div>
    </div>
  )
}

export default BlogPost