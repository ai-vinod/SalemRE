import { Link } from 'react-router-dom'
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold text-primary-500">Salem</span>
              <span className="text-2xl font-bold text-white">RealEstate</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Your trusted partner for premium plots and properties in Salem. We help you find your dream property with ease.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <FiFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <FiTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <FiInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <FiLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/listings" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Property Types</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/listings?type=plot" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Plots
                </Link>
              </li>
              <li>
                <Link to="/listings?type=apartment" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Apartments
                </Link>
              </li>
              <li>
                <Link to="/listings?type=house" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Houses
                </Link>
              </li>
              <li>
                <Link to="/listings?type=commercial" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Commercial
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FiMapPin className="w-5 h-5 text-primary-500 mr-3 mt-1" />
                <span className="text-gray-400">
                  123 Main Street, Ammapet, Salem, Tamil Nadu 636003
                </span>
              </li>
              <li className="flex items-center">
                <FiPhone className="w-5 h-5 text-primary-500 mr-3" />
                <a href="tel:+919876543210" className="text-gray-400 hover:text-primary-500 transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center">
                <FiMail className="w-5 h-5 text-primary-500 mr-3" />
                <a href="mailto:info@salemrealestate.in" className="text-gray-400 hover:text-primary-500 transition-colors">
                  info@salemrealestate.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} Salem Real Estate. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-primary-500 transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-gray-400 hover:text-primary-500 transition-colors text-sm">
                Terms of Service
              </Link>
              <Link to="/sitemap" className="text-gray-400 hover:text-primary-500 transition-colors text-sm">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer