import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiHome, FiMapPin, FiMaximize2, FiPhone, FiCalendar, FiUser } from 'react-icons/fi'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { propertyService, inquiryService } from '../services'
import { useApi } from '../hooks'
import { useLoading, useError } from '../contexts'

const PropertyDetails = () => {
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const { isLoading } = useLoading()
  const { getError, setError, clearError } = useError()
  const { request } = useApi()
  const [activeImage, setActiveImage] = useState(0)
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const data = await request(`property-${id}`, () => propertyService.getProperty(id))
        setProperty(data.property || null)
      } catch (error) {
        console.error('Error fetching property details:', error)
      }
    }

    fetchPropertyDetails()
    // Scroll to top when component mounts
    window.scrollTo(0, 0)
  }, [id, request])

  const handleContactFormChange = (e) => {
    const { name, value } = e.target
    setContactFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleContactFormSubmit = async (e) => {
    e.preventDefault()
    clearError('inquiry-form')

    // Basic validation
    if (!contactFormData.name || !contactFormData.email || !contactFormData.phone) {
      setError('inquiry-form', 'Please fill in all required fields')
      return
    }

    try {
      await request('inquiry-submit', () => inquiryService.createInquiry({
        propertyId: property.id,
        propertyTitle: property.title,
        name: contactFormData.name,
        email: contactFormData.email,
        phone: contactFormData.phone,
        message: contactFormData.message,
        propertyType: property.type,
        location: property.location,
        status: 'new'
      }))
      
      setFormSubmitted(true)
      setContactFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      setFormError('Failed to submit your inquiry. Please try again.')
    }
  }

  const formatPrice = (price) => {
    // Format price in Indian currency format (e.g., ₹25,00,000)
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  if (loading) {
    return (
      <div className="container py-16 flex justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="container py-16">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
          <p className="text-gray-600 mb-6">The property you are looking for does not exist or has been removed.</p>
          <Link to="/listings" className="btn btn-primary">
            Browse Properties
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 py-10">
      <div className="container">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="text-gray-600 hover:text-primary-600">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                  </svg>
                  <Link to="/listings" className="text-gray-600 hover:text-primary-600">
                    Properties
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                  </svg>
                  <span className="text-gray-500">{property.title}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Property Title and Price */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
              <p className="text-gray-600 flex items-center">
                <FiMapPin className="mr-2" />
                {property.location}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-3xl font-bold text-primary-600">{formatPrice(property.price)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Property Images */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
              <div className="relative h-[400px]">
                <img 
                  src={property.images[activeImage]} 
                  alt={property.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex space-x-2 overflow-x-auto">
                {property.images.map((image, index) => (
                  <div 
                    key={index} 
                    className={`w-24 h-24 flex-shrink-0 cursor-pointer border-2 ${activeImage === index ? 'border-primary-500' : 'border-transparent'}`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img 
                      src={image} 
                      alt={`${property.title} - Image ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center">
                  <FiHome className="text-primary-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-medium capitalize">{property.property_type}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiMaximize2 className="text-primary-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Size</p>
                    <p className="font-medium">{property.size} sq.ft</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiCalendar className="text-primary-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Listed On</p>
                    <p className="font-medium">{new Date(property.listed_date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-medium mb-3">Description</h3>
              <p className="text-gray-700 mb-6">{property.description}</p>

              <h3 className="text-lg font-medium mb-3">Address</h3>
              <p className="text-gray-700 mb-6">{property.address}</p>

              <h3 className="text-lg font-medium mb-3">Features</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                {property.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <h3 className="text-lg font-medium mb-3">Nearby Places</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.nearby.map((place, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                      <FiMapPin className="text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium">{place.name}</p>
                      <p className="text-sm text-gray-500">{place.distance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Map - Placeholder */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <div className="bg-gray-200 h-[300px] rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Map will be displayed here</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            {/* Agent Information */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Contact Agent</h2>
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <FiUser className="text-2xl text-gray-500" />
                </div>
                <div>
                  <h3 className="font-medium">{property.agent.name}</h3>
                  <p className="text-gray-600">Property Agent</p>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <a 
                  href={`tel:${property.agent.phone}`} 
                  className="flex items-center text-gray-700 hover:text-primary-600"
                >
                  <FiPhone className="mr-2" />
                  {property.agent.phone}
                </a>
                <a 
                  href={`mailto:${property.agent.email}`} 
                  className="flex items-center text-gray-700 hover:text-primary-600"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                  {property.agent.email}
                </a>
              </div>
              <a 
                href={`tel:${property.agent.phone}`} 
                className="btn btn-primary w-full flex items-center justify-center"
              >
                <FiPhone className="mr-2" />
                Call Agent
              </a>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Send Inquiry</h2>
              {formSubmitted ? (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                  <p>Thank you for your inquiry! Our agent will contact you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleContactFormSubmit}>
                  {formError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                      <p>{formError}</p>
                    </div>
                  )}
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={contactFormData.name}
                      onChange={handleContactFormChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={contactFormData.email}
                      onChange={handleContactFormChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={contactFormData.phone}
                      onChange={handleContactFormChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={contactFormData.message}
                      onChange={handleContactFormChange}
                      rows="4"
                      className="form-input"
                      placeholder="I'm interested in this property..."
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary w-full">
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Similar Properties - To be implemented */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Properties</h2>
          <p className="text-gray-600 italic">Similar properties will be displayed here</p>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetails