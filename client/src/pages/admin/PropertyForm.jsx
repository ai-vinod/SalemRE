import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiSave, FiUpload, FiTrash2, FiPlus, FiX, FiAlertCircle } from 'react-icons/fi'
import { useLoading, useError } from '../../contexts/LoadingContext'
import { useApi } from '../../hooks/useApi'
import propertyService from '../../services/propertyService'
import uploadService from '../../services/uploadService'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const PropertyForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = Boolean(id)
  
  const { isLoading, setLoading, clearLoading } = useLoading()
  const { getError, setError, clearError } = useError()
  const { request } = useApi()
  
  const [property, setProperty] = useState({
    title: '',
    description: '',
    price: '',
    address: '',
    city: 'Salem',
    state: 'Tamil Nadu',
    zipCode: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    propertyType: 'house',
    listingType: 'sale',
    features: [],
    images: []
  })

  const [newFeature, setNewFeature] = useState('')
  const [uploadProgress, setUploadProgress] = useState({})
  const [errors, setErrors] = useState({})

  // Property types and listing types for dropdown options
  const propertyTypes = [
    { value: 'house', label: 'House' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'villa', label: 'Villa' },
    { value: 'plot', label: 'Plot' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'farmland', label: 'Farmland' }
  ]

  const listingTypes = [
    { value: 'sale', label: 'For Sale' },
    { value: 'rent', label: 'For Rent' },
    { value: 'lease', label: 'For Lease' }
  ]

  // Fetch property data if in edit mode
  useEffect(() => {
    const fetchProperty = async () => {
      if (isEditMode) {
        clearError('property-form')
        setLoading('fetch-property', true)
        
        try {
          const data = await request(
            () => propertyService.getProperty(id),
            'fetch-property'
          )
          
          if (data) {
            // Format the data to match our form structure
            setProperty({
              ...data,
              // Ensure numeric values are strings for form inputs
              price: data.price?.toString() || '',
              bedrooms: data.bedrooms?.toString() || '',
              bathrooms: data.bathrooms?.toString() || '',
              area: data.area?.toString() || '',
              // Ensure features is an array
              features: data.features || [],
              // Ensure images is an array
              images: data.images || []
            })
          }
        } catch (error) {
          console.error('Error fetching property:', error)
          setError('property-form', 'Failed to load property data. Please try again.')
        } finally {
          clearLoading('fetch-property')
        }
      }
    }
    
    fetchProperty()
  }, [isEditMode, id, request, clearError, setLoading, clearLoading, setError])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProperty(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleAddFeature = () => {
    if (newFeature.trim() && !property.features.includes(newFeature.trim())) {
      setProperty(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature('')
    }
  }

  const handleRemoveFeature = (feature) => {
    setProperty(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }))
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    
    clearError('image-upload')
    
    // Create FormData for each file and upload
    for (const file of files) {
      const fileId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      
      // Create a local URL for preview
      const reader = new FileReader()
      reader.onloadend = () => {
        // Add the new image to the property state with temporary URL
        setProperty(prev => ({
          ...prev,
          images: [
            ...prev.images,
            {
              id: fileId,
              url: reader.result,
              main: prev.images.length === 0, // Make it the main image if it's the first one
              isUploading: true
            }
          ]
        }))
      }
      reader.readAsDataURL(file)
      
      // Set upload in progress
      setLoading(`upload-image-${fileId}`, true)
      
      try {
        // Upload the image
        const formData = new FormData()
        formData.append('image', file)
        
        const result = await request(
          () => uploadService.uploadPropertyImages(formData),
          `upload-image-${fileId}`
        )
        
        if (result && result.images && result.images.length > 0) {
          // Update the image with the real URL from the server
          setProperty(prev => ({
            ...prev,
            images: prev.images.map(img => 
              img.id === fileId 
                ? { 
                    ...img, 
                    id: result.images[0].id || img.id,
                    url: result.images[0].url,
                    isUploading: false 
                  }
                : img
            )
          }))
        }
      } catch (error) {
        console.error('Error uploading image:', error)
        setError('image-upload', 'Failed to upload image. Please try again.')
        
        // Remove the failed image from the list
        setProperty(prev => ({
          ...prev,
          images: prev.images.filter(img => img.id !== fileId)
        }))
      } finally {
        clearLoading(`upload-image-${fileId}`)
      }
    }
  }

  const handleRemoveImage = async (imageId) => {
    // Find the image to remove
    const imageToRemove = property.images.find(img => img.id === imageId)
    if (!imageToRemove) return
    
    // If it's a temporary image that's still uploading, just remove it from state
    if (imageToRemove.isUploading) {
      setProperty(prev => ({
        ...prev,
        images: prev.images.filter(img => img.id !== imageId)
      }))
      return
    }
    
    clearError('remove-image')
    setLoading(`remove-image-${imageId}`, true)
    
    try {
      // Only call the API if it's a real image (not a temporary one)
      if (!imageId.startsWith('temp-')) {
        await request(
          () => uploadService.removeImage({ imageId }),
          `remove-image-${imageId}`
        )
      }
      
      // Remove from property state
      setProperty(prev => ({
        ...prev,
        images: prev.images.filter(img => img.id !== imageId)
      }))
    } catch (error) {
      console.error('Error removing image:', error)
      setError('remove-image', 'Failed to remove image. Please try again.')
    } finally {
      clearLoading(`remove-image-${imageId}`)
    }
  }

  const handleSetMainImage = async (imageId) => {
    clearError('image-upload')
    setLoading('set-main-image', true)
    
    try {
      // Update main status locally first
      setProperty(prev => ({
        ...prev,
        images: prev.images.map(img => ({
          ...img,
          main: img.id === imageId
        }))
      }))
      
      // If this is an existing property with real images, update on server
      if (isEditMode && !imageId.startsWith('temp-')) {
        await request(
          () => propertyService.setMainImage(id, imageId),
          'set-main-image'
        )
      }
    } catch (error) {
      console.error('Error setting main image:', error)
      setError('image-upload', 'Failed to set main image. Please try again.')
    } finally {
      clearLoading('set-main-image')
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!property.title.trim()) newErrors.title = 'Title is required'
    if (!property.description.trim()) newErrors.description = 'Description is required'
    if (!property.price.trim()) newErrors.price = 'Price is required'
    if (isNaN(Number(property.price))) newErrors.price = 'Price must be a number'
    if (!property.address.trim()) newErrors.address = 'Address is required'
    if (!property.city.trim()) newErrors.city = 'City is required'
    if (!property.state.trim()) newErrors.state = 'State is required'
    if (!property.bedrooms.trim()) newErrors.bedrooms = 'Number of bedrooms is required'
    if (isNaN(Number(property.bedrooms))) newErrors.bedrooms = 'Bedrooms must be a number'
    if (!property.bathrooms.trim()) newErrors.bathrooms = 'Number of bathrooms is required'
    if (isNaN(Number(property.bathrooms))) newErrors.bathrooms = 'Bathrooms must be a number'
    if (!property.area.trim()) newErrors.area = 'Area is required'
    if (isNaN(Number(property.area))) newErrors.area = 'Area must be a number'
    if (property.images.length === 0) newErrors.images = 'At least one image is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      // Scroll to the first error
      const firstError = document.querySelector('.error-message')
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }
    
    clearError('property-form')
    setLoading('save-property', true)
    
    try {
      // Prepare property data for API
      const propertyData = {
        ...property,
        // Convert string values to numbers
        price: Number(property.price),
        bedrooms: Number(property.bedrooms),
        bathrooms: Number(property.bathrooms),
        area: Number(property.area),
        // Filter out any images that are still uploading
        images: property.images.filter(img => !img.isUploading).map(img => ({
          id: img.id,
          url: img.url,
          main: img.main
        }))
      }
      
      // Call the appropriate API endpoint
      if (isEditMode) {
        await request(
          () => propertyService.updateProperty(id, propertyData),
          'save-property'
        )
      } else {
        await request(
          () => propertyService.createProperty(propertyData),
          'save-property'
        )
      }
      
      // Navigate back to properties list on success
      navigate('/admin/properties')
    } catch (error) {
      console.error('Error saving property:', error)
      setError('property-form', 'Failed to save property. Please try again.')
    } finally {
       clearLoading('save-property')
     }
   }
  }

  if (isLoading('fetch-property')) {
    return (
      <div className="p-6 flex justify-center items-center h-full">
        <LoadingSpinner size="lg" />
        <span className="ml-2 text-gray-600">Loading property data...</span>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit Property' : 'Add New Property'}
          </h1>
          <p className="text-gray-600">
            {isEditMode ? 'Update property information' : 'Create a new property listing'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/properties')}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h2>
            <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Property Title*
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={property.title}
                    onChange={handleChange}
                    className={`block w-full rounded-md sm:text-sm ${errors.title ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'}`}
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-600 error-message">{errors.title}</p>}
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description*
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    value={property.description}
                    onChange={handleChange}
                    className={`block w-full rounded-md sm:text-sm ${errors.description ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'}`}
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600 error-message">{errors.description}</p>}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price (₹)*
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={property.price}
                    onChange={handleChange}
                    className={`block w-full rounded-md sm:text-sm ${errors.price ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'}`}
                  />
                  {errors.price && <p className="mt-1 text-sm text-red-600 error-message">{errors.price}</p>}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">
                  Property Type*
                </label>
                <div className="mt-1">
                  <select
                    id="propertyType"
                    name="propertyType"
                    value={property.propertyType}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    {propertyTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="listingType" className="block text-sm font-medium text-gray-700">
                  Listing Type*
                </label>
                <div className="mt-1">
                  <select
                    id="listingType"
                    name="listingType"
                    value={property.listingType}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    {listingTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Location</h2>
            <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address*
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={property.address}
                    onChange={handleChange}
                    className={`block w-full rounded-md sm:text-sm ${errors.address ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'}`}
                  />
                  {errors.address && <p className="mt-1 text-sm text-red-600 error-message">{errors.address}</p>}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City*
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={property.city}
                    onChange={handleChange}
                    className={`block w-full rounded-md sm:text-sm ${errors.city ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'}`}
                  />
                  {errors.city && <p className="mt-1 text-sm text-red-600 error-message">{errors.city}</p>}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State*
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={property.state}
                    onChange={handleChange}
                    className={`block w-full rounded-md sm:text-sm ${errors.state ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'}`}
                  />
                  {errors.state && <p className="mt-1 text-sm text-red-600 error-message">{errors.state}</p>}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                  ZIP Code
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={property.zipCode}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Property Details</h2>
            <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">
                  Bedrooms*
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="bedrooms"
                    name="bedrooms"
                    value={property.bedrooms}
                    onChange={handleChange}
                    className={`block w-full rounded-md sm:text-sm ${errors.bedrooms ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'}`}
                  />
                  {errors.bedrooms && <p className="mt-1 text-sm text-red-600 error-message">{errors.bedrooms}</p>}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">
                  Bathrooms*
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="bathrooms"
                    name="bathrooms"
                    value={property.bathrooms}
                    onChange={handleChange}
                    className={`block w-full rounded-md sm:text-sm ${errors.bathrooms ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'}`}
                  />
                  {errors.bathrooms && <p className="mt-1 text-sm text-red-600 error-message">{errors.bathrooms}</p>}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                  Area (sq.ft)*
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="area"
                    name="area"
                    value={property.area}
                    onChange={handleChange}
                    className={`block w-full rounded-md sm:text-sm ${errors.area ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'}`}
                  />
                  {errors.area && <p className="mt-1 text-sm text-red-600 error-message">{errors.area}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Features</h2>
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a feature (e.g., Garden, Parking)"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="inline-flex items-center p-2 border border-transparent rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <FiPlus className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {property.features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(feature)}
                      className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-primary-400 hover:bg-primary-200 hover:text-primary-500 focus:outline-none focus:bg-primary-500 focus:text-white"
                    >
                      <FiX className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Images */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Images</h2>
            <div className="mt-4">
              <div className="flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                    >
                      <span>Upload images</span>
                      <input
                        id="image-upload"
                        name="image-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        className="sr-only"
                        onChange={handleImageUpload}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
              
              {errors.images && <p className="mt-1 text-sm text-red-600 error-message">{errors.images}</p>}
              
              <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                {property.images.map((image) => (
                  <div key={image.id} className="relative">
                    <div className="relative pb-[56.25%] rounded-md overflow-hidden bg-gray-100">
                      <img
                        src={image.url}
                        alt="Property"
                        className="absolute h-full w-full object-cover"
                      />
                      {uploadProgress[image.id] !== undefined && uploadProgress[image.id] < 100 && (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                          <div className="w-full max-w-md px-4">
                            <div className="relative pt-1">
                              <div className="overflow-hidden h-2 text-xs flex rounded bg-primary-200">
                                <div
                                  style={{ width: `${uploadProgress[image.id]}%` }}
                                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
                                ></div>
                              </div>
                              <div className="text-center mt-1 text-xs text-gray-600">
                                {uploadProgress[image.id]}%
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <button
                        type="button"
                        onClick={() => handleSetMainImage(image.id)}
                        className={`p-1 rounded-full ${image.main ? 'bg-green-500 text-white' : 'bg-white text-gray-900 hover:bg-gray-100'}`}
                        title={image.main ? 'Main Image' : 'Set as Main Image'}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(image.id)}
                        className="p-1 bg-white rounded-full text-gray-900 hover:bg-gray-100"
                        title="Remove Image"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {image.main && (
                      <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Main Image
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {getError('property-form') && (
          <div className="mx-6 mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start">
            <FiAlertCircle className="mr-2 mt-0.5 flex-shrink-0" />
            <span>{getError('property-form')}</span>
          </div>
        )}
        
        {/* Image Upload Error */}
        {getError('image-upload') && (
          <div className="mx-6 mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start">
            <FiAlertCircle className="mr-2 mt-0.5 flex-shrink-0" />
            <span>{getError('image-upload')}</span>
          </div>
        )}
        
        <div className="px-6 py-3 bg-gray-50 text-right sm:px-6">
          <button
            type="submit"
            disabled={isLoading('save-property')}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading('save-property') ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Saving...
              </>
            ) : (
              <>
                <FiSave className="-ml-1 mr-2 h-4 w-4" />
                {isEditMode ? 'Update Property' : 'Create Property'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PropertyForm