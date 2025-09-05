import { useState, useEffect } from 'react'
import { FiDownload, FiFilter, FiCalendar, FiBarChart2, FiPieChart, FiTrendingUp } from 'react-icons/fi'

const Reports = () => {
  const [loading, setLoading] = useState(true)
  const [reportType, setReportType] = useState('properties')
  const [dateRange, setDateRange] = useState('last30days')
  const [propertyStats, setPropertyStats] = useState(null)
  const [inquiryStats, setInquiryStats] = useState(null)
  const [userStats, setUserStats] = useState(null)
  const [blogStats, setBlogStats] = useState(null)

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true)
      try {
        // In a real app, you would fetch from your API
        // const response = await axios.get(`/api/admin/reports/${reportType}`, {
        //   params: { dateRange }
        // })
        // setReportData(response.data)
        
        // Using dummy data for now
        setTimeout(() => {
          // Generate dummy property stats
          const dummyPropertyStats = {
            totalProperties: 156,
            newProperties: 23,
            soldProperties: 18,
            pendingProperties: 42,
            featuredProperties: 15,
            averagePrice: 4500000,
            propertyTypeDistribution: [
              { type: 'Apartment', count: 65, percentage: 42 },
              { type: 'Villa', count: 32, percentage: 21 },
              { type: 'Plot', count: 28, percentage: 18 },
              { type: 'Commercial', count: 18, percentage: 12 },
              { type: 'Farm House', count: 13, percentage: 7 }
            ],
            locationDistribution: [
              { location: 'Hasthampatti', count: 42, percentage: 27 },
              { location: 'Fairlands', count: 38, percentage: 24 },
              { location: 'Alagapuram', count: 31, percentage: 20 },
              { location: 'Suramangalam', count: 25, percentage: 16 },
              { location: 'Shevapet', count: 20, percentage: 13 }
            ],
            monthlyTrends: [
              { month: 'Jan', count: 12, value: 48000000 },
              { month: 'Feb', count: 15, value: 62000000 },
              { month: 'Mar', count: 18, value: 75000000 },
              { month: 'Apr', count: 14, value: 58000000 },
              { month: 'May', count: 16, value: 67000000 },
              { month: 'Jun', count: 20, value: 82000000 }
            ]
          }
          
          // Generate dummy inquiry stats
          const dummyInquiryStats = {
            totalInquiries: 248,
            newInquiries: 35,
            resolvedInquiries: 180,
            pendingInquiries: 33,
            conversionRate: 22,
            averageResponseTime: 8, // hours
            inquirySourceDistribution: [
              { source: 'Website', count: 145, percentage: 58 },
              { source: 'Phone', count: 62, percentage: 25 },
              { source: 'Email', count: 28, percentage: 11 },
              { source: 'Walk-in', count: 13, percentage: 6 }
            ],
            propertyTypeInquiries: [
              { type: 'Apartment', count: 112, percentage: 45 },
              { type: 'Villa', count: 68, percentage: 27 },
              { type: 'Plot', count: 42, percentage: 17 },
              { type: 'Commercial', count: 26, percentage: 11 }
            ],
            monthlyTrends: [
              { month: 'Jan', count: 32 },
              { month: 'Feb', count: 38 },
              { month: 'Mar', count: 45 },
              { month: 'Apr', count: 42 },
              { month: 'May', count: 48 },
              { month: 'Jun', count: 43 }
            ]
          }
          
          // Generate dummy user stats
          const dummyUserStats = {
            totalUsers: 320,
            newUsers: 28,
            activeUsers: 245,
            inactiveUsers: 75,
            userRoleDistribution: [
              { role: 'User', count: 268, percentage: 84 },
              { role: 'Agent', count: 48, percentage: 15 },
              { role: 'Admin', count: 4, percentage: 1 }
            ],
            userActivityDistribution: [
              { activity: 'Property Views', count: 1850 },
              { activity: 'Inquiries', count: 248 },
              { activity: 'Saved Properties', count: 520 },
              { activity: 'Blog Reads', count: 780 }
            ],
            monthlyTrends: [
              { month: 'Jan', count: 18 },
              { month: 'Feb', count: 22 },
              { month: 'Mar', count: 25 },
              { month: 'Apr', count: 20 },
              { month: 'May', count: 24 },
              { month: 'Jun', count: 28 }
            ]
          }
          
          // Generate dummy blog stats
          const dummyBlogStats = {
            totalPosts: 48,
            newPosts: 6,
            totalViews: 12500,
            totalComments: 320,
            popularPosts: [
              { title: 'Top 10 Neighborhoods in Salem for First-Time Homebuyers', views: 1250 },
              { title: 'How to Negotiate the Best Price When Buying Property', views: 980 },
              { title: 'The Impact of Infrastructure Development on Salem Real Estate', views: 850 },
              { title: 'Investment Opportunities in Salem Commercial Properties', views: 720 },
              { title: 'Understanding Property Tax in Tamil Nadu', views: 680 }
            ],
            categoryDistribution: [
              { category: 'Real Estate Tips', count: 15, percentage: 31 },
              { category: 'Market Trends', count: 12, percentage: 25 },
              { category: 'Investment Advice', count: 8, percentage: 17 },
              { category: 'Home Improvement', count: 7, percentage: 15 },
              { category: 'Buying Guide', count: 6, percentage: 12 }
            ],
            monthlyTrends: [
              { month: 'Jan', views: 1800 },
              { month: 'Feb', views: 2100 },
              { month: 'Mar', views: 2400 },
              { month: 'Apr', views: 2000 },
              { month: 'May', views: 2200 },
              { month: 'Jun', views: 2000 }
            ]
          }
          
          setPropertyStats(dummyPropertyStats)
          setInquiryStats(dummyInquiryStats)
          setUserStats(dummyUserStats)
          setBlogStats(dummyBlogStats)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error fetching report data:', error)
        setLoading(false)
      }
    }

    fetchReportData()
  }, [reportType, dateRange])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const handleExportReport = () => {
    // In a real app, you would generate and download a CSV/PDF report
    alert('Report export functionality would be implemented here')
  }

  const renderPropertyStats = () => {
    if (!propertyStats) return null

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Properties</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{propertyStats.totalProperties}</p>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <FiTrendingUp className="mr-1.5 h-4 w-4 flex-shrink-0" />
              <span>+{propertyStats.newProperties} new</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Sold Properties</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{propertyStats.soldProperties}</p>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span>{Math.round((propertyStats.soldProperties / propertyStats.totalProperties) * 100)}% of total</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Pending Properties</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{propertyStats.pendingProperties}</p>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span>{Math.round((propertyStats.pendingProperties / propertyStats.totalProperties) * 100)}% of total</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Average Price</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{formatPrice(propertyStats.averagePrice)}</p>
          </div>
        </div>
        
        {/* Property Type Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Property Type Distribution</h3>
          <div className="overflow-hidden">
            <div className="flex space-x-4 mb-4">
              {propertyStats.propertyTypeDistribution.map((item, index) => (
                <div key={index} className="flex items-center">
                  <span className={`inline-block w-3 h-3 rounded-full mr-2 bg-primary-${(index % 5) * 100 + 500}`}></span>
                  <span className="text-sm text-gray-600">{item.type}</span>
                </div>
              ))}
            </div>
            <div className="h-8 w-full flex rounded-full overflow-hidden bg-gray-200">
              {propertyStats.propertyTypeDistribution.map((item, index) => (
                <div 
                  key={index}
                  className={`h-full bg-primary-${(index % 5) * 100 + 500}`}
                  style={{ width: `${item.percentage}%` }}
                  title={`${item.type}: ${item.count} (${item.percentage}%)`}
                ></div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {propertyStats.propertyTypeDistribution.map((item, index) => (
                <div key={index} className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{item.count}</p>
                  <p className="text-sm text-gray-500">{item.type}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Location Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Location Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {propertyStats.locationDistribution.map((item, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.location}</span>
                    <span className="text-sm text-gray-500">{item.count} properties ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary-600 h-2.5 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border-8 border-gray-100 relative">
                {/* This would be a pie chart in a real implementation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <FiPieChart className="h-12 w-12 text-primary-500" />
                  <span className="sr-only">Pie Chart Placeholder</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Trends</h3>
          <div className="h-64 relative">
            {/* This would be a bar/line chart in a real implementation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <FiBarChart2 className="h-12 w-12 text-primary-500" />
              <span className="sr-only">Chart Placeholder</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-6 gap-2">
            {propertyStats.monthlyTrends.map((item, index) => (
              <div key={index} className="text-center">
                <p className="text-sm font-medium text-gray-900">{item.month}</p>
                <p className="text-xs text-gray-500">{item.count} props</p>
                <p className="text-xs text-gray-500">{formatPrice(item.value).replace('₹', '₹ ')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderInquiryStats = () => {
    if (!inquiryStats) return null

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Inquiries</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{inquiryStats.totalInquiries}</p>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <FiTrendingUp className="mr-1.5 h-4 w-4 flex-shrink-0" />
              <span>+{inquiryStats.newInquiries} new</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Resolved Inquiries</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{inquiryStats.resolvedInquiries}</p>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span>{Math.round((inquiryStats.resolvedInquiries / inquiryStats.totalInquiries) * 100)}% of total</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Pending Inquiries</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{inquiryStats.pendingInquiries}</p>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span>{Math.round((inquiryStats.pendingInquiries / inquiryStats.totalInquiries) * 100)}% of total</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{inquiryStats.conversionRate}%</p>
          </div>
        </div>
        
        {/* Inquiry Source Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Inquiry Source Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {inquiryStats.inquirySourceDistribution.map((item, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.source}</span>
                    <span className="text-sm text-gray-500">{item.count} inquiries ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary-600 h-2.5 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border-8 border-gray-100 relative">
                {/* This would be a pie chart in a real implementation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <FiPieChart className="h-12 w-12 text-primary-500" />
                  <span className="sr-only">Pie Chart Placeholder</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Property Type Inquiries */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Property Type Inquiries</h3>
          <div className="overflow-hidden">
            <div className="flex space-x-4 mb-4">
              {inquiryStats.propertyTypeInquiries.map((item, index) => (
                <div key={index} className="flex items-center">
                  <span className={`inline-block w-3 h-3 rounded-full mr-2 bg-primary-${(index % 5) * 100 + 500}`}></span>
                  <span className="text-sm text-gray-600">{item.type}</span>
                </div>
              ))}
            </div>
            <div className="h-8 w-full flex rounded-full overflow-hidden bg-gray-200">
              {inquiryStats.propertyTypeInquiries.map((item, index) => (
                <div 
                  key={index}
                  className={`h-full bg-primary-${(index % 5) * 100 + 500}`}
                  style={{ width: `${item.percentage}%` }}
                  title={`${item.type}: ${item.count} (${item.percentage}%)`}
                ></div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {inquiryStats.propertyTypeInquiries.map((item, index) => (
                <div key={index} className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{item.count}</p>
                  <p className="text-sm text-gray-500">{item.type}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Inquiry Trends</h3>
          <div className="h-64 relative">
            {/* This would be a bar/line chart in a real implementation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <FiBarChart2 className="h-12 w-12 text-primary-500" />
              <span className="sr-only">Chart Placeholder</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-6 gap-2">
            {inquiryStats.monthlyTrends.map((item, index) => (
              <div key={index} className="text-center">
                <p className="text-sm font-medium text-gray-900">{item.month}</p>
                <p className="text-xs text-gray-500">{item.count} inquiries</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderUserStats = () => {
    if (!userStats) return null

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{userStats.totalUsers}</p>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <FiTrendingUp className="mr-1.5 h-4 w-4 flex-shrink-0" />
              <span>+{userStats.newUsers} new</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{userStats.activeUsers}</p>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span>{Math.round((userStats.activeUsers / userStats.totalUsers) * 100)}% of total</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Inactive Users</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{userStats.inactiveUsers}</p>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span>{Math.round((userStats.inactiveUsers / userStats.totalUsers) * 100)}% of total</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">User Roles</h3>
            <div className="mt-2 flex space-x-2">
              {userStats.userRoleDistribution.map((item, index) => (
                <div key={index} className="text-center">
                  <p className="text-lg font-bold text-gray-900">{item.count}</p>
                  <p className="text-xs text-gray-500">{item.role}s</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* User Role Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">User Role Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {userStats.userRoleDistribution.map((item, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.role}s</span>
                    <span className="text-sm text-gray-500">{item.count} users ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary-600 h-2.5 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border-8 border-gray-100 relative">
                {/* This would be a pie chart in a real implementation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <FiPieChart className="h-12 w-12 text-primary-500" />
                  <span className="sr-only">Pie Chart Placeholder</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* User Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">User Activity</h3>
          <div className="h-64 relative">
            {/* This would be a bar chart in a real implementation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <FiBarChart2 className="h-12 w-12 text-primary-500" />
              <span className="sr-only">Chart Placeholder</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {userStats.userActivityDistribution.map((item, index) => (
              <div key={index} className="text-center">
                <p className="text-2xl font-bold text-gray-900">{item.count}</p>
                <p className="text-sm text-gray-500">{item.activity}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly New User Trends</h3>
          <div className="h-64 relative">
            {/* This would be a line chart in a real implementation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <FiBarChart2 className="h-12 w-12 text-primary-500" />
              <span className="sr-only">Chart Placeholder</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-6 gap-2">
            {userStats.monthlyTrends.map((item, index) => (
              <div key={index} className="text-center">
                <p className="text-sm font-medium text-gray-900">{item.month}</p>
                <p className="text-xs text-gray-500">{item.count} new users</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderBlogStats = () => {
    if (!blogStats) return null

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Posts</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{blogStats.totalPosts}</p>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <FiTrendingUp className="mr-1.5 h-4 w-4 flex-shrink-0" />
              <span>+{blogStats.newPosts} new</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{blogStats.totalViews.toLocaleString()}</p>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span>Avg {Math.round(blogStats.totalViews / blogStats.totalPosts)} per post</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Comments</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{blogStats.totalComments}</p>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span>Avg {Math.round(blogStats.totalComments / blogStats.totalPosts)} per post</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Categories</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{blogStats.categoryDistribution.length}</p>
          </div>
        </div>
        
        {/* Popular Posts */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Most Popular Posts</h3>
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post Title</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogStats.popularPosts.map((post, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{post.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{post.views.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Category Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {blogStats.categoryDistribution.map((item, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.category}</span>
                    <span className="text-sm text-gray-500">{item.count} posts ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary-600 h-2.5 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border-8 border-gray-100 relative">
                {/* This would be a pie chart in a real implementation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <FiPieChart className="h-12 w-12 text-primary-500" />
                  <span className="sr-only">Pie Chart Placeholder</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly View Trends</h3>
          <div className="h-64 relative">
            {/* This would be a line chart in a real implementation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <FiBarChart2 className="h-12 w-12 text-primary-500" />
              <span className="sr-only">Chart Placeholder</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-6 gap-2">
            {blogStats.monthlyTrends.map((item, index) => (
              <div key={index} className="text-center">
                <p className="text-sm font-medium text-gray-900">{item.month}</p>
                <p className="text-xs text-gray-500">{item.views.toLocaleString()} views</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <button
          onClick={handleExportReport}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <FiDownload className="mr-2" /> Export Report
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div>
              <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
              <select
                id="reportType"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="properties">Properties</option>
                <option value="inquiries">Inquiries</option>
                <option value="users">Users</option>
                <option value="blog">Blog</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select
                id="dateRange"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="last7days">Last 7 Days</option>
                <option value="last30days">Last 30 Days</option>
                <option value="last90days">Last 90 Days</option>
                <option value="last6months">Last 6 Months</option>
                <option value="lastyear">Last Year</option>
                <option value="alltime">All Time</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <FiCalendar className="mr-2" /> Custom Range
              </button>
            </div>
          </div>
          
          <div className="flex items-end">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <FiFilter className="mr-2" /> Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {loading ? (
          <div className="p-6 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div>
            {reportType === 'properties' && renderPropertyStats()}
            {reportType === 'inquiries' && renderInquiryStats()}
            {reportType === 'users' && renderUserStats()}
            {reportType === 'blog' && renderBlogStats()}
          </div>
        )}
      </div>
    </div>
  )
}

export default Reports