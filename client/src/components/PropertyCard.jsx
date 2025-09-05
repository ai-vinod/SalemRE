import { Link } from 'react-router-dom'
import { FiMapPin, FiMaximize, FiPhone, FiMail } from 'react-icons/fi'

const PropertyCard = ({ property }) => {
  // Format price to Indian Rupees format
  const formatPrice = (price) => {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    })
    return formatter.format(price)
  }

  return (
    <div className="card overflow-hidden group">
      {/* Property Image */}
      <Link to={`/property/${property.id}`} className="block relative overflow-hidden">
        <div className="aspect-w-16 aspect-h-10 bg-gray-200">
          <img
            src={property.image_url || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'}
            alt={property.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="absolute top-4 left-4">
          <span className="bg-primary-600 text-white text-xs font-semibold px-2 py-1 rounded uppercase">
            {property.property_type}
          </span>
        </div>
      </Link>

      {/* Property Details */}
      <div className="p-4">
        <Link to={`/property/${property.id}`} className="block">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2 line-clamp-1">
            {property.title}
          </h3>
        </Link>

        <div className="flex items-center text-gray-600 mb-2">
          <FiMapPin className="mr-1 text-primary-500" />
          <span className="text-sm">{property.location}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-gray-600">
            <FiMaximize className="mr-1 text-primary-500" />
            <span className="text-sm">{property.size} sq.ft</span>
          </div>
          <div className="text-lg font-bold text-primary-600">
            {formatPrice(property.price)}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 flex justify-between">
          <Link
            to={`/property/${property.id}`}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            View Details
          </Link>
          {property.contact_phone && (
            <a
              href={`tel:${property.contact_phone}`}
              className="text-gray-600 hover:text-primary-600 text-sm flex items-center"
            >
              <FiPhone className="mr-1" /> Call
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default PropertyCard