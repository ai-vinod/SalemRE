import { Link } from 'react-router-dom'

const BlogPreviewCard = ({ blog }) => {
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  return (
    <div className="card overflow-hidden group h-full flex flex-col">
      {/* Blog Image */}
      <Link to={`/blog/${blog.slug}`} className="block relative overflow-hidden">
        <div className="aspect-w-16 aspect-h-9 bg-gray-200">
          <img
            src={blog.image_url || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'}
            alt={blog.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      {/* Blog Details */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-sm text-gray-500 mb-2">{formatDate(blog.created_at)}</div>
        
        <Link to={`/blog/${blog.slug}`} className="block mb-3">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
            {blog.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
          {blog.excerpt}
        </p>
        
        <Link
          to={`/blog/${blog.slug}`}
          className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center mt-auto"
        >
          Read More
          <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

export default BlogPreviewCard