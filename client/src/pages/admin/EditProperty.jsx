import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiSave, FiUpload, FiX, FiPlus, FiLoader } from 'react-icons/fi'

const EditProperty = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [property, setProperty] = useState({
    title: '',
    type: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    location: '',
    address: '',
    description: '',
    features: [],
    status: 'active',
    featured: false
  })
  
  const [images, setImages] = useState([])
  const [newFeature, setNewFeature] = useState('')
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const propertyTypes = [
    'Apartment',
    'Villa',
    'Plot',
    'Commercial',
    'Farm House',
    'Penthouse',
    'Studio'
  ]

  const locations = [
    'Hasthampatti',
    'Fairlands',
    'Alagapuram',
    'Suramangalam',
    'Shevapet',
    'Junction',
    'Five Roads',
    'Ammapet',
    'Kondalampatti',
    'Gugai'
  ]

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true)
      try {
        // In a real app, you would fetch from your API
        // const response = await axios.get(`/api/admin/properties/${id}`)
        // setProperty(response.data)
        // setImages(response.data.images.map(url => ({
        //   id: Date.now() + Math.random().toString(36).substring(2, 9),
        //   url,
        //   name: url.split('/').pop(),
        //   existing: true
        // })))
        
        // Using dummy data for now
        setTimeout(() => {
          const dummyProperty = {
            id: parseInt(id),
            title: 'Modern Villa in Hasthampatti',
            type: 'Villa',
            price: '9500000',
            bedrooms: '4',
            bathrooms: '3',
            area: '2500',
            location: 'Hasthampatti',
            address: '123 Main Street, Hasthampatti, Salem',
            description: 'A beautiful modern villa with spacious rooms, a garden, and a swimming pool. Perfect for a family looking for luxury living in a prime location.',
            features: ['Swimming Pool', 'Garden', 'Parking', 'Security', 'Power Backup'],
            status: 'active',
            featured: true,
            images: [
              'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
              'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83',
              'https://images.unsplash.com/photo-1512917774080-9991f1c4c750'
            ]
          }
          
          setProperty(dummyProperty)
          setImages(dummyProperty.images.map(url => ({
            id: Date.now() + Math.random().toString(36).substring(2, 9),
            url,
            name: url.split('/').pop(),
            existing: true
          })))
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error fetching property:', error)
        setLoading(false)
        // Handle error, maybe redirect
        navigate('/admin/properties', { 
          state: { error: 'Failed to load property. Please try again.' } 
        })
      }
    }

    fetchProperty()
  }, [id, navigate])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setProperty(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    
    // In a real app, you would upload these to your server or cloud storage
    // and get back URLs to store
    
    // For now, create local URLs
    const newImages = files.map(file => ({
      id: Date.now() + Math.random().toString(36).substring(2, 9),
      url: URL.createObjectURL(file),
      file: file,
      name: file.name,
      existing: false
    }))
    
    setImages(prev => [...prev, ...newImages])
  }

  const removeImage = (id) => {
    setImages(prev => prev.filter(image => image.id !== id))
  }

  const addFeature = () => {
    if (newFeature.trim() !== '' && !property.features.includes(newFeature.trim())) {
      setProperty(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature('')
    }
  }

  const removeFeature = (feature) => {
    setProperty(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Required fields
    const requiredFields = ['title', 'type', 'price', 'location', 'description']
    requiredFields.forEach(field => {
      if (!property[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
      }
    })
    
    // Price validation
    if (property.price && isNaN(Number(property.price))) {
      newErrors.price = 'Price must be a number'
    }
    
    // Area validation
    if (property.area && isNaN(Number(property.area))) {
      newErrors.area = 'Area must be a number'
    }
    
    // Bedrooms validation
    if (property.bedrooms && isNaN(Number(property.bedrooms))) {
      newErrors.bedrooms = 'Bedrooms must be a number'
    }
    
    // Bathrooms validation
    if (property.bathrooms && isNaN(Number(property.bathrooms))) {
      newErrors.bathrooms = 'Bathrooms must be a number'
    }
    
    // Image validation
    if (images.length === 0) {
      newErrors.images = 'At least one image is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      // Scroll to the first error
      const firstError = Object.keys(errors)[0]
      const element = document.getElementById(firstError)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }
    
    setSaving(true)
    
    try {
      // In a real app, you would call your API
      // First handle images - upload new ones, track existing ones to keep, and note ones to delete
      // const imagesToKeep = images.filter(img => img.existing).map(img => img.url)
      // const imagesToUpload = images.filter(img => !img.existing)
      
      // const uploadedImages = await Promise.all(
      //   imagesToUpload.map(async (image) => {
      //     const formData = new FormData()
      //     formData.append('file', image.file)
      //     const response = await axios.post('/api/upload', formData)
      //     return response.data.url
      //   })
      // )
      
      // Then update property with all image URLs
      // const propertyData = {
      //   ...property,
      //   images: [...imagesToKeep, ...uploadedImages]
      // }
      // await axios.put(`/api/admin/properties/${id}`, propertyData)
      
      // Simulate API call
      setTimeout(() => {
        setSaving(false)
        navigate('/admin/properties', { 
          state: { message: 'Property updated successfully!' } 
        })
      }, 1500)
    } catch (error) {
      console.error('Error updating property:', error)
      setSaving(false)
      // Handle error
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Property</h1>
        <button
          onClick={() => navigate('/admin/properties')}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Property Title*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={property.title}
                onChange={handleChange}
                className={`block w-full rounded-md shadow-sm ${errors.title ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'}`}
                placeholder="e.g. Modern Villa in Hasthampatti"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Property Type*
              </label>
              <select
                id="type"
                name="type"
                value={property.type}
                onChange={handleChange}
                className={`block w-full rounded-md shadow-sm ${errors.type ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'}`}
              >
                <option value="">Select Property Type</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹)*
              </label>
              <input
                type="text"
                id="price"
                name="price"
                value={property.price}
                onChange={handleChange}
                className={`block w-full rounded-md shadow-sm ${errors.price ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'}`}
                placeholder="e.g. 5000000"
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location*
              </label>
              <select
                id="location"
                name="location"
                value={property.location}
                onChange={handleChange}
                className={`block w-full rounded-md shadow-sm ${errors.location ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'}`}
              >
                <option value="">Select Location</option>
                {locations.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Full Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={property.address}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g. 123 Main Street, Hasthampatti, Salem"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={property.status}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex items-center h-full mt-8">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={property.featured}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                Featured Property (will be highlighted on the homepage)
              </label>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Property Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                Bedrooms
              </label>
              <input
                type="text"
                id="bedrooms"
                name="bedrooms"
                value={property.bedrooms}
                onChange={handleChange}
                className={`block w-full rounded-md shadow-sm ${errors.bedrooms ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'}`}
                placeholder="e.g. 3"
              />
              {errors.bedrooms && <p className="mt-1 text-sm text-red-600">{errors.bedrooms}</p>}
            </div>

            <div>
              <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
                Bathrooms
              </label>
              <input
                type="text"
                id="bathrooms"
                name="bathrooms"
                value={property.bathrooms}
                onChange={handleChange}
                className={`block w-full rounded-md shadow-sm ${errors.bathrooms ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'}`}
                placeholder="e.g. 2"
              />
              {errors.bathrooms && <p className="mt-1 text-sm text-red-600">{errors.bathrooms}</p>}
            </div>

            <div>
              <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                Area (sq.ft)
              </label>
              <input
                type="text"
                id="area"
                name="area"
                value={property.area}
                onChange={handleChange}
                className={`block w-full rounded-md shadow-sm ${errors.area ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'}`}
                placeholder="e.g. 1500"
              />
              {errors.area && <p className="mt-1 text-sm text-red-600">{errors.area}</p>}
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description*
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              value={property.description}
              onChange={handleChange}
              className={`block w-full rounded-md shadow-sm ${errors.description ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'}`}
              placeholder="Describe the property in detail..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Features & Amenities</h2>
          
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g. Swimming Pool"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
            />
            <button
              type="button"
              onClick={addFeature}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <FiPlus className="mr-1" /> Add
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {property.features.map((feature, index) => (
              <div key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                {feature}
                <button
                  type="button"
                  onClick={() => removeFeature(feature)}
                  className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-500 focus:outline-none focus:bg-primary-500 focus:text-white"
                >
                  <FiX className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Property Images</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Images*
            </label>
            <div className="flex items-center">
              <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <FiUpload className="mr-2" />
                Choose Files
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <span className="ml-3 text-sm text-gray-500">
                You can upload multiple images
              </span>
            </div>
            {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
          </div>
          
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-100">
                    <img src={image.url} alt="Property" className="object-cover w-full h-full" />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="absolute top-2 right-2 inline-flex items-center justify-center h-8 w-8 rounded-full bg-white bg-opacity-75 hover:bg-opacity-100 text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                  <p className="mt-1 text-xs text-gray-500 truncate">{image.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <FiSave className="mr-2" /> Update Property
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditProperty