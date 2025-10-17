import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { Mail, Instagram, Facebook, Globe, Send, CheckCircle } from 'lucide-react'

interface LandingPageData {
  id: string
  slug: string
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
  profiles: {
    business_name: string
    email: string
    phone_number: string | null
  }
}

export default function BakerLandingPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [landingPage, setLandingPage] = useState<LandingPageData | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  useEffect(() => {
    if (slug) {
      fetchLandingPage()
    }
  }, [slug])

  const fetchLandingPage = async () => {
    try {
      const response = await api.landingPages.getBySlug(slug!)
      if (response.landingPage) {
        setLandingPage(response.landingPage)
        document.title = response.landingPage.profiles.business_name || 'Baker Landing Page'
      } else {
        navigate('/404')
      }
    } catch (error) {
      console.error('Error fetching landing page:', error)
      navigate('/404')
    } finally {
      setLoading(false)
    }
  }

  const handlePackageClick = (packageName: string) => {
    setSelectedPackage(packageName)
    setFormData({
      ...formData,
      message: `Hi! I'm interested in your "${packageName}" package. Please provide more details.`
    })
    const enquirySection = document.getElementById('enquiry')
    if (enquirySection) {
      enquirySection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await api.enquiries.create({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        package_selected: selectedPackage || null,
        landing_page_id: landingPage?.id,
        user_id: null,
        status: 'New'
      })
      setSubmitted(true)
      setFormData({ name: '', email: '', phone: '', message: '' })
      setSelectedPackage('')
    } catch (error) {
      console.error('Error submitting enquiry:', error)
      alert('There was an error submitting your enquiry. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  if (!landingPage) {
    return null
  }

  const styles = {
    '--primary-color': landingPage.primary_color,
    '--secondary-color': landingPage.secondary_color,
  } as React.CSSProperties

  return (
    <div className="min-h-screen bg-gray-50" style={styles}>
      <style>
        {`
          .btn-primary {
            background-color: var(--primary-color);
          }
          .btn-primary:hover {
            filter: brightness(0.9);
          }
          .btn-secondary {
            background-color: var(--secondary-color);
          }
          .btn-secondary:hover {
            filter: brightness(0.9);
          }
          .text-primary {
            color: var(--primary-color);
          }
          .text-secondary {
            color: var(--secondary-color);
          }
          .border-primary {
            border-color: var(--primary-color);
          }
        `}
      </style>

      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {landingPage.logo_url && (
                <img src={landingPage.logo_url} alt="Logo" className="h-12 w-auto" />
              )}
              <h1 className="text-2xl font-bold text-gray-800">{landingPage.profiles.business_name}</h1>
            </div>
            <a
              href="#enquiry"
              className="btn-primary text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Get Quote
            </a>
          </div>
        </div>
      </header>

      <section className="relative h-96 bg-gray-800">
        {landingPage.hero_image_url ? (
          <img
            src={landingPage.hero_image_url}
            alt="Hero"
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-100 to-teal-100"></div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="text-center text-white px-4">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{landingPage.profiles.business_name}</h2>
            {landingPage.business_tagline && (
              <p className="text-xl md:text-2xl">{landingPage.business_tagline}</p>
            )}
          </div>
        </div>
      </section>

      {landingPage.about_text && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">About Us</h2>
            <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-line">
              {landingPage.about_text}
            </p>
          </div>
        </section>
      )}

      {landingPage.gallery_images.length > 0 && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Work</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {landingPage.gallery_images.map((img, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow">
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {landingPage.packages.length > 0 && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Quick Packages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {landingPage.packages.map((pkg, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{pkg.name}</h3>
                  <p className="text-gray-600 mb-4">{pkg.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">${pkg.price} AUD</span>
                    <button
                      onClick={() => handlePackageClick(pkg.name)}
                      className="btn-secondary text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="enquiry" className="py-16 px-4 bg-gradient-to-br from-teal-50 to-amber-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Get in Touch</h2>

          {submitted ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Thank You!</h3>
              <p className="text-gray-600 mb-6">
                Your enquiry has been submitted successfully. We'll get back to you within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn-primary text-white px-6 py-2 rounded-lg"
              >
                Submit Another Enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
              {selectedPackage && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-amber-800">
                    Enquiring about: <span className="font-bold">{selectedPackage}</span>
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="+61 XXX XXX XXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Tell us about your order requirements..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Enquiry</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">{landingPage.profiles.business_name}</h3>
              {landingPage.profiles.email && (
                <p className="flex items-center space-x-2 mb-2">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${landingPage.profiles.email}`} className="hover:text-amber-400">
                    {landingPage.profiles.email}
                  </a>
                </p>
              )}
              {landingPage.profiles.phone_number && (
                <p className="text-gray-300 mb-2">{landingPage.profiles.phone_number}</p>
              )}
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                {landingPage.social_instagram && (
                  <a
                    href={landingPage.social_instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-400 transition-colors"
                  >
                    <Instagram className="w-6 h-6" />
                  </a>
                )}
                {landingPage.social_facebook && (
                  <a
                    href={landingPage.social_facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-400 transition-colors"
                  >
                    <Facebook className="w-6 h-6" />
                  </a>
                )}
                {landingPage.social_other && (
                  <a
                    href={landingPage.social_other}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-400 transition-colors"
                  >
                    <Globe className="w-6 h-6" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700 text-center space-y-3">
            <p className="text-gray-400">
              Powered by{' '}
              <a href="/landing" className="text-amber-400 hover:text-amber-300 font-medium">
                BakeStatements
              </a>
            </p>
            <p className="text-gray-400 text-sm">
              © 2025 BakeStatements by{' '}
              <a
                href="https://www.pix3l.com.au"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
              >
                PIX3L
              </a>
              . Made with ❤️ in Sydney, Australia.
            </p>
            <div className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full inline-flex">
              <span>🇦🇺</span>
              <span className="font-semibold text-sm">
                From the Creators of{' '}
                <a
                  href="https://www.pix3l.com.au"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-300 hover:text-amber-200 transition-colors"
                >
                  PIX3L
                </a>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
