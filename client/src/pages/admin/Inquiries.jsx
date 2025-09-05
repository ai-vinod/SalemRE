import { useState, useEffect } from 'react'
import { FiMail, FiPhone, FiTrash2, FiSearch, FiFilter, FiChevronLeft, FiChevronRight, FiCheck, FiX, FiEye } from 'react-icons/fi'

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterProperty, setFilterProperty] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedInquiries, setSelectedInquiries] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [inquiryToDelete, setInquiryToDelete] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [currentInquiry, setCurrentInquiry] = useState(null)

  const inquiriesPerPage = 10

  useEffect(() => {
    const fetchInquiries = async () => {
      setLoading(true)
      try {
        // In a real app, you would fetch from your API with pagination
        // const response = await axios.get('/api/admin/inquiries', {
        //   params: {
        //     page: currentPage,
        //     limit: inquiriesPerPage,
        //     search: searchTerm,
        //     status: filterStatus,
        //     property: filterProperty
        //   }
        // })
        // setInquiries(response.data.inquiries)
        // setTotalPages(response.data.totalPages)
        
        // Using dummy data for now
        setTimeout(() => {
          // Generate 30 dummy inquiries
          const dummyInquiries = Array.from({ length: 30 }, (_, i) => {
            const statuses = ['new', 'contacted', 'resolved', 'spam']
            const propertyTypes = ['Apartment', 'Villa', 'Plot', 'Commercial', 'Farm House']
            const locations = ['Hasthampatti', 'Fairlands', 'Alagapuram', 'Suramangalam', 'Shevapet']
            const names = ['Raj Sharma', 'Priya Patel', 'Amit Singh', 'Deepa Kumar', 'Vikram Gupta', 'Neha Reddy', 'Sanjay Iyer', 'Anita Joshi', 'Rahul Nair', 'Meera Mehta']
            const propertyTitle = `${propertyTypes[i % propertyTypes.length]} in ${locations[i % locations.length]}`
            
            return {
              id: i + 1,
              name: names[i % names.length],
              email: `${names[i % names.length].split(' ')[0].toLowerCase()}${i}@example.com`,
              phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
              propertyId: Math.floor(Math.random() * 100) + 1,
              propertyTitle: propertyTitle,
              message: `I am interested in the ${propertyTitle} and would like to schedule a viewing. Please contact me at your earliest convenience.`,
              status: statuses[Math.floor(Math.random() * statuses.length)],
              createdAt: new Date(Date.now() - Math.floor(Math.random() * 7776000000)).toISOString(), // Random date within last 90 days
              updatedAt: new Date(Date.now() - Math.floor(Math.random() * 2592000000)).toISOString() // Random date within last 30 days
            }
          })
          
          // Filter based on search term and filters
          let filteredInquiries = dummyInquiries
          
          if (searchTerm) {
            filteredInquiries = filteredInquiries.filter(inquiry =>
              inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
              inquiry.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
              inquiry.message.toLowerCase().includes(searchTerm.toLowerCase())
            )
          }
          
          if (filterStatus) {
            filteredInquiries = filteredInquiries.filter(inquiry =>
              inquiry.status === filterStatus
            )
          }
          
          if (filterProperty) {
            filteredInquiries = filteredInquiries.filter(inquiry =>
              inquiry.propertyTitle.includes(filterProperty)
            )
          }
          
          // Sort by newest first
          filteredInquiries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          
          // Calculate pagination
          const totalFilteredInquiries = filteredInquiries.length
          const calculatedTotalPages = Math.ceil(totalFilteredInquiries / inquiriesPerPage)
          setTotalPages(calculatedTotalPages || 1)
          
          // Adjust current page if it exceeds the new total pages
          if (currentPage > calculatedTotalPages) {
            setCurrentPage(1)
          }
          
          // Get inquiries for current page
          const startIndex = (currentPage - 1) * inquiriesPerPage
          const paginatedInquiries = filteredInquiries.slice(startIndex, startIndex + inquiriesPerPage)
          
          setInquiries(paginatedInquiries)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error fetching inquiries:', error)
        setLoading(false)
      }
    }

    fetchInquiries()
  }, [currentPage, searchTerm, filterStatus, filterProperty])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Search is already handled by the useEffect dependency
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedInquiries(inquiries.map(inquiry => inquiry.id))
    } else {
      setSelectedInquiries([])
    }
  }

  const handleSelectInquiry = (inquiryId) => {
    if (selectedInquiries.includes(inquiryId)) {
      setSelectedInquiries(selectedInquiries.filter(id => id !== inquiryId))
    } else {
      setSelectedInquiries([...selectedInquiries, inquiryId])
    }
  }

  const handleBulkAction = (action) => {
    // In a real app, you would call your API to perform the bulk action
    // axios.post('/api/admin/inquiries/bulk', { ids: selectedInquiries, action })
    
    // For now, just update the state
    if (action === 'mark-contacted') {
      setInquiries(inquiries.map(inquiry => 
        selectedInquiries.includes(inquiry.id) ? { ...inquiry, status: 'contacted' } : inquiry
      ))
    } else if (action === 'mark-resolved') {
      setInquiries(inquiries.map(inquiry => 
        selectedInquiries.includes(inquiry.id) ? { ...inquiry, status: 'resolved' } : inquiry
      ))
    } else if (action === 'mark-spam') {
      setInquiries(inquiries.map(inquiry => 
        selectedInquiries.includes(inquiry.id) ? { ...inquiry, status: 'spam' } : inquiry
      ))
    } else if (action === 'delete') {
      setInquiries(inquiries.filter(inquiry => !selectedInquiries.includes(inquiry.id)))
    }
    
    setSelectedInquiries([])
  }

  const handleDeleteClick = (inquiry) => {
    setInquiryToDelete(inquiry)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = () => {
    // In a real app, you would call your API to delete the inquiry
    // axios.delete(`/api/admin/inquiries/${inquiryToDelete.id}`)
    
    // For now, just remove it from the state
    setInquiries(inquiries.filter(inquiry => inquiry.id !== inquiryToDelete.id))
    setShowDeleteModal(false)
    setInquiryToDelete(null)
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setInquiryToDelete(null)
  }

  const handleViewInquiry = (inquiry) => {
    setCurrentInquiry(inquiry)
    setShowViewModal(true)
  }

  const handleStatusChange = (inquiryId, newStatus) => {
    // In a real app, you would call your API to update the status
    // axios.patch(`/api/admin/inquiries/${inquiryId}`, { status: newStatus })
    
    // For now, just update the state
    setInquiries(inquiries.map(inquiry => 
      inquiry.id === inquiryId ? { ...inquiry, status: newStatus } : inquiry
    ))
    
    if (currentInquiry && currentInquiry.id === inquiryId) {
      setCurrentInquiry({ ...currentInquiry, status: newStatus })
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800'
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'spam':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div>
              <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="resolved">Resolved</option>
                <option value="spam">Spam</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="filterProperty" className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
              <select
                id="filterProperty"
                value={filterProperty}
                onChange={(e) => setFilterProperty(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">All Properties</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Plot">Plot</option>
                <option value="Commercial">Commercial</option>
                <option value="Farm House">Farm House</option>
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
                placeholder="Search inquiries..."
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
      {selectedInquiries.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <span className="font-medium">{selectedInquiries.length} inquiries</span> selected.
                <button
                  onClick={() => handleBulkAction('mark-contacted')}
                  className="ml-2 font-medium text-yellow-700 underline hover:text-yellow-600"
                >
                  Mark as Contacted
                </button>
                <button
                  onClick={() => handleBulkAction('mark-resolved')}
                  className="ml-2 font-medium text-yellow-700 underline hover:text-yellow-600"
                >
                  Mark as Resolved
                </button>
                <button
                  onClick={() => handleBulkAction('mark-spam')}
                  className="ml-2 font-medium text-yellow-700 underline hover:text-yellow-600"
                >
                  Mark as Spam
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="ml-2 font-medium text-yellow-700 underline hover:text-yellow-600"
                >
                  Delete All
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Inquiries Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No inquiries found. Try adjusting your filters.</p>
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
                        checked={selectedInquiries.length === inquiries.length && inquiries.length > 0}
                        onChange={handleSelectAll}
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inquiries.map((inquiry) => (
                  <tr key={inquiry.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          checked={selectedInquiries.includes(inquiry.id)}
                          onChange={() => handleSelectInquiry(inquiry.id)}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-0">
                          <div className="text-sm font-medium text-gray-900">{inquiry.name}</div>
                          <div className="text-sm text-gray-500">{inquiry.email}</div>
                          <div className="text-sm text-gray-500">{inquiry.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{inquiry.propertyTitle}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">{inquiry.message}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(inquiry.status)}`}>
                        {inquiry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(inquiry.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewInquiry(inquiry)}
                          className="text-gray-400 hover:text-gray-500"
                          title="View Details"
                        >
                          <FiEye />
                        </button>
                        <a
                          href={`mailto:${inquiry.email}`}
                          className="text-blue-400 hover:text-blue-500"
                          title="Send Email"
                        >
                          <FiMail />
                        </a>
                        <a
                          href={`tel:${inquiry.phone}`}
                          className="text-green-400 hover:text-green-500"
                          title="Call"
                        >
                          <FiPhone />
                        </a>
                        <button
                          onClick={() => handleDeleteClick(inquiry)}
                          className="text-red-400 hover:text-red-500"
                          title="Delete"
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
        {!loading && inquiries.length > 0 && (
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
                  Showing <span className="font-medium">{(currentPage - 1) * inquiriesPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * inquiriesPerPage, inquiries.length + (currentPage - 1) * inquiriesPerPage)}</span> of <span className="font-medium">{inquiries.length + (currentPage - 1) * inquiriesPerPage}</span> results
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
                      Delete Inquiry
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this inquiry from {inquiryToDelete?.name}? This action cannot be undone.
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
                >
                  Delete
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

      {/* View Inquiry Modal */}
      {showViewModal && currentInquiry && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        Inquiry Details
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setShowViewModal(false)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(currentInquiry.status)}`}>
                          {currentInquiry.status}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStatusChange(currentInquiry.id, 'new')}
                            className={`px-2 py-1 text-xs rounded ${currentInquiry.status === 'new' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-blue-50'}`}
                          >
                            New
                          </button>
                          <button
                            onClick={() => handleStatusChange(currentInquiry.id, 'contacted')}
                            className={`px-2 py-1 text-xs rounded ${currentInquiry.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800 hover:bg-yellow-50'}`}
                          >
                            Contacted
                          </button>
                          <button
                            onClick={() => handleStatusChange(currentInquiry.id, 'resolved')}
                            className={`px-2 py-1 text-xs rounded ${currentInquiry.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800 hover:bg-green-50'}`}
                          >
                            Resolved
                          </button>
                          <button
                            onClick={() => handleStatusChange(currentInquiry.id, 'spam')}
                            className={`px-2 py-1 text-xs rounded ${currentInquiry.status === 'spam' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800 hover:bg-red-50'}`}
                          >
                            Spam
                          </button>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-500">Contact Information</h4>
                        <p className="mt-1 text-sm text-gray-900">{currentInquiry.name}</p>
                        <div className="mt-1 flex items-center">
                          <a href={`mailto:${currentInquiry.email}`} className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                            <FiMail className="mr-1" /> {currentInquiry.email}
                          </a>
                        </div>
                        <div className="mt-1 flex items-center">
                          <a href={`tel:${currentInquiry.phone}`} className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                            <FiPhone className="mr-1" /> {currentInquiry.phone}
                          </a>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-500">Property</h4>
                        <p className="mt-1 text-sm text-gray-900">{currentInquiry.propertyTitle}</p>
                        <p className="mt-1 text-sm text-gray-500">ID: {currentInquiry.propertyId}</p>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-500">Message</h4>
                        <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">{currentInquiry.message}</p>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-500">Dates</h4>
                        <p className="mt-1 text-sm text-gray-900">Received: {formatDate(currentInquiry.createdAt)}</p>
                        <p className="mt-1 text-sm text-gray-900">Last Updated: {formatDate(currentInquiry.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <a
                  href={`mailto:${currentInquiry.email}`}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <FiMail className="mr-2" /> Reply by Email
                </a>
                <a
                  href={`tel:${currentInquiry.phone}`}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <FiPhone className="mr-2" /> Call
                </a>
                <button
                  type="button"
                  onClick={() => setShowViewModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Inquiries