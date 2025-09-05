import React from 'react'
import { Link } from 'react-router-dom'
import { FiHome, FiSearch, FiPhone } from 'react-icons/fi'

const NotFound = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 sm:p-10">
          <div className="text-center">
            <h1 className="text-9xl font-bold text-primary-600">404</h1>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">Page Not Found</h2>
            <p className="mt-2 text-base text-gray-600">
              Sorry, we couldn't find the page you're looking for.
            </p>
            
            <div className="mt-8 space-y-4">
              <Link 
                to="/" 
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                <FiHome className="mr-2" />
                Back to Home
              </Link>
              
              <Link 
                to="/listings" 
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-primary-600 bg-primary-50 hover:bg-primary-100"
              >
                <FiSearch className="mr-2" />
                Browse Properties
              </Link>
              
              <Link 
                to="/contact" 
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FiPhone className="mr-2" />
                Contact Support
              </Link>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 sm:px-10">
          <p className="text-xs text-center text-gray-500">
            &copy; {new Date().getFullYear()} Salem Real Estate. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFound