import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';

// All dependencies (contexts, hooks, services, and components) are included in this single file.

// --- Contexts and Hooks ---

// AuthContext
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// LoadingContext
const LoadingContext = createContext(null);
export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState({});

  const setLoading = useCallback((key, state) => {
    setLoadingStates(prev => ({ ...prev, [key]: state }));
  }, []);

  const clearLoading = useCallback((key) => {
    setLoadingStates(prev => {
      const newStates = { ...prev };
      delete newStates[key];
      return newStates;
    });
  }, []);

  const isLoading = useCallback((key) => {
    return !!loadingStates[key];
  }, [loadingStates]);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading, clearLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

// ErrorContext
const ErrorContext = createContext(null);
export const useError = () => useContext(ErrorContext);

export const ErrorProvider = ({ children }) => {
  const [errors, setErrors] = useState({});

  const setError = useCallback((key, message) => {
    setErrors(prev => ({ ...prev, [key]: message }));
  }, []);

  const clearError = useCallback((key) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
  }, []);

  const getError = useCallback((key) => {
    return errors[key];
  }, [errors]);

  return (
    <ErrorContext.Provider value={{ getError, setError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
};

// useApi hook (a simplified mock version)
export const useApi = () => {
  const { setError, clearError } = useError();
  const { setLoading } = useLoading();

  const request = useCallback(async (apiCall, loadingKey) => {
    try {
      clearError(loadingKey);
      setLoading(loadingKey, true);
      const result = await apiCall();
      return result;
    } catch (err) {
      console.error('API Error:', err);
      setError(loadingKey, err.message || 'An unexpected error occurred.');
      throw err;
    } finally {
      setLoading(loadingKey, false);
    }
  }, [setError, clearError, setLoading]);

  return { request };
};

// --- Services (Mocked) ---

const propertyService = {
  createProperty: async (propertyData) => {
    console.log('Posting property...', propertyData);
    // Removed the simulated delay to prevent flickering
    if (propertyData.title.includes('error')) {
      throw new Error('Server error during property creation.');
    }
    return { success: true, message: 'Property created successfully' };
  },
};

const uploadService = {
  uploadPropertyImages: async (formData) => {
    console.log('Uploading images...');
    // Removed the simulated delay to prevent flickering
    const mockUrl = `https://placehold.co/600x400/000000/FFFFFF?text=PropertyImage`;
    return { url: mockUrl };
  },
};

// --- UI Components ---

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClass = size === 'sm' ? 'h-4 w-4' : 'h-8 w-8';
  return (
    <div className={`inline-block ${className}`}>
      <svg className={`animate-spin ${sizeClass} text-indigo-500`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  );
};

// Inline SVG Icons to replace external libraries
const UploadIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const AlertCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Trash2Icon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.013 21H7.987a2 2 0 01-1.92-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

// --- Page Components (Mocking routing with state) ---

const PostPropertyPage = ({ onNavigate }) => {
  const { user } = useAuth();
  const { isLoading, setLoading } = useLoading();
  const { getError, setError, clearError } = useError();
  const { request } = useApi();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: '',
    price: '',
    size: '',
    location: '',
    address: '',
    features: []
  });
  const [images, setImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);

  const propertyTypes = [
    { id: 'plot', name: 'Plot' },
    { id: 'apartment', name: 'Apartment' },
    { id: 'house', name: 'House' },
    { id: 'commercial', name: 'Commercial' }
  ];

  const locations = [
    { id: 'Ammapet', name: 'Ammapet' },
    { id: 'Fairlands', name: 'Fairlands' },
    { id: 'Hasthampatti', name: 'Hasthampatti' },
    { id: 'Junction', name: 'Junction' },
    { id: 'Shevapet', name: 'Shevapet' },
    { id: 'Suramangalam', name: 'Suramangalam' },
    { id: 'Other', name: 'Other' }
  ];

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
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => {
      const features = [...prev.features];
      if (features.includes(feature)) {
        return {
          ...prev,
          features: features.filter(f => f !== feature)
        };
      } else {
        return {
          ...prev,
          features: [...features, feature]
        };
      }
    });
  };

  const handleImageChange = (e) => {
    e.preventDefault();

    const files = Array.from(e.target.files);

    if (images.length + files.length > 5) {
      setError('property-form', 'You can upload a maximum of 5 images');
      return;
    }

    clearError('property-form');

    const newImagePreviewUrls = [...imagePreviewUrls];
    const newImages = [...images];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImagePreviewUrls.push(reader.result);
        setImagePreviewUrls([...newImagePreviewUrls]);
      };
      reader.readAsDataURL(file);
      newImages.push(file);
    });

    setImages(newImages);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newImagePreviewUrls = [...imagePreviewUrls];

    newImages.splice(index, 1);
    newImagePreviewUrls.splice(index, 1);

    setImages(newImages);
    setImagePreviewUrls(newImagePreviewUrls);
  };

  const validateStep1 = () => {
    clearError('property-form');
    if (!formData.title.trim()) {
      setError('property-form', 'Title is required');
      return false;
    }
    if (!formData.property_type) {
      setError('property-form', 'Property type is required');
      return false;
    }
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      setError('property-form', 'Valid price is required');
      return false;
    }
    if (!formData.size || isNaN(formData.size) || Number(formData.size) <= 0) {
      setError('property-form', 'Valid size is required');
      return false;
    }
    if (!formData.location) {
      setError('property-form', 'Location is required');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    clearError('property-form');
    if (!formData.description.trim()) {
      setError('property-form', 'Description is required');
      return false;
    }
    if (!formData.address.trim()) {
      setError('property-form', 'Address is required');
      return false;
    }
    if (formData.features.length === 0) {
      setError('property-form', 'Please select at least one feature');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    clearError('property-form');
    if (images.length === 0) {
      setError('property-form', 'Please upload at least one image');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep3()) {
      return;
    }

    clearError('property-form');

    try {
      setLoading('upload-images', true);
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const imageFormData = new FormData();
          imageFormData.append('image', image);
          const uploadResult = await request(
            () => uploadService.uploadPropertyImages(imageFormData),
            'upload-images'
          );
          return uploadResult.url;
        })
      );
      setLoading('upload-images', false);

      setLoading('create-property', true);
      const propertyData = {
        ...formData,
        price: Number(formData.price),
        size: Number(formData.size),
        images: imageUrls,
      };

      await request(() => propertyService.createProperty(propertyData), 'create-property');
      setLoading('create-property', false);

      setSuccess(true);

      setTimeout(() => {
        onNavigate('my-properties');
      }, 2000);

    } catch (err) {
      console.error('Error posting property:', err);
      setError('property-form', err.message || 'Failed to post property. Please try again.');
    }
  };

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
              <div className={`h-2 ${step >= 1 ? 'bg-indigo-500' : 'bg-gray-200'} rounded-l-full`}></div>
            </div>
            <div className="flex-1">
              <div className={`h-2 ${step >= 2 ? 'bg-indigo-500' : 'bg-gray-200'}`}></div>
            </div>
            <div className="flex-1">
              <div className={`h-2 ${step >= 3 ? 'bg-indigo-500' : 'bg-gray-200'} rounded-r-full`}></div>
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <div className={`text-sm ${step >= 1 ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>Basic Info</div>
            <div className={`text-sm ${step >= 2 ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>Property Details</div>
            <div className={`text-sm ${step >= 3 ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>Images</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          {getError('property-form') && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-start">
              <AlertCircleIcon className="mr-2 mt-0.5 flex-shrink-0 h-5 w-5" />
              <span>{getError('property-form')}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 flex items-start">
              <CheckCircleIcon className="mr-2 mt-0.5 flex-shrink-0 h-5 w-5" />
              <span>Property posted successfully! Redirecting to your properties...</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 && (
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
                    className="form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                    className="form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                      className="form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                      className="form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                    className="form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
            )}
            {step === 2 && (
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
                    className="form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                    className="form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`feature-${feature}`} className="ml-2 text-sm text-gray-700">
                          {feature}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Upload Images</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Images *
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="images" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
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
                            <Trash2Icon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  disabled={isLoading('upload-images') || isLoading('create-property')}
                >
                  Previous
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={isLoading('upload-images') || isLoading('create-property')}
                >
                  {isLoading('upload-images') || isLoading('create-property') ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      {isLoading('upload-images') ? 'Uploading Images...' : 'Posting Property...'}
                    </>
                  ) : 'Post Property'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const LoginPage = ({ onNavigate }) => {
  useEffect(() => {
    // In a real app, you would handle a login form here.
    // For this mock, we'll just show a message.
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-sm p-8 max-w-sm text-center">
        <h2 className="text-2xl font-bold mb-4">Mock Login Page</h2>
        <p className="text-gray-600 mb-6">
          You must be authenticated to post a property.
        </p>
        <button
          onClick={() => onNavigate('post-property')}
          className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Go to Post Property Page
        </button>
      </div>
    </div>
  );
};

const MyPropertiesPage = ({ onNavigate }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-sm p-8 max-w-sm text-center">
        <h2 className="text-2xl font-bold mb-4">My Properties</h2>
        <p className="text-gray-600 mb-6">
          This is a placeholder for the "My Properties" page.
        </p>
        <button
          onClick={() => onNavigate('post-property')}
          className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Go Back to Post Property
        </button>
      </div>
    </div>
  );
};

// Top-level App Component to wrap the providers and handle routing
const App = () => {
  const [appState, setAppState] = useState({
    user: null,
    view: 'post-property',
  });

  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Auth simulation and state management
  useEffect(() => {
    const authCheck = async () => {
      // The previous code had a simulated delay here which caused the flicker.
      // We've removed it for a smoother, more realistic user experience.
      
      const mockUser = { id: 'mock-user-123', email: 'user@example.com' };
      
      if (mockUser) {
        setAppState({
          user: mockUser,
          view: 'post-property',
        });
      } else {
        setAppState({
          user: null,
          view: 'login',
        });
      }
      setIsAuthChecked(true);
    };
    
    authCheck();
  }, []);

  const handleNavigate = (page) => {
    setAppState(prev => ({ ...prev, view: page }));
  };

  const renderPage = () => {
    switch (appState.view) {
      case 'post-property':
        return <PostPropertyPage onNavigate={handleNavigate} />;
      case 'my-properties':
        return <MyPropertiesPage onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      default:
        return null;
    }
  };

  if (!isAuthChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user: appState.user }}>
      <ErrorProvider>
        <LoadingProvider>
          {renderPage()}
        </LoadingProvider>
      </ErrorProvider>
    </AuthContext.Provider>
  );
};

export default App;
