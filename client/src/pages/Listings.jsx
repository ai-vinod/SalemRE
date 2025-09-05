import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiFilter, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import PropertyCard from '../components/PropertyCard'
import { propertyService } from '../services'
import { useApi } from '../hooks'
import { useLoading, useError } from '../contexts'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const Listings = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [properties, setProperties] = useState([])
  const { isLoading } = useLoading()
  const { getError } = useError()
  const { request } = useApi()
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    location: searchParams.get('location') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minSize: searchParams.get('minSize') || '',
    maxSize: searchParams.get('maxSize') || ''
  })
  const [sortBy, setSortBy] = useState('newest')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [expandedFilters, setExpandedFilters] = useState({
    type: true,
    location: true,
    price: true,
    size: true
  })

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Construct query params for API call
        const params = {}
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params[key] = value
        })
        params.sortBy = sortBy

        const data = await request('properties', () => propertyService.getProperties(params))
        setProperties(data.properties || [])
      } catch (error) {
        console.error('Error fetching properties:', error)
        // Fallback to empty array if error occurs
        setProperties([])
      }
    }

    fetchProperties()
  }, [filters, sortBy, request])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))

    // Update URL search params
    const newSearchParams = new URLSearchParams(searchParams)
    if (value) {
      newSearchParams.set(name, value)
    } else {
      newSearchParams.delete(name)
    }
    setSearchParams(newSearchParams)
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
  }

  const clearFilters = () => {
    setFilters({
      type: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      minSize: '',
      maxSize: ''
    })
    setSearchParams({})
  }

  const toggleFilter = (filterName) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }))
  }

  const propertyTypes = [
    { id: '', name: 'All Types' },
    { id: 'plot', name: 'Plots' },
    { id: 'apartment', name: 'Apartments' },
    { id: 'house', name: 'Houses' },
    { id: 'commercial', name: 'Commercial' }
  ]

  const locations = [
    { id: '', name: 'All Locations' },
    { id: 'Ammapet', name: 'Ammapet' },
    { id: 'Fairlands', name: 'Fairlands' },
    { id: 'Hasthampatti', name: 'Hasthampatti' },
    { id: 'Junction', name: 'Junction' },
    { id: 'Shevapet', name: 'Shevapet' },
    { id: 'Suramangalam', name: 'Suramangalam' }
  ]

  const priceRanges = [
    { min: '', max: '', name: 'Any Price' },
    { min: '', max: '1000000', name: 'Under ₹10 Lakhs' },
    { min: '', max: '2500000', name: 'Under ₹25 Lakhs' },
    { min: '', max: '5000000', name: 'Under ₹50 Lakhs' },
    { min: '', max: '10000000', name: 'Under ₹1 Crore' },
    { min: '10000000', max: '', name: 'Above ₹1 Crore' }
  ]

  const sizeRanges = [
    { min: '', max: '', name: 'Any Size' },
    { min: '', max: '1000', name: 'Under 1000 sq.ft' },
    { min: '1000', max: '2000', name: '1000-2000 sq.ft' },
    { min: '2000', max: '3000', name: '2000-3000 sq.ft' },
    { min: '3000', max: '', name: 'Above 3000 sq.ft' }
  ]

  const sortOptions = [
    { id: 'newest', name: 'Newest First' },
    { id: 'price_low', name: 'Price: Low to High' },
    { id: 'price_high', name: 'Price: High to Low' },
    { id: 'size_low', name: 'Size: Small to Large' },
    { id: 'size_high', name: 'Size: Large to Small' }
  ]

  return (
    <div className="bg-gray-50 py-10">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Properties in Salem</h1>
          <p className="text-gray-600">
            Discover premium plots and properties in Salem, Tamil Nadu
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Mobile Filters Toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-md shadow-sm border border-gray-200"
            >
              <div className="flex items-center">
                <FiFilter className="mr-2" />
                <span>Filters</span>
              </div>
              {mobileFiltersOpen ? <FiChevronUp /> : <FiChevronDown />}
            </button>
          </div>

          {/* Filters Sidebar */}
          <div
            className={`${mobileFiltersOpen ? 'block' : 'hidden'} lg:block lg:col-span-1`}
          >
            <div className="bg-white rounded-lg shadow-sm p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Clear All
                </button>
              </div>

              {/* Property Type Filter */}
              <div className="mb-6 border-b border-gray-200 pb-6">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleFilter('type')}
                >
                  <h3 className="text-md font-medium">Property Type</h3>
                  {expandedFilters.type ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                {expandedFilters.type && (
                  <div className="mt-4 space-y-2">
                    {propertyTypes.map((type) => (
                      <div key={type.id} className="flex items-center">
                        <input
                          type="radio"
                          id={`type-${type.id}`}
                          name="type"
                          value={type.id}
                          checked={filters.type === type.id}
                          onChange={handleFilterChange}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                        />
                        <label
                          htmlFor={`type-${type.id}`}
                          className="ml-3 text-sm text-gray-700"
                        >
                          {type.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Location Filter */}
              <div className="mb-6 border-b border-gray-200 pb-6">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleFilter('location')}
                >
                  <h3 className="text-md font-medium">Location</h3>
                  {expandedFilters.location ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                {expandedFilters.location && (
                  <div className="mt-4">
                    <select
                      name="location"
                      value={filters.location}
                      onChange={handleFilterChange}
                      className="form-input"
                    >
                      {locations.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Price Filter */}
              <div className="mb-6 border-b border-gray-200 pb-6">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleFilter('price')}
                >
                  <h3 className="text-md font-medium">Price Range</h3>
                  {expandedFilters.price ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                {expandedFilters.price && (
                  <div className="mt-4 space-y-2">
                    {priceRanges.map((range, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="radio"
                          id={`price-${index}`}
                          name="priceRange"
                          checked={
                            filters.minPrice === range.min && filters.maxPrice === range.max
                          }
                          onChange={() => {
                            setFilters(prev => ({
                              ...prev,
                              minPrice: range.min,
                              maxPrice: range.max
                            }))
                            
                            // Update URL search params
                            const newSearchParams = new URLSearchParams(searchParams)
                            if (range.min) {
                              newSearchParams.set('minPrice', range.min)
                            } else {
                              newSearchParams.delete('minPrice')
                            }
                            if (range.max) {
                              newSearchParams.set('maxPrice', range.max)
                            } else {
                              newSearchParams.delete('maxPrice')
                            }
                            setSearchParams(newSearchParams)
                          }}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                        />
                        <label
                          htmlFor={`price-${index}`}
                          className="ml-3 text-sm text-gray-700"
                        >
                          {range.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Size Filter */}
              <div className="mb-6">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleFilter('size')}
                >
                  <h3 className="text-md font-medium">Property Size</h3>
                  {expandedFilters.size ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                {expandedFilters.size && (
                  <div className="mt-4 space-y-2">
                    {sizeRanges.map((range, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="radio"
                          id={`size-${index}`}
                          name="sizeRange"
                          checked={
                            filters.minSize === range.min && filters.maxSize === range.max
                          }
                          onChange={() => {
                            setFilters(prev => ({
                              ...prev,
                              minSize: range.min,
                              maxSize: range.max
                            }))
                            
                            // Update URL search params
                            const newSearchParams = new URLSearchParams(searchParams)
                            if (range.min) {
                              newSearchParams.set('minSize', range.min)
                            } else {
                              newSearchParams.delete('minSize')
                            }
                            if (range.max) {
                              newSearchParams.set('maxSize', range.max)
                            } else {
                              newSearchParams.delete('maxSize')
                            }
                            setSearchParams(newSearchParams)
                          }}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                        />
                        <label
                          htmlFor={`size-${index}`}
                          className="ml-3 text-sm text-gray-700"
                        >
                          {range.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="lg:col-span-3">
            {/* Sort Controls */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-4 sm:mb-0">
                <p className="text-gray-600">
                  Showing <span className="font-medium">{properties.length}</span> properties
                </p>
              </div>
              <div className="flex items-center">
                <label htmlFor="sort" className="text-sm text-gray-700 mr-2">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={handleSortChange}
                  className="form-input py-1 pl-3 pr-10 text-sm"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Properties */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : getError('properties') ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading properties</h3>
                <p className="text-gray-600 mb-6">{getError('properties')}</p>
                <button onClick={clearFilters} className="btn btn-primary">Try Again</button>
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No properties found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters to find properties that match your criteria.
                </p>
                <button
                  onClick={clearFilters}
                  className="btn btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination - To be implemented */}
            {properties.length > 0 && (
              <div className="mt-8 flex justify-center">
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
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    3
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default Listings