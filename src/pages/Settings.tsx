import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { User, Building, Hash, Phone, Save, CheckCircle, Crown, ArrowUpRight } from 'lucide-react'

interface ProfileData {
  business_name: string | null
  phone_number: string | null
  abn: string | null
}

export default function Settings() {
  const navigate = useNavigate()
  const { user, isTrialExpired, updateProfile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    business_name: '',
    phone_number: '',
    abn: ''
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        business_name: user.business_name || '',
        phone_number: user.phone_number || '',
        abn: user.abn || ''
      })
      setLoading(false)
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setSaving(true)

    try {
      await updateProfile(profileData)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error saving profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Settings</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage your business profile and account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Form */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Business Profile</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">This information will appear on your invoices</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Email Address</span>
                </div>
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4" />
                  <span>Business Name</span>
                </div>
              </label>
              <input
                type="text"
                value={profileData.business_name || ''}
                onChange={(e) => setProfileData({ ...profileData, business_name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-colors"
                placeholder="e.g., Sweet Treats Bakery"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <div className="flex items-center space-x-2">
                  <Hash className="w-4 h-4" />
                  <span>ABN (Australian Business Number)</span>
                </div>
              </label>
              <input
                type="text"
                value={profileData.abn || ''}
                onChange={(e) => setProfileData({ ...profileData, abn: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-colors"
                placeholder="e.g., 12 345 678 901"
                maxLength={14}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This will appear on your invoices</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Phone Number</span>
                </div>
              </label>
              <input
                type="tel"
                value={profileData.phone_number || ''}
                onChange={(e) => setProfileData({ ...profileData, phone_number: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-colors"
                placeholder="e.g., +61 2 1234 5678"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-amber-500 text-white py-3 px-6 rounded-lg hover:bg-amber-600 focus:ring-4 focus:ring-amber-300 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : saved ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Account Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 h-fit">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Account Information</h2>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Account Status</h3>
              {user?.subscription_status === 'lifetime' ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  <Crown className="w-3 h-3 mr-1" />
                  Lifetime Member
                </span>
              ) : user?.subscription_status === 'active' ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Active
                </span>
              ) : user?.subscription_status === 'past_due' ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  Payment Due
                </span>
              ) : user?.subscription_status === 'cancelled' ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                  Cancelled
                </span>
              ) : isTrialExpired ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                  Trial Expired
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Active Trial
                </span>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subscription Plan</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user?.subscription_status === 'lifetime' ? (
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    Founder's Lifetime Access
                  </span>
                ) : user?.subscription_tier === 'annual' ? (
                  <span className="font-semibold text-teal-600 dark:text-teal-400">
                    Annual Plan ($180/year)
                  </span>
                ) : user?.subscription_tier === 'monthly' ? (
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    Monthly Plan ($19/month)
                  </span>
                ) : (
                  '7-Day Free Trial'
                )}
              </p>
              {user?.trial_end_date && !user?.subscription_tier && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Trial ends: {new Date(user.trial_end_date).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Upgrade Options */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
              {user?.subscription_status === 'lifetime' ? (
                <div className="text-center py-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You have lifetime access! Thank you for being a founding member.
                  </p>
                </div>
              ) : user?.subscription_tier === 'annual' ? (
                <>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    Want to secure lifetime access? Upgrade to our Founder's plan.
                  </p>
                  <button
                    onClick={() => navigate('/pricing')}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    <Crown className="w-4 h-4" />
                    <span>Upgrade to Lifetime</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </>
              ) : user?.subscription_tier === 'monthly' ? (
                <>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    Save $48/year with annual billing, or get lifetime access!
                  </p>
                  <button
                    onClick={() => navigate('/pricing')}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
                  >
                    <span>Upgrade to Annual</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate('/pricing')}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    <Crown className="w-4 h-4" />
                    <span>Get Lifetime Access</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    {isTrialExpired
                      ? 'Your trial has ended. Choose a plan to continue.'
                      : 'Enjoying BakeStatements? Upgrade anytime to continue after your trial.'
                    }
                  </p>
                  <button
                    onClick={() => navigate('/pricing')}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-teal-500 text-white rounded-lg hover:from-amber-600 hover:to-teal-600 transition-colors text-sm font-medium"
                  >
                    <Crown className="w-4 h-4" />
                    <span>View Plans & Pricing</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Need help? Contact support at{' '}
                <a href="mailto:hello@pix3l.com.au" className="text-amber-600 hover:text-amber-700">
                  hello@pix3l.com.au
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}