import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { FiSearch, FiMapPin, FiHome, FiDollarSign, FiMaximize } from 'react-icons/fi'
import PropertyCard from '../components/PropertyCard'
import BlogPreviewCard from '../components/BlogPreviewCard'

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([])
  const [latestBlogs, setLatestBlogs] = useState([])
  const [searchParams, setSearchParams] = useState({
    type: '',
    location: '',
    minPrice: '',
    maxPrice: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const response = await axios.get('/api/properties/featured')
        setFeaturedProperties(response.data)
      } catch (error) {
        console.error('Error fetching featured properties:', error)
        // Use dummy data for now
        setFeaturedProperties([
          {
            id: 1,
            title: 'Premium Plot in Ammapet',
            property_type: 'plot',
            price: 2500000,
            size: 2400,
            location: 'Ammapet, Salem',
            image_url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'
          },
          {
            id: 2,
            title: 'Luxury Apartment in Fairlands',
            property_type: 'apartment',
            price: 4500000,
            size: 1200,
            location: 'Fairlands, Salem',
            image_url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'
          },
          {
            id: 3,
            title: 'Modern Villa in Hasthampatti',
            property_type: 'house',
            price: 7500000,
            size: 3000,
            location: 'Hasthampatti, Salem',
            image_url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'
          },
          {
            id: 4,
            title: 'Commercial Space in Junction',
            property_type: 'commercial',
            price: 9000000,
            size: 2000,
            location: 'Junction Main Road, Salem',
            image_url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'
          }
        ])
      }
    }

    const fetchLatestBlogs = async () => {
      try {
        const response = await axios.get('/api/blog-posts/latest')
        setLatestBlogs(response.data)
      } catch (error) {
        console.error('Error fetching latest blogs:', error)
        // Use dummy data for now
        setLatestBlogs([
          {
            id: 1,
            title: 'Top 5 Neighborhoods in Salem for Investment',
            slug: 'top-5-neighborhoods-salem-investment',
            excerpt: 'Discover the best areas in Salem to invest in real estate for maximum returns.',
            created_at: '2023-05-15T10:30:00Z',
            image_url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'
          },
          {
            id: 2,
            title: 'How to Get the Best Home Loan Rates in 2023',
            slug: 'best-home-loan-rates-2023',
            excerpt: 'Learn how to secure the most competitive home loan rates in the current market.',
            created_at: '2023-05-10T14:45:00Z',
            image_url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'
          },
          {
            id: 3,
            title: 'The Rise of Eco-Friendly Homes in Tamil Nadu',
            slug: 'eco-friendly-homes-tamil-nadu',
            excerpt: 'Explore the growing trend of sustainable and eco-friendly housing in Tamil Nadu.',
            created_at: '2023-05-05T09:15:00Z',
            image_url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'
          }
        ])
      }
      setLoading(false)
    }

    fetchFeaturedProperties()
    fetchLatestBlogs()
  }, [])

  const handleSearchChange = (e) => {
    const { name, value } = e.target
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Construct query string from search params
    const queryParams = new URLSearchParams()
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) queryParams.append(key, value)
    })
    
    // Navigate to listings page with search params
    window.location.href = `/listings?${queryParams.toString()}`
  }

  const propertyTypes = [
    { id: 'plot', name: 'Plots', icon: <FiMapPin className="w-8 h-8" /> },
    { id: 'apartment', name: 'Apartments', icon: <FiHome className="w-8 h-8" /> },
    { id: 'house', name: 'Houses', icon: <FiHome className="w-8 h-8" /> },
    { id: 'commercial', name: 'Commercial', icon: <FiDollarSign className="w-8 h-8" /> }
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Dream Property in Salem
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Premium plots and properties in the heart of Tamil Nadu
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="type" className="form-label text-gray-700">
                    Property Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={searchParams.type}
                    onChange={handleSearchChange}
                    className="form-input"
                  >
                    <option value="">All Types</option>
                    <option value="plot">Plots</option>
                    <option value="apartment">Apartments</option>
                    <option value="house">Houses</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="location" className="form-label text-gray-700">
                    Location
                  </label>
                  <select
                    id="location"
                    name="location"
                    value={searchParams.location}
                    onChange={handleSearchChange}
                    className="form-input"
                  >
                    <option value="">All Locations</option>
                    <option value="Ammapet">Ammapet</option>
                    <option value="Fairlands">Fairlands</option>
                    <option value="Hasthampatti">Hasthampatti</option>
                    <option value="Junction">Junction</option>
                    <option value="Shevapet">Shevapet</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="price" className="form-label text-gray-700">
                    Price Range
                  </label>
                  <select
                    id="price"
                    name="maxPrice"
                    value={searchParams.maxPrice}
                    onChange={handleSearchChange}
                    className="form-input"
                  >
                    <option value="">Any Price</option>
                    <option value="1000000">Under ₹10 Lakhs</option>
                    <option value="2500000">Under ₹25 Lakhs</option>
                    <option value="5000000">Under ₹50 Lakhs</option>
                    <option value="10000000">Under ₹1 Crore</option>
                    <option value="25000000">Under ₹2.5 Crores</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="btn btn-primary w-full flex items-center justify-center"
                  >
                    <FiSearch className="mr-2" />
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Properties</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our handpicked selection of premium properties in Salem
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="w-12 h-12 border-4 border-primary-200 rounded-full animate-spin border-t-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/listings" className="btn btn-outline">
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Property Categories */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Property Type</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find the perfect property that suits your needs
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {propertyTypes.map((type) => (
              <Link
                key={type.id}
                to={`/listings?type=${type.id}`}
                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  {type.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{type.name}</h3>
                <p className="text-gray-600">
                  Explore available {type.name.toLowerCase()} in Salem
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest from Our Blog</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest trends and insights in real estate
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="w-12 h-12 border-4 border-primary-200 rounded-full animate-spin border-t-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestBlogs.map((blog) => (
                <BlogPreviewCard key={blog.id} blog={blog} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/blog" className="btn btn-outline">
              View All Articles
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About Salem Real Estate</h2>
              <p className="text-gray-600 mb-6">
                Salem Real Estate is the premier destination for finding premium plots and properties in Salem, Tamil Nadu. With years of experience and deep local knowledge, we help our clients find their dream properties with ease.
              </p>
              <p className="text-gray-600 mb-6">
                Our team of experienced real estate professionals is dedicated to providing exceptional service and guidance throughout your property buying journey. We pride ourselves on our integrity, expertise, and commitment to client satisfaction.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-primary-600 mb-2">200+</div>
                  <div className="text-gray-700">Properties Sold</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-primary-600 mb-2">150+</div>
                  <div className="text-gray-700">Happy Clients</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-primary-600 mb-2">10+</div>
                  <div className="text-gray-700">Years Experience</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-primary-600 mb-2">5</div>
                  <div className="text-gray-700">Expert Agents</div>
                </div>
              </div>
              <Link to="/contact" className="btn btn-primary">
                Contact Us
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
                alt="Salem Real Estate Office"
                className="rounded-lg shadow-lg w-full h-auto"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary-600 text-white p-6 rounded-lg shadow-lg max-w-xs">
                <div className="text-2xl font-bold mb-2">Trust & Reliability</div>
                <p>Your trusted partner in finding the perfect property in Salem</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Ready to Find Your Dream Property?</h2>
            <p className="text-xl opacity-90 mb-8">
              Let us help you find the perfect property in Salem. Contact us today to get started!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/listings" className="btn bg-white text-primary-600 hover:bg-gray-100">
                Browse Properties
              </Link>
              <Link to="/contact" className="btn bg-primary-700 text-white hover:bg-primary-800 border border-primary-500">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home