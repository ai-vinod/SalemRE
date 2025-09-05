import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiSearch, FiFilter, FiChevronLeft, FiChevronRight, FiAlertCircle } from 'react-icons/fi'
import { useLoading, useError } from '../../contexts/LoadingContext'
import { useApi } from '../../hooks/useApi'
import propertyService from '../../services/propertyService'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const Properties = () => {
  const { isLoading, setLoading, clearLoading } = useLoading()
  const { getError, setError, clearError } = useError()
  const { request } = useApi()
  
  const [properties, setProperties] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedProperties, setSelectedProperties] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [propertyToDelete, setPropertyToDelete] = useState(null)

  const propertiesPerPage = 10

  useEffect(() => {
    const fetchProperties = async () => {
      clearError('admin-properties')
      setLoading('admin-properties', true)
      
      try {
        const params = {
          page: currentPage,
          limit: propertiesPerPage,
          search: searchTerm || undefined,
          type: filterType || undefined,
          status: filterStatus || undefined
        }
        
        const result = await request(
          async () => await propertyService.getProperties(params),
          'admin-properties'
        )
        
        setProperties(result.properties || [])
        setTotalPages(result.totalPages || 1)
      } catch (error) {
        console.error('Error fetching properties:', error)
        setProperties([])
        setTotalPages(1)
      } finally {
        clearLoading('admin-properties')
      }
      catch (error) {
        console.error('Error fetching properties:', error)
        setProperties([])
        setTotalPages(1)
      } finally {
        clearLoading('admin-properties')
      }
    }

    fetchProperties()
  }, [currentPage, searchTerm, filterType, filterStatus])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Search is already handled by the useEffect dependency
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProperties(properties.map(property => property.id))
    } else {
      setSelectedProperties([])
    }
  }

  const handleSelectProperty = (propertyId) => {
    if (selectedProperties.includes(propertyId)) {
      setSelectedProperties(selectedProperties.filter(id => id !== propertyId))
    } else {
      setSelectedProperties([...selectedProperties, propertyId])
    }
  }

  const handleBulkDelete = async () => {
    if (selectedProperties.length === 0) return;
    
    clearError('bulk-delete')
    setLoading('bulk-delete', true)
    
    try {
      // Delete properties one by one
      await Promise.all(
        selectedProperties.map(id => 
          request(
            async () => await propertyService.deleteProperty(id),
            `delete-property-${id}`
          )
        )
      )
      
      // Update local state after successful deletion
      setProperties(properties.filter(p => !selectedProperties.includes(p.id)))
      setSelectedProperties([])
      
      // Success is handled by the API service
    } catch (error) {
      console.error('Error deleting properties:', error)
      setError('bulk-delete', 'Failed to delete some properties. Please try again.')
    } finally {
      clearLoading('bulk-delete')
    }
  }

  const handleDeleteClick = (property) => {
    setPropertyToDelete(property)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    clearError('delete-property')
    setLoading('delete-property', true)
    
    try {
      await request(
        async () => await propertyService.deleteProperty(propertyToDelete.id),
        'delete-property'
      )
      
      // Update local state after successful deletion
      setProperties(properties.filter(property => property.id !== propertyToDelete.id))
      setSelectedProperties(selectedProperties.filter(id => id !== propertyToDelete.id))
      setShowDeleteModal(false)
      setPropertyToDelete(null)
      
      // Success is handled by the API service
    } catch (error) {
      console.error('Error deleting property:', error)
      setError('delete-property', 'Failed to delete property. Please try again.')
    } finally {
      clearLoading('delete-property')
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setPropertyToDelete(null)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
        <Link to="/admin/properties/new" className="btn btn-primary">
          <FiPlus className="mr-2" /> Add New Property
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div>
              <label htmlFor="filterType" className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
              <select
                id="filterType"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">All Types</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Plot">Plot</option>
                <option value="Commercial">Commercial</option>
                <option value="Farm House">Farm House</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>
          
          <form onSubmit={handleSearch} className="flex w-full md:w-auto">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search properties..."
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
      {selectedProperties.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <span className="font-medium">{selectedProperties.length} properties</span> selected.
                <button
                  onClick={handleBulkDelete}
                  className="ml-2 font-medium text-yellow-700 underline hover:text-yellow-600"
                  disabled={isLoading('bulk-delete')}
                >
                  {isLoading('bulk-delete') ? (
                    <>
                      <LoadingSpinner size="sm" className="inline mr-1" />
                      Deleting...
                    </>
                  ) : 'Delete All'}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Messages */}
      {getError('admin-properties') && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-start">
          <FiAlertCircle className="mr-2 mt-0.5 flex-shrink-0" />
          <span>{getError('admin-properties')}</span>
        </div>
      )}
      
      {getError('delete-property') && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-start">
          <FiAlertCircle className="mr-2 mt-0.5 flex-shrink-0" />
          <span>{getError('delete-property')}</span>
        </div>
      )}
      
      {getError('bulk-delete') && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-start">
          <FiAlertCircle className="mr-2 mt-0.5 flex-shrink-0" />
          <span>{getError('bulk-delete')}</span>
        </div>
      )}
      
      {/* Properties Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {isLoading('admin-properties') ? (
          <div className="p-6 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : properties.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No properties found. Try adjusting your filters or add a new property.</p>
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
                        checked={selectedProperties.length === properties.length && properties.length > 0}
                        onChange={handleSelectAll}
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Added
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {properties.map((property) => (
                  <tr key={property.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          checked={selectedProperties.includes(property.id)}
                          onChange={() => handleSelectProperty(property.id)}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-md"></div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{property.title}</div>
                          <div className="text-sm text-gray-500">{property.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{property.type}</div>
                      <div className="text-sm text-gray-500">
                        {property.bedrooms > 0 && `${property.bedrooms} bed${property.bedrooms > 1 ? 's' : ''}`}
                        {property.bedrooms > 0 && property.bathrooms > 0 && ' • '}
                        {property.bathrooms > 0 && `${property.bathrooms} bath${property.bathrooms > 1 ? 's' : ''}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatPrice(property.price)}</div>
                      <div className="text-sm text-gray-500">{property.area} sq.ft</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${property.status === 'active' ? 'bg-green-100 text-green-800' : property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                        {property.status}
                      </span>
                      {property.featured && (
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {property.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/properties/${property.id}`} className="text-gray-400 hover:text-gray-500" title="View">
                          <FiEye />
                        </Link>
                        <Link to={`/admin/properties/${property.id}/edit`} className="text-blue-400 hover:text-blue-500" title="Edit">
                          <FiEdit2 />
                        </Link>
                        <button
              onClick={() => handleDeleteClick(property)}
              className="text-red-400 hover:text-red-500"
              title="Delete"
              disabled={isLoading('bulk-delete')}
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
        {!isLoading('admin-properties') && properties.length > 0 && (
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
                  Showing <span className="font-medium">{properties.length > 0 ? (currentPage - 1) * propertiesPerPage + 1 : 0}</span> to <span className="font-medium">{Math.min(currentPage * propertiesPerPage, properties.length + (currentPage - 1) * propertiesPerPage)}</span> of <span className="font-medium">{properties.length + (currentPage - 1) * propertiesPerPage}</span> results
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
                      Delete Property
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete the property "{propertyToDelete?.title}"? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                type="button"
                onClick={handleDeleteConfirm}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                disabled={isLoading('delete-property')}
              >
                {isLoading('delete-property') ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Deleting...
                  </>
                ) : 'Delete'}
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

export default Properties