import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { 
  FiHome, 
  FiUsers, 
  FiFileText, 
  FiMessageSquare, 
  FiSettings, 
  FiLogOut, 
  FiMenu, 
  FiX, 
  FiBell, 
  FiUser,
  FiChevronDown,
  FiGrid,
  FiPlusCircle
} from 'react-icons/fi'

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const navigate = useNavigate()

  // Mock user data - in a real app, this would come from your auth context
  const user = {
    name: 'Admin User',
    email: 'admin@salemre.com',
    avatar: 'https://source.unsplash.com/random/100x100/?portrait'
  }

  // Mock notifications
  const notifications = [
    {
      id: 1,
      message: 'New property inquiry from Raj Kumar',
      time: '5 minutes ago',
      read: false
    },
    {
      id: 2,
      message: 'New user registration: Priya Sharma',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      message: 'Property listing approved: Green Valley Villa',
      time: '3 hours ago',
      read: true
    }
  ]

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: FiGrid },
    { name: 'Properties', href: '/admin/properties', icon: FiHome },
    { name: 'Users', href: '/admin/users', icon: FiUsers },
    { name: 'Blog Posts', href: '/admin/blog-posts', icon: FiFileText },
    { name: 'Inquiries', href: '/admin/inquiries', icon: FiMessageSquare },
    { name: 'Settings', href: '/admin/settings', icon: FiSettings }
  ]

  const handleLogout = () => {
    // In a real app, you would call your logout function from auth context
    // authContext.logout()
    navigate('/login')
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div
        className={`${sidebarOpen ? 'block' : 'hidden'} fixed inset-0 flex z-40 lg:hidden`}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
        ></div>

        <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-primary-700">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <FiX className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-shrink-0 flex items-center px-4">
            <Link to="/" className="text-white font-bold text-xl">Salem RE Admin</Link>
          </div>
          <div className="mt-5 flex-1 h-0 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      isActive
                        ? 'bg-primary-800 text-white'
                        : 'text-white hover:bg-primary-600'
                    }`
                  }
                >
                  <item.icon className="mr-4 h-6 w-6 text-primary-300" aria-hidden="true" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-shrink-0 w-14" aria-hidden="true">
          {/* Dummy element to force sidebar to shrink to fit close icon */}
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary-700">
              <Link to="/" className="text-white font-bold text-xl">Salem RE Admin</Link>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto bg-primary-700">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-primary-800 text-white'
                          : 'text-white hover:bg-primary-600'
                      }`
                    }
                  >
                    <item.icon className="mr-3 h-5 w-5 text-primary-300" aria-hidden="true" />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <FiMenu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full flex items-center">
                  <div className="flex space-x-2">
                    <Link
                      to="/admin/properties/new"
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <FiPlusCircle className="-ml-1 mr-2 h-4 w-4" />
                      Add Property
                    </Link>
                    <Link
                      to="/admin/blog-posts/new"
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <FiPlusCircle className="-ml-1 mr-2 h-4 w-4" />
                      Add Blog Post
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {/* Notification dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="relative bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                  >
                    <span className="sr-only">View notifications</span>
                    <FiBell className="h-6 w-6" aria-hidden="true" />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                    )}
                  </button>
                </div>
                {notificationsOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                  >
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200 font-medium">Notifications</div>
                    {notifications.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-500">No new notifications</div>
                    ) : (
                      <div className="max-h-60 overflow-y-auto">
                        {notifications.map(notification => (
                          <a
                            key={notification.id}
                            href="#"
                            className={`block px-4 py-2 text-sm ${notification.read ? 'text-gray-500 bg-white' : 'text-gray-700 bg-gray-50'} hover:bg-gray-100`}
                            role="menuitem"
                          >
                            <p className="font-medium truncate">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </a>
                        ))}
                      </div>
                    )}
                    <div className="border-t border-gray-200">
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-center text-primary-600 hover:text-primary-800"
                        role="menuitem"
                      >
                        View all notifications
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user.avatar}
                      alt=""
                    />
                    <span className="hidden md:flex md:items-center ml-2">
                      <span className="text-sm font-medium text-gray-700 mr-1">{user.name}</span>
                      <FiChevronDown className="h-4 w-4 text-gray-400" />
                    </span>
                  </button>
                </div>
                {userMenuOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                  >
                    <div className="px-4 py-2 text-xs text-gray-500">{user.email}</div>
                    <Link
                      to="/admin/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <div className="flex items-center">
                        <FiUser className="mr-2 h-4 w-4" />
                        Your Profile
                      </div>
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <div className="flex items-center">
                        <FiSettings className="mr-2 h-4 w-4" />
                        Settings
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <div className="flex items-center">
                        <FiLogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout