import { ReactNode, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../contexts/ThemeContext'
import {
  Home,
  ShoppingCart,
  Calendar,
  BookOpen,
  FileText,
  DollarSign,
  Settings,
  ChefHat,
  LogOut,
  Crown,
  Menu,
  X,
  Sun,
  Moon,
  Mail,
  Globe,
  Wrench
} from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

const navigationGroups = [
  {
    title: 'Core',
    items: [
      { name: 'Dashboard', href: '/', icon: Home },
      { name: 'Orders', href: '/orders', icon: ShoppingCart },
      { name: 'Calendar', href: '/calendar', icon: Calendar },
    ]
  },
  {
    title: 'Creative',
    items: [
      { name: 'Recipes', href: '/recipes', icon: BookOpen },
      { name: 'Equipment', href: '/equipment', icon: Wrench },
    ]
  },
  {
    title: 'Admin',
    items: [
      { name: 'Invoices', href: '/invoices', icon: FileText },
      { name: 'Expenses', href: '/expenses', icon: DollarSign },
      { name: 'Enquiries', href: '/enquiries', icon: Mail },
      { name: 'My Landing Page', href: '/my-landing-page', icon: Globe },
      { name: 'Settings', href: '/settings', icon: Settings },
    ]
  }
]

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { signOut, user, isTrialExpired } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      // Redirect to landing page after sign out
      window.location.href = '/landing'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-amber-50 dark:bg-gray-900">
      {/* Trial Expired Banner */}
      {isTrialExpired && (
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 relative z-50">
          <div className="flex items-center justify-center space-x-2">
            <Crown className="w-5 h-5" />
            <span className="font-medium">Your free trial has expired. Upgrade to continue using BakeStatements!</span>
            <button className="bg-white text-amber-600 px-4 py-1 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
              Upgrade Now - $19/month
            </button>
          </div>
        </div>
      )}

      {/* Mobile Header */}
      <header className="md:hidden bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between relative z-40">
        <div className="flex items-center space-x-3">
          <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg">
            <ChefHat className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">BakeStatements</h1>
          </div>
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        <div className={`
          w-64 bg-white dark:bg-gray-800 shadow-lg min-h-screen
          fixed md:relative z-50 md:z-auto
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 md:border-none">
            <button
              onClick={closeSidebar}
              className="md:hidden absolute top-4 right-4 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg">
                <ChefHat className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">BakeStatements</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Professional Bakery</p>
              </div>
            </div>
          </div>

          <nav className="px-4 pb-4 space-y-6">
            {navigationGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 mb-2">
                  {group.title}
                </h3>
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.href
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          onClick={closeSidebar}
                          className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                            isActive
                              ? 'bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 text-orange-600 dark:text-orange-400 shadow-sm border-l-4 border-orange-500'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-800 dark:hover:text-gray-100'
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>
          
          {/* User Profile & Controls at Bottom */}
          <div className="mt-auto px-4 py-3 border-t border-gray-200 dark:border-gray-700 space-y-4">
            {/* User Profile Section */}
            <div className="text-center">
              <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-teal-600 dark:text-teal-400 font-semibold text-sm">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="font-medium text-gray-800 dark:text-gray-100 text-xs truncate">{user?.email}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isTrialExpired ? 'Trial Expired' : 'Free Trial Active'}
              </p>
            </div>
            
            {/* Dark Mode Toggle */}
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {theme === 'dark' ? <Moon className="w-4 h-4 text-gray-600 dark:text-gray-300" /> : <Sun className="w-4 h-4 text-gray-600 dark:text-gray-300" />}
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {theme === 'dark' ? 'Dark' : 'Light'}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox"
                    className="sr-only peer" 
                    checked={theme === 'dark'}
                    onChange={toggleTheme}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-600"></div>
                </label>
              </div>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 border border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 group"
            >
              <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-sm">Sign Out</span>
            </button>
          </div>

        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <main className="p-4 md:pt-8 md:pl-8 md:pb-8 md:pr-8 relative flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="mt-auto border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
                <p className="text-gray-600 dark:text-gray-400 text-center sm:text-left">
                  © 2025 BakeStatements by{' '}
                  <a
                    href="https://www.pix3l.com.au"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium transition-colors"
                  >
                    PIX3L
                  </a>
                  . Made with ❤️ in Sydney, Australia.
                </p>
                <div className="flex items-center space-x-2 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-full">
                  <span>🇦🇺</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300 text-xs">
                    From the Creators of{' '}
                    <a
                      href="https://www.pix3l.com.au"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                    >
                      PIX3L
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}