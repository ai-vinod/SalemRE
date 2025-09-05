import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import AdminLayout from './components/admin/AdminLayout'
import LoadingSpinner from './components/ui/LoadingSpinner'

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'))
const Listings = lazy(() => import('./pages/Listings'))
const PropertyDetail = lazy(() => import('./pages/PropertyDetails'))
const PostProperty = lazy(() => import('./pages/PostProperty'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminProperties = lazy(() => import('./pages/admin/Properties'))
const AddProperty = lazy(() => import('./pages/admin/AddProperty'))
const EditProperty = lazy(() => import('./pages/admin/EditProperty'))
const AdminUsers = lazy(() => import('./pages/admin/Users'))
const AdminInquiries = lazy(() => import('./pages/admin/Inquiries'))
const AdminBlogPosts = lazy(() => import('./pages/admin/BlogPosts'))
const AddBlogPost = lazy(() => import('./pages/admin/AddBlogPost'))
const EditBlogPost = lazy(() => import('./pages/admin/EditBlogPost'))
const AdminSettings = lazy(() => import('./pages/admin/Settings'))
const AdminProfile = lazy(() => import('./pages/admin/Profile'))
const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Client routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="listings" element={<Listings />} />
          <Route path="property/:id" element={<PropertyDetail />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          
          {/* Protected routes for authenticated users */}
          <Route element={<ProtectedRoute />}>
            <Route path="post-property" element={<PostProperty />} />
          </Route>
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Route>
        
        {/* Admin routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="properties" element={<AdminProperties />} />
            <Route path="properties/new" element={<AddProperty />} />
            <Route path="properties/:id/edit" element={<EditProperty />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="blog-posts" element={<AdminBlogPosts />} />
            <Route path="blog-posts/new" element={<AddBlogPost />} />
            <Route path="blog-posts/:id/edit" element={<EditBlogPost />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App