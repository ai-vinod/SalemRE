import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiHome, FiUsers, FiFileText, FiMessageSquare, FiPieChart, FiTrendingUp, FiAlertCircle } from 'react-icons/fi'
import { dashboardService } from '../../services'

const Dashboard = () => {
  const [stats, setStats] = useState({
    properties: 0,
    users: 0,
    inquiries: 0,
    blogPosts: 0
  })
  const [recentProperties, setRecentProperties] = useState([])
  const [recentInquiries, setRecentInquiries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        // Fetch dashboard data from API using dashboardService
        const dashboardData = await dashboardService.getDashboardData()
        
        // Update state with the fetched data
        setStats(dashboardData.stats)
        setRecentProperties(dashboardData.recentProperties)
        setRecentInquiries(dashboardData.recentInquiries)
        
        setLoading(false)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setLoading(false)
        
        // Fallback to empty data if API call fails
        setStats({
          properties: 0,
          users: 0,
          inquiries: 0,
          blogPosts: 0
        })
        setRecentProperties([])
        setRecentInquiries([])
      }
    }

    fetchDashboardData()
  }, [])

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome to the admin dashboard. Here's an overview of your website.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 text-primary-600 mr-4">
              <FiHome className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Properties</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.properties}</h3>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/admin/properties" className="text-sm text-primary-600 hover:text-primary-700">
              View all properties →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FiUsers className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Registered Users</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.users}</h3>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/admin/users" className="text-sm text-primary-600 hover:text-primary-700">
              View all users →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FiMessageSquare className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Inquiries</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.inquiries}</h3>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/admin/inquiries" className="text-sm text-primary-600 hover:text-primary-700">
              View all inquiries →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <FiFileText className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Blog Posts</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.blogPosts}</h3>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/admin/blog-posts" className="text-sm text-primary-600 hover:text-primary-700">
              View all posts →
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Properties */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-bold text-gray-900">Recent Properties</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentProperties.map((property) => (
                  <tr key={property.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        <Link to={`/admin/properties/${property.id}`} className="hover:text-primary-600">
                          {property.title}
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{property.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatPrice(property.price)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${property.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(property.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <Link to="/admin/properties" className="text-sm text-primary-600 hover:text-primary-700">
              View all properties
            </Link>
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-bold text-gray-900">Recent Inquiries</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentInquiries.map((inquiry) => (
                  <tr key={inquiry.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        <Link to={`/admin/inquiries/${inquiry.id}`} className="hover:text-primary-600">
                          {inquiry.name}
                        </Link>
                      </div>
                      <div className="text-sm text-gray-500">{inquiry.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <Link to={`/admin/properties/${inquiry.propertyId}`} className="hover:text-primary-600">
                          {inquiry.propertyTitle}
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${inquiry.status === 'new' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {inquiry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(inquiry.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <Link to="/admin/inquiries" className="text-sm text-primary-600 hover:text-primary-700">
              View all inquiries
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
        <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/admin/properties/new" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="p-2 rounded-full bg-primary-100 text-primary-600 mr-3">
              <FiHome className="text-lg" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Add New Property</p>
            </div>
          </Link>
          
          <Link to="/admin/blog-posts/new" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="p-2 rounded-full bg-purple-100 text-purple-600 mr-3">
              <FiFileText className="text-lg" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Create Blog Post</p>
            </div>
          </Link>
          
          <Link to="/admin/inquiries" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
              <FiMessageSquare className="text-lg" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Manage Inquiries</p>
            </div>
          </Link>
          
          <Link to="/admin/reports" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
              <FiPieChart className="text-lg" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">View Reports</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard