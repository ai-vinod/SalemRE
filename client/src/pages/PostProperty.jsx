import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FiUpload, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'
import axios from 'axios'

const PostProperty = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: '',
    price: '',
    size: '',
    location: '',
    address: '',
    features: []
  })
  const [images, setImages] = useState([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [step, setStep] = useState(1)

  const propertyTypes = [
    { id: 'plot', name: 'Plot' },
    { id: 'apartment', name: 'Apartment' },
    { id: 'house', name: 'House' },
    { id: 'commercial', name: 'Commercial' }
  ]

  const locations = [
    { id: 'Ammapet', name: 'Ammapet' },
    { id: 'Fairlands', name: 'Fairlands' },
    { id: 'Hasthampatti', name: 'Hasthampatti' },
    { id: 'Junction', name: 'Junction' },
    { id: 'Shevapet', name: 'Shevapet' },
    { id: 'Suramangalam', name: 'Suramangalam' },
    { id: 'Other', name: 'Other' }
  ]

  const featureOptions = [
    'Corner Plot',
    'East Facing',
    'West Facing',
    'North Facing',
    'South Facing',
    'Near to Schools',
    'Near to Hospitals',
    'Near to Shopping Centers',
    'Good Road Access',
    'Clear Title',
    'All Approvals',
    'Electricity Connection Available',
    'Water Connection Available',
    'Gated Community',
    'Security',
    'Parking',
    'Garden',
    'Swimming Pool',
    'Gym',
    'Elevator',
    'Power Backup'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFeatureToggle = (feature) => {
    setFormData(prev => {
      const features = [...prev.features]
      if (features.includes(feature)) {
        return {
          ...prev,
          features: features.filter(f => f !== feature)
        }
      } else {
        return {
          ...prev,
          features: [...features, feature]
        }
      }
    })
  }

  const handleImageChange = (e) => {
    e.preventDefault()
    
    const files = Array.from(e.target.files)
    
    // Limit to 5 images
    if (images.length + files.length > 5) {
      setError('You can upload a maximum of 5 images')
      return
    }
    
    setError('')
    
    // Preview images
    const newImagePreviewUrls = [...imagePreviewUrls]
    const newImages = [...images]
    
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        newImagePreviewUrls.push(reader.result)
        setImagePreviewUrls([...newImagePreviewUrls])
      }
      reader.readAsDataURL(file)
      newImages.push(file)
    })
    
    setImages(newImages)
  }

  const removeImage = (index) => {
    const newImages = [...images]
    const newImagePreviewUrls = [...imagePreviewUrls]
    
    newImages.splice(index, 1)
    newImagePreviewUrls.splice(index, 1)
    
    setImages(newImages)
    setImagePreviewUrls(newImagePreviewUrls)
  }

  const validateStep1 = () => {
    if (!formData.title.trim()) {
      setError('Title is required')
      return false
    }
    if (!formData.property_type) {
      setError('Property type is required')
      return false
    }
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      setError('Valid price is required')
      return false
    }
    if (!formData.size || isNaN(formData.size) || Number(formData.size) <= 0) {
      setError('Valid size is required')
      return false
    }
    if (!formData.location) {
      setError('Location is required')
      return false
    }
    setError('')
    return true
  }

  const validateStep2 = () => {
    if (!formData.description.trim()) {
      setError('Description is required')
      return false
    }
    if (!formData.address.trim()) {
      setError('Address is required')
      return false
    }
    if (formData.features.length === 0) {
      setError('Please select at least one feature')
      return false
    }
    setError('')
    return true
  }

  const validateStep3 = () => {
    if (images.length === 0) {
      setError('Please upload at least one image')
      return false
    }
    setError('')
    return true
  }

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    }
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateStep3()) {
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      // In a real app, you would upload images to Cloudinary and then send property data to your backend
      // For now, we'll just simulate success
      
      // const formDataToSend = new FormData()
      // formDataToSend.append('title', formData.title)
      // formDataToSend.append('description', formData.description)
      // formDataToSend.append('property_type', formData.property_type)
      // formDataToSend.append('price', formData.price)
      // formDataToSend.append('size', formData.size)
      // formDataToSend.append('location', formData.location)
      // formDataToSend.append('address', formData.address)
      // formDataToSend.append('features', JSON.stringify(formData.features))
      // 
      // images.forEach(image => {
      //   formDataToSend.append('images', image)
      // })
      // 
      // const response = await axios.post('/api/properties', formDataToSend, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      // })
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSuccess(true)
      
      // Reset form after successful submission
      setTimeout(() => {
        navigate('/my-properties')
      }, 2000)
      
    } catch (err) {
      console.error('Error posting property:', err)
      setError(err.response?.data?.message || 'Failed to post property. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderStep1 = () => (
    <div>
      <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
      
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Property Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="form-input"
          placeholder="e.g. Premium Plot in Ammapet"
          required
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="property_type" className="block text-sm font-medium text-gray-700 mb-1">
          Property Type *
        </label>
        <select
          id="property_type"
          name="property_type"
          value={formData.property_type}
          onChange={handleChange}
          className="form-input"
          required
        >
          <option value="">Select Property Type</option>
          {propertyTypes.map(type => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price (₹) *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g. 2500000"
            required
          />
        </div>
        
        <div>
          <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
            Size (sq.ft) *
          </label>
          <input
            type="number"
            id="size"
            name="size"
            value={formData.size}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g. 1200"
            required
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          Location *
        </label>
        <select
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="form-input"
          required
        >
          <option value="">Select Location</option>
          {locations.map(location => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div>
      <h2 className="text-xl font-semibold mb-6">Property Details</h2>
      
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className="form-input"
          placeholder="Describe your property in detail..."
          required
        ></textarea>
      </div>
      
      <div className="mb-4">
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Full Address *
        </label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows="2"
          className="form-input"
          placeholder="Enter the complete address of the property"
          required
        ></textarea>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Features *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {featureOptions.map(feature => (
            <div key={feature} className="flex items-center">
              <input
                type="checkbox"
                id={`feature-${feature}`}
                checked={formData.features.includes(feature)}
                onChange={() => handleFeatureToggle(feature)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor={`feature-${feature}`} className="ml-2 text-sm text-gray-700">
                {feature}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div>
      <h2 className="text-xl font-semibold mb-6">Upload Images</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Images *
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label htmlFor="images" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none">
                <span>Upload images</span>
                <input 
                  id="images" 
                  name="images" 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="sr-only" 
                  onChange={handleImageChange} 
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF up to 5MB (max 5 images)
            </p>
          </div>
        </div>
      </div>
      
      {imagePreviewUrls.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Image Previews:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {imagePreviewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img 
                  src={url} 
                  alt={`Preview ${index + 1}`} 
                  className="h-24 w-full object-cover rounded-md" 
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="bg-gray-50 py-10">
      <div className="container max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post Your Property</h1>
          <p className="text-gray-600">
            Fill in the details below to list your property on Salem Real Estate
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className={`h-2 ${step >= 1 ? 'bg-primary-500' : 'bg-gray-200'} rounded-l-full`}></div>
            </div>
            <div className="flex-1">
              <div className={`h-2 ${step >= 2 ? 'bg-primary-500' : 'bg-gray-200'}`}></div>
            </div>
            <div className="flex-1">
              <div className={`h-2 ${step >= 3 ? 'bg-primary-500' : 'bg-gray-200'} rounded-r-full`}></div>
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <div className={`text-sm ${step >= 1 ? 'text-primary-600 font-medium' : 'text-gray-500'}`}>Basic Info</div>
            <div className={`text-sm ${step >= 2 ? 'text-primary-600 font-medium' : 'text-gray-500'}`}>Property Details</div>
            <div className={`text-sm ${step >= 3 ? 'text-primary-600 font-medium' : 'text-gray-500'}`}>Images</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-start">
              <FiAlertCircle className="mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 flex items-start">
              <FiCheckCircle className="mr-2 mt-0.5 flex-shrink-0" />
              <span>Property posted successfully! Redirecting to your properties...</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  Previous
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn btn-primary ml-auto"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary ml-auto"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Posting Property...
                    </>
                  ) : 'Post Property'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PostProperty