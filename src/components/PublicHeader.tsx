import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChefHat, Menu, X } from 'lucide-react'

interface PublicHeaderProps {
  showAuth?: boolean
}

export default function PublicHeader({ showAuth = true }: PublicHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link to="/landing" className="flex items-center space-x-3">
            <div className="bg-amber-100 p-2 rounded-lg">
              <ChefHat className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />
            </div>
            <span className="text-lg md:text-xl font-bold text-teal-600">BakeStatements</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/landing" className="text-gray-600 hover:text-teal-600 font-medium transition-colors">
              Home
            </Link>
            <Link to="/about-us" className="text-gray-600 hover:text-teal-600 font-medium transition-colors">
              About
            </Link>
            <Link to="/enquiry" className="text-gray-600 hover:text-teal-600 font-medium transition-colors">
              Contact
            </Link>
            <Link to="/privacy-terms" className="text-gray-600 hover:text-teal-600 font-medium transition-colors">
              Privacy
            </Link>
            {showAuth && (
              <>
                <Link to="/auth" className="text-gray-600 hover:text-teal-600 font-medium transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/auth"
                  className="bg-amber-500 text-white px-4 py-2 md:px-6 md:py-2 rounded-full font-bold hover:bg-amber-600 transition-colors shadow-lg"
                >
                  Start Free Trial
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              <Link
                to="/landing"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-gray-600 hover:text-teal-600 font-medium"
              >
                Home
              </Link>
              <Link
                to="/about-us"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-gray-600 hover:text-teal-600 font-medium"
              >
                About
              </Link>
              <Link
                to="/enquiry"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-gray-600 hover:text-teal-600 font-medium"
              >
                Contact
              </Link>
              <Link
                to="/privacy-terms"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-gray-600 hover:text-teal-600 font-medium"
              >
                Privacy
              </Link>
              {showAuth && (
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <Link
                    to="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-gray-600 hover:text-teal-600 font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block bg-amber-500 text-white text-center py-3 px-4 rounded-lg font-bold hover:bg-amber-600 transition-colors"
                  >
                    Start Free Trial
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
