import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiEdit2, FiTrash2, FiSearch, FiFilter, FiChevronLeft, FiChevronRight, FiMail, FiLock, FiUserCheck, FiUserX } from 'react-icons/fi'

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [showActionModal, setShowActionModal] = useState(false)
  const [actionType, setActionType] = useState('')
  const [userToAction, setUserToAction] = useState(null)

  const usersPerPage = 10

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        // In a real app, you would fetch from your API with pagination
        // const response = await axios.get('/api/admin/users', {
        //   params: {
        //     page: currentPage,
        //     limit: usersPerPage,
        //     search: searchTerm,
        //     role: filterRole,
        //     status: filterStatus
        //   }
        // })
        // setUsers(response.data.users)
        // setTotalPages(response.data.totalPages)
        
        // Using dummy data for now
        setTimeout(() => {
          // Generate 30 dummy users
          const dummyUsers = Array.from({ length: 30 }, (_, i) => {
            const roles = ['user', 'agent', 'admin']
            const statuses = ['active', 'inactive', 'pending']
            const firstNames = ['Raj', 'Priya', 'Amit', 'Deepa', 'Vikram', 'Neha', 'Sanjay', 'Anita', 'Rahul', 'Meera']
            const lastNames = ['Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Reddy', 'Iyer', 'Joshi', 'Nair', 'Mehta']
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
            
            return {
              id: i + 1,
              name: `${firstName} ${lastName}`,
              email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
              role: i === 0 ? 'admin' : roles[Math.floor(Math.random() * (roles.length - 1)) + 1], // First user is admin, rest are random
              status: statuses[Math.floor(Math.random() * statuses.length)],
              properties: Math.floor(Math.random() * 10),
              inquiries: Math.floor(Math.random() * 20),
              lastLogin: i < 20 ? new Date(Date.now() - Math.floor(Math.random() * 604800000)).toISOString() : null, // Random date within last week for first 20 users
              createdAt: new Date(Date.now() - Math.floor(Math.random() * 31536000000)).toISOString().split('T')[0] // Random date within last year
            }
          })
          
          // Filter based on search term and filters
          let filteredUsers = dummyUsers
          
          if (searchTerm) {
            filteredUsers = filteredUsers.filter(user =>
              user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
          }
          
          if (filterRole) {
            filteredUsers = filteredUsers.filter(user =>
              user.role === filterRole
            )
          }
          
          if (filterStatus) {
            filteredUsers = filteredUsers.filter(user =>
              user.status === filterStatus
            )
          }
          
          // Sort by newest first
          filteredUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          
          // Calculate pagination
          const totalFilteredUsers = filteredUsers.length
          const calculatedTotalPages = Math.ceil(totalFilteredUsers / usersPerPage)
          setTotalPages(calculatedTotalPages || 1)
          
          // Adjust current page if it exceeds the new total pages
          if (currentPage > calculatedTotalPages) {
            setCurrentPage(1)
          }
          
          // Get users for current page
          const startIndex = (currentPage - 1) * usersPerPage
          const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage)
          
          setUsers(paginatedUsers)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error fetching users:', error)
        setLoading(false)
      }
    }

    fetchUsers()
  }, [currentPage, searchTerm, filterRole, filterStatus])

  const formatDate = (dateString) => {
    if (!dateString) return 'Never'
    
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
      setSelectedUsers(users.map(user => user.id))
    } else {
      setSelectedUsers([])
    }
  }

  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  const handleBulkAction = (action) => {
    // In a real app, you would call your API to perform the bulk action
    // axios.post('/api/admin/users/bulk', { ids: selectedUsers, action })
    
    // For now, just update the state
    if (action === 'activate') {
      setUsers(users.map(user => 
        selectedUsers.includes(user.id) ? { ...user, status: 'active' } : user
      ))
    } else if (action === 'deactivate') {
      setUsers(users.map(user => 
        selectedUsers.includes(user.id) ? { ...user, status: 'inactive' } : user
      ))
    } else if (action === 'delete') {
      setUsers(users.filter(user => !selectedUsers.includes(user.id)))
    }
    
    setSelectedUsers([])
  }

  const handleDeleteClick = (user) => {
    setUserToDelete(user)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = () => {
    // In a real app, you would call your API to delete the user
    // axios.delete(`/api/admin/users/${userToDelete.id}`)
    
    // For now, just remove it from the state
    setUsers(users.filter(user => user.id !== userToDelete.id))
    setShowDeleteModal(false)
    setUserToDelete(null)
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setUserToDelete(null)
  }

  const handleActionClick = (user, action) => {
    setUserToAction(user)
    setActionType(action)
    setShowActionModal(true)
  }

  const handleActionConfirm = () => {
    // In a real app, you would call your API to perform the action
    // axios.post(`/api/admin/users/${userToAction.id}/${actionType}`)
    
    // For now, just update the state
    if (actionType === 'activate') {
      setUsers(users.map(user => 
        user.id === userToAction.id ? { ...user, status: 'active' } : user
      ))
    } else if (actionType === 'deactivate') {
      setUsers(users.map(user => 
        user.id === userToAction.id ? { ...user, status: 'inactive' } : user
      ))
    } else if (actionType === 'reset-password') {
      // In a real app, this would trigger a password reset email
      console.log(`Password reset email sent to ${userToAction.email}`)
    }
    
    setShowActionModal(false)
    setUserToAction(null)
    setActionType('')
  }

  const handleActionCancel = () => {
    setShowActionModal(false)
    setUserToAction(null)
    setActionType('')
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const getActionModalTitle = () => {
    switch (actionType) {
      case 'activate':
        return 'Activate User'
      case 'deactivate':
        return 'Deactivate User'
      case 'reset-password':
        return 'Reset Password'
      default:
        return 'Confirm Action'
    }
  }

  const getActionModalMessage = () => {
    switch (actionType) {
      case 'activate':
        return `Are you sure you want to activate the account for ${userToAction?.name}? They will be able to log in and use the system.`
      case 'deactivate':
        return `Are you sure you want to deactivate the account for ${userToAction?.name}? They will not be able to log in until reactivated.`
      case 'reset-password':
        return `Are you sure you want to send a password reset email to ${userToAction?.name} (${userToAction?.email})? They will receive instructions to create a new password.`
      default:
        return 'Are you sure you want to perform this action?'
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div>
              <label htmlFor="filterRole" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                id="filterRole"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="agent">Agent</option>
                <option value="user">User</option>
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
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
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
                placeholder="Search users..."
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
      {selectedUsers.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <span className="font-medium">{selectedUsers.length} users</span> selected.
                <button
                  onClick={() => handleBulkAction('activate')}
                  className="ml-2 font-medium text-yellow-700 underline hover:text-yellow-600"
                >
                  Activate All
                </button>
                <button
                  onClick={() => handleBulkAction('deactivate')}
                  className="ml-2 font-medium text-yellow-700 underline hover:text-yellow-600"
                >
                  Deactivate All
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

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No users found. Try adjusting your filters.</p>
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
                        checked={selectedUsers.length === users.length && users.length > 0}
                        onChange={handleSelectAll}
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-500 font-medium">{user.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : user.role === 'agent' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Last login: {formatDate(user.lastLogin)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.properties} properties • {user.inquiries} inquiries
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleActionClick(user, 'reset-password')}
                          className="text-gray-400 hover:text-gray-500"
                          title="Reset Password"
                        >
                          <FiLock />
                        </button>
                        <button
                          onClick={() => handleActionClick(user, user.status === 'active' ? 'deactivate' : 'activate')}
                          className={`${user.status === 'active' ? 'text-red-400 hover:text-red-500' : 'text-green-400 hover:text-green-500'}`}
                          title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {user.status === 'active' ? <FiUserX /> : <FiUserCheck />}
                        </button>
                        <Link to={`/admin/users/${user.id}/edit`} className="text-blue-400 hover:text-blue-500" title="Edit">
                          <FiEdit2 />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(user)}
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
        {!loading && users.length > 0 && (
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
                  Showing <span className="font-medium">{(currentPage - 1) * usersPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * usersPerPage, users.length + (currentPage - 1) * usersPerPage)}</span> of <span className="font-medium">{users.length + (currentPage - 1) * usersPerPage}</span> results
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
                      Delete User
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete the user account for {userToDelete?.name} ({userToDelete?.email})? This action cannot be undone and will remove all data associated with this account.
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

      {/* Action Confirmation Modal */}
      {showActionModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    {actionType === 'reset-password' ? (
                      <FiMail className="h-6 w-6 text-blue-600" />
                    ) : actionType === 'activate' ? (
                      <FiUserCheck className="h-6 w-6 text-green-600" />
                    ) : (
                      <FiUserX className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      {getActionModalTitle()}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {getActionModalMessage()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleActionConfirm}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${actionType === 'deactivate' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'} text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={handleActionCancel}
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

export default Users