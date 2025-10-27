import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { api } from '../lib/api'
import { generateSlug, isValidSlug, generateLandingPageUrl, suggestAlternativeSlugs } from '../lib/slugUtils'
import {
  Globe, Save, Eye, Upload, X, Plus, Trash2, CheckCircle,
  AlertCircle, Image as ImageIcon, Package, Palette, Info
} from 'lucide-react'

interface LandingPage {
  id?: string
  slug: string
  is_active: boolean
  primary_color: string
  secondary_color: string
  logo_url: string | null
  hero_image_url: string | null
  business_tagline: string | null
  about_text: string | null
  gallery_images: Array<{ url: string; alt: string; order: number }>
  packages: Array<{ name: string; description: string; price: number; image_url?: string }>
  social_instagram: string | null
  social_facebook: string | null
  social_other: string | null
}

interface PackageForm {
  name: string
  description: string
  price: number
  image_url?: string
}

export default function MyLandingPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [landingPage, setLandingPage] = useState<LandingPage | null>(null)
  const [slugError, setSlugError] = useState<string>('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [activeTab, setActiveTab] = useState<'basic' | 'branding' | 'gallery' | 'packages' | 'social'>('basic')
  const [showPackageForm, setShowPackageForm] = useState(false)
  const [editingPackageIndex, setEditingPackageIndex] = useState<number | null>(null)
  const [packageForm, setPackageForm] = useState<PackageForm>({ name: '', description: '', price: 0 })

  useEffect(() => {
    if (user) {
      fetchLandingPage()
    }
  }, [user])

  const fetchLandingPage = async () => {
    try {
      const response = await api.landingPages.getMyLandingPage('')
      if (response.landingPage) {
        setLandingPage(response.landingPage)
      } else {
        const defaultSlug = generateSlug(user?.business_name || '')
        setLandingPage({
          slug: defaultSlug,
          is_active: false,
          primary_color: '#F59E0B',
          secondary_color: '#14B8A6',
          logo_url: null,
          hero_image_url: null,
          business_tagline: null,
          about_text: null,
          gallery_images: [],
          packages: [],
          social_instagram: null,
          social_facebook: null,
          social_other: null,
        })
      }
    } catch (error) {
      console.error('Error fetching landing page:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSlugChange = async (newSlug: string) => {
    setLandingPage({ ...landingPage!, slug: newSlug })

    if (!isValidSlug(newSlug)) {
      setSlugError('Slug must contain only lowercase letters, numbers, and hyphens')
      return
    }

    try {
      const result = await api.landingPages.checkSlugAvailability(newSlug, user?.id)
      if (!result.available) {
        setSlugError('This URL is already taken. Try one of the suggestions.')
      } else {
        setSlugError('')
      }
    } catch (error) {
      console.error('Error checking slug:', error)
    }
  }

  const handleImageUpload = async (file: File, type: 'logo' | 'hero' | 'gallery' | 'package') => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB')
      return
    }

    setUploadingImage(true)
    try {
      const result = await api.landingPages.uploadImage(file, type)

      if (type === 'logo') {
        setLandingPage({ ...landingPage!, logo_url: result.url })
      } else if (type === 'hero') {
        setLandingPage({ ...landingPage!, hero_image_url: result.url })
      } else if (type === 'gallery') {
        const newGallery = [
          ...landingPage!.gallery_images,
          { url: result.url, alt: file.name, order: landingPage!.gallery_images.length }
        ]
        setLandingPage({ ...landingPage!, gallery_images: newGallery })
      } else if (type === 'package') {
        setPackageForm({ ...packageForm, image_url: result.url })
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const removeGalleryImage = (index: number) => {
    const newGallery = landingPage!.gallery_images.filter((_, i) => i !== index)
    setLandingPage({ ...landingPage!, gallery_images: newGallery })
  }

  const handleSavePackage = () => {
    if (!packageForm.name || !packageForm.description || packageForm.price <= 0) {
      alert('Please fill in all package details')
      return
    }

    const newPackages = [...landingPage!.packages]
    if (editingPackageIndex !== null) {
      newPackages[editingPackageIndex] = packageForm
    } else {
      newPackages.push(packageForm)
    }

    setLandingPage({ ...landingPage!, packages: newPackages })
    setPackageForm({ name: '', description: '', price: 0 })
    setShowPackageForm(false)
    setEditingPackageIndex(null)
  }

  const handleEditPackage = (index: number) => {
    setPackageForm(landingPage!.packages[index])
    setEditingPackageIndex(index)
    setShowPackageForm(true)
  }

  const handleDeletePackage = (index: number) => {
    const newPackages = landingPage!.packages.filter((_, i) => i !== index)
    setLandingPage({ ...landingPage!, packages: newPackages })
  }

  const handleSave = async () => {
    if (!landingPage || slugError) {
      alert('Please fix errors before saving')
      return
    }

    setSaving(true)
    try {
      if (landingPage.id) {
        await api.landingPages.update('', landingPage)
      } else {
        await api.landingPages.create('', landingPage)
      }
      await fetchLandingPage()
      alert('Landing page saved successfully!')
    } catch (error) {
      console.error('Error saving landing page:', error)
      alert('Failed to save landing page')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async () => {
    if (!landingPage) return

    const newStatus = !landingPage.is_active

    if (newStatus && !landingPage.slug) {
      alert('Please set a URL slug before activating')
      return
    }

    setLandingPage({ ...landingPage, is_active: newStatus })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  if (!landingPage) {
    return <div>Error loading landing page</div>
  }

  const landingPageUrl = generateLandingPageUrl(landingPage.slug)
  const suggestedSlugs = slugError ? suggestAlternativeSlugs(landingPage.slug) : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">My Landing Page</h1>
          <p className="text-gray-600 dark:text-gray-300">Create your personalized bakery landing page</p>
        </div>
        <div className="flex items-center space-x-4">
          {landingPage.is_active && (
            <a
              href={landingPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>View Live</span>
            </a>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !!slugError}
            className="flex items-center space-x-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Globe className="w-6 h-6 text-amber-600" />
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">Landing Page Status</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {landingPage.is_active ? 'Your landing page is live!' : 'Activate to make public'}
              </p>
            </div>
          </div>
          <label className="flex items-center space-x-3 cursor-pointer">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {landingPage.is_active ? 'Active' : 'Inactive'}
            </span>
            <div className="relative">
              <input
                type="checkbox"
                checked={landingPage.is_active}
                onChange={handleToggleActive}
                className="sr-only"
              />
              <div className={`w-14 h-7 rounded-full transition-colors ${landingPage.is_active ? 'bg-green-500' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${landingPage.is_active ? 'translate-x-7' : 'translate-x-0'}`}></div>
              </div>
            </div>
          </label>
        </div>

        {landingPage.is_active ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-green-800 dark:text-green-200">Your landing page URL:</p>
                <div className="flex items-center space-x-2 mt-2">
                  <code className="flex-1 bg-white dark:bg-gray-700 px-3 py-2 rounded text-sm">
                    {landingPageUrl}
                  </code>
                  <button
                    onClick={() => navigator.clipboard.writeText(landingPageUrl)}
                    className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-200">Landing page is not active</p>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  Complete your page setup and toggle the switch above to make it public
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'basic', label: 'Basic Info', icon: Info },
              { id: 'branding', label: 'Branding', icon: Palette },
              { id: 'gallery', label: 'Gallery', icon: ImageIcon },
              { id: 'packages', label: 'Packages', icon: Package },
              { id: 'social', label: 'Social Links', icon: Globe },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Page URL Slug
                </label>
                <input
                  type="text"
                  value={landingPage.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  placeholder="your-business-name"
                />
                {slugError && (
                  <div className="mt-2">
                    <p className="text-red-600 text-sm">{slugError}</p>
                    {suggestedSlugs.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Try these:</p>
                        <div className="flex flex-wrap gap-2">
                          {suggestedSlugs.map((slug) => (
                            <button
                              key={slug}
                              onClick={() => handleSlugChange(slug)}
                              className="text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                              {slug}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  This will be your landing page URL: {generateLandingPageUrl(landingPage.slug)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Business Tagline
                </label>
                <input
                  type="text"
                  value={landingPage.business_tagline || ''}
                  onChange={(e) => setLandingPage({ ...landingPage, business_tagline: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  placeholder="e.g., Handcrafted cakes made with love"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  About Your Business
                </label>
                <textarea
                  value={landingPage.about_text || ''}
                  onChange={(e) => setLandingPage({ ...landingPage, about_text: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Tell your customers about your business, your passion for baking, and what makes you unique..."
                />
              </div>
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={landingPage.primary_color}
                      onChange={(e) => setLandingPage({ ...landingPage, primary_color: e.target.value })}
                      className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={landingPage.primary_color}
                      onChange={(e) => setLandingPage({ ...landingPage, primary_color: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Secondary Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={landingPage.secondary_color}
                      onChange={(e) => setLandingPage({ ...landingPage, secondary_color: e.target.value })}
                      className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={landingPage.secondary_color}
                      onChange={(e) => setLandingPage({ ...landingPage, secondary_color: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Logo
                </label>
                {landingPage.logo_url ? (
                  <div className="relative inline-block">
                    <img src={landingPage.logo_url} alt="Logo" className="w-32 h-32 object-cover rounded-lg border" />
                    <button
                      onClick={() => setLandingPage({ ...landingPage, logo_url: null })}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Upload Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'logo')}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hero Image
                </label>
                {landingPage.hero_image_url ? (
                  <div className="relative inline-block">
                    <img src={landingPage.hero_image_url} alt="Hero" className="w-full h-48 object-cover rounded-lg border" />
                    <button
                      onClick={() => setLandingPage({ ...landingPage, hero_image_url: null })}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Upload Hero Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'hero')}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gallery Images
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {landingPage.gallery_images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img src={img.url} alt={img.alt} className="w-full h-32 object-cover rounded-lg border" />
                      <button
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {landingPage.gallery_images.length < 12 && (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                      <Plus className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Add Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'gallery')}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'packages' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Quick Purchase Packages</h3>
                <button
                  onClick={() => {
                    setShowPackageForm(true)
                    setEditingPackageIndex(null)
                    setPackageForm({ name: '', description: '', price: 0 })
                  }}
                  className="flex items-center space-x-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Package</span>
                </button>
              </div>

              {showPackageForm && (
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg space-y-4">
                  <input
                    type="text"
                    value={packageForm.name}
                    onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })}
                    placeholder="Package Name"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-gray-100"
                  />
                  <textarea
                    value={packageForm.description}
                    onChange={(e) => setPackageForm({ ...packageForm, description: e.target.value })}
                    placeholder="Package Description"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-gray-100"
                  />
                  <input
                    type="number"
                    value={packageForm.price}
                    onChange={(e) => setPackageForm({ ...packageForm, price: Number(e.target.value) })}
                    placeholder="Price (AUD)"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-gray-100"
                  />
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleSavePackage}
                      className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600"
                    >
                      Save Package
                    </button>
                    <button
                      onClick={() => {
                        setShowPackageForm(false)
                        setEditingPackageIndex(null)
                      }}
                      className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {landingPage.packages.map((pkg, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100">{pkg.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{pkg.description}</p>
                    <p className="text-lg font-bold text-amber-600 mt-2">${pkg.price} AUD</p>
                    <div className="flex items-center space-x-2 mt-4">
                      <button
                        onClick={() => handleEditPackage(index)}
                        className="text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePackage(index)}
                        className="text-sm bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1 rounded hover:bg-red-200 dark:hover:bg-red-900/50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={landingPage.social_instagram || ''}
                  onChange={(e) => setLandingPage({ ...landingPage, social_instagram: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  placeholder="https://instagram.com/yourbakery"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Facebook URL
                </label>
                <input
                  type="url"
                  value={landingPage.social_facebook || ''}
                  onChange={(e) => setLandingPage({ ...landingPage, social_facebook: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  placeholder="https://facebook.com/yourbakery"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Other Social Link
                </label>
                <input
                  type="url"
                  value={landingPage.social_other || ''}
                  onChange={(e) => setLandingPage({ ...landingPage, social_other: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  placeholder="https://your-website.com"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
