import { useState } from 'react'
import { FiSave, FiRefreshCw, FiAlertCircle } from 'react-icons/fi'

const Settings = () => {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Salem Real Estate',
    siteDescription: 'Find your dream property in Salem, Tamil Nadu',
    contactEmail: 'contact@salemrealestate.com',
    contactPhone: '+91 98765 43210',
    address: '123 Main Street, Salem, Tamil Nadu, India'
  })

  const [seoSettings, setSeoSettings] = useState({
    metaTitle: 'Salem Real Estate | Find Properties in Salem, Tamil Nadu',
    metaDescription: 'Browse properties for sale and rent in Salem. Find houses, apartments, plots, and commercial properties with Salem Real Estate.',
    ogImage: 'https://example.com/og-image.jpg',
    googleAnalyticsId: 'UA-XXXXXXXXX-X'
  })

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.example.com',
    smtpPort: '587',
    smtpUsername: 'notifications@salemrealestate.com',
    smtpPassword: '••••••••••••',
    fromEmail: 'notifications@salemrealestate.com',
    fromName: 'Salem Real Estate'
  })

  const [socialMedia, setSocialMedia] = useState({
    facebook: 'https://facebook.com/salemrealestate',
    twitter: 'https://twitter.com/salemrealestate',
    instagram: 'https://instagram.com/salemrealestate',
    youtube: 'https://youtube.com/salemrealestate',
    linkedin: 'https://linkedin.com/company/salemrealestate'
  })

  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  const handleGeneralChange = (e) => {
    const { name, value } = e.target
    setGeneralSettings(prev => ({ ...prev, [name]: value }))
  }

  const handleSeoChange = (e) => {
    const { name, value } = e.target
    setSeoSettings(prev => ({ ...prev, [name]: value }))
  }

  const handleEmailChange = (e) => {
    const { name, value } = e.target
    setEmailSettings(prev => ({ ...prev, [name]: value }))
  }

  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target
    setSocialMedia(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    // In a real app, you would call your API
    // try {
    //   await axios.post('/api/admin/settings', {
    //     general: generalSettings,
    //     seo: seoSettings,
    //     email: emailSettings,
    //     socialMedia
    //   })
    //   setSaveSuccess(true)
    //   setTimeout(() => setSaveSuccess(false), 3000)
    // } catch (error) {
    //   console.error('Error saving settings:', error)
    // }
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }, 1000)
  }

  const handleTestEmail = () => {
    // In a real app, you would call your API to test email settings
    alert('Test email sent! Check your inbox.')
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your website settings</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('general')}
              className={`py-4 px-6 text-sm font-medium ${activeTab === 'general' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab('seo')}
              className={`py-4 px-6 text-sm font-medium ${activeTab === 'seo' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              SEO
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`py-4 px-6 text-sm font-medium ${activeTab === 'email' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Email
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`py-4 px-6 text-sm font-medium ${activeTab === 'social' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Social Media
            </button>
          </nav>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">Site Name</label>
                  <input
                    type="text"
                    id="siteName"
                    name="siteName"
                    value={generalSettings.siteName}
                    onChange={handleGeneralChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">Site Description</label>
                  <textarea
                    id="siteDescription"
                    name="siteDescription"
                    rows="3"
                    value={generalSettings.siteDescription}
                    onChange={handleGeneralChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">Contact Email</label>
                    <input
                      type="email"
                      id="contactEmail"
                      name="contactEmail"
                      value={generalSettings.contactEmail}
                      onChange={handleGeneralChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">Contact Phone</label>
                    <input
                      type="text"
                      id="contactPhone"
                      name="contactPhone"
                      value={generalSettings.contactPhone}
                      onChange={handleGeneralChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    id="address"
                    name="address"
                    rows="2"
                    value={generalSettings.address}
                    onChange={handleGeneralChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
              </div>
            )}

            {/* SEO Settings */}
            {activeTab === 'seo' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700">Meta Title</label>
                  <input
                    type="text"
                    id="metaTitle"
                    name="metaTitle"
                    value={seoSettings.metaTitle}
                    onChange={handleSeoChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                  <p className="mt-1 text-sm text-gray-500">Recommended length: 50-60 characters</p>
                </div>
                
                <div>
                  <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700">Meta Description</label>
                  <textarea
                    id="metaDescription"
                    name="metaDescription"
                    rows="3"
                    value={seoSettings.metaDescription}
                    onChange={handleSeoChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                  <p className="mt-1 text-sm text-gray-500">Recommended length: 150-160 characters</p>
                </div>
                
                <div>
                  <label htmlFor="ogImage" className="block text-sm font-medium text-gray-700">Open Graph Image URL</label>
                  <input
                    type="text"
                    id="ogImage"
                    name="ogImage"
                    value={seoSettings.ogImage}
                    onChange={handleSeoChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                  <p className="mt-1 text-sm text-gray-500">Recommended size: 1200x630 pixels</p>
                </div>
                
                <div>
                  <label htmlFor="googleAnalyticsId" className="block text-sm font-medium text-gray-700">Google Analytics ID</label>
                  <input
                    type="text"
                    id="googleAnalyticsId"
                    name="googleAnalyticsId"
                    value={seoSettings.googleAnalyticsId}
                    onChange={handleSeoChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="UA-XXXXXXXXX-X"
                  />
                </div>
              </div>
            )}

            {/* Email Settings */}
            {activeTab === 'email' && (
              <div className="space-y-6">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FiAlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Email settings are used for sending notifications to users and administrators.
                        Make sure to configure these settings correctly.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="smtpHost" className="block text-sm font-medium text-gray-700">SMTP Host</label>
                    <input
                      type="text"
                      id="smtpHost"
                      name="smtpHost"
                      value={emailSettings.smtpHost}
                      onChange={handleEmailChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700">SMTP Port</label>
                    <input
                      type="text"
                      id="smtpPort"
                      name="smtpPort"
                      value={emailSettings.smtpPort}
                      onChange={handleEmailChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="smtpUsername" className="block text-sm font-medium text-gray-700">SMTP Username</label>
                    <input
                      type="text"
                      id="smtpUsername"
                      name="smtpUsername"
                      value={emailSettings.smtpUsername}
                      onChange={handleEmailChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="smtpPassword" className="block text-sm font-medium text-gray-700">SMTP Password</label>
                    <input
                      type="password"
                      id="smtpPassword"
                      name="smtpPassword"
                      value={emailSettings.smtpPassword}
                      onChange={handleEmailChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="fromEmail" className="block text-sm font-medium text-gray-700">From Email</label>
                    <input
                      type="email"
                      id="fromEmail"
                      name="fromEmail"
                      value={emailSettings.fromEmail}
                      onChange={handleEmailChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="fromName" className="block text-sm font-medium text-gray-700">From Name</label>
                    <input
                      type="text"
                      id="fromName"
                      name="fromName"
                      value={emailSettings.fromName}
                      onChange={handleEmailChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <button
                    type="button"
                    onClick={handleTestEmail}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <FiRefreshCw className="-ml-1 mr-2 h-4 w-4" />
                    Test Email Configuration
                  </button>
                </div>
              </div>
            )}

            {/* Social Media Settings */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">Facebook URL</label>
                  <input
                    type="text"
                    id="facebook"
                    name="facebook"
                    value={socialMedia.facebook}
                    onChange={handleSocialMediaChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">Twitter URL</label>
                  <input
                    type="text"
                    id="twitter"
                    name="twitter"
                    value={socialMedia.twitter}
                    onChange={handleSocialMediaChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">Instagram URL</label>
                  <input
                    type="text"
                    id="instagram"
                    name="instagram"
                    value={socialMedia.instagram}
                    onChange={handleSocialMediaChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="youtube" className="block text-sm font-medium text-gray-700">YouTube URL</label>
                  <input
                    type="text"
                    id="youtube"
                    name="youtube"
                    value={socialMedia.youtube}
                    onChange={handleSocialMediaChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                  <input
                    type="text"
                    id="linkedin"
                    name="linkedin"
                    value={socialMedia.linkedin}
                    onChange={handleSocialMediaChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="px-6 py-3 bg-gray-50 text-right sm:px-6 flex justify-between items-center">
            {saveSuccess && (
              <div className="text-sm text-green-600">
                Settings saved successfully!
              </div>
            )}
            <button
              type="submit"
              disabled={saving}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="-ml-1 mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Settings