import { Link } from 'react-router-dom'
import { ChefHat } from 'lucide-react'

export default function PublicFooter() {
  return (
    <>
      <section className="py-12 md:py-16 px-4 bg-white/80">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
            Acknowledgement of Country
          </h3>
          <p className="text-gray-600 leading-relaxed">
            BakeStatements acknowledges the Dharawal people as the Traditional Custodians of the
            land on which we operate in Macquarie Fields. We pay our respects to Elders past and
            present, and extend that respect to all Aboriginal and Torres Strait Islander peoples.
          </p>
        </div>
      </section>

      <footer className="py-12 md:py-16 px-4 bg-gray-800 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <ChefHat className="w-6 h-6 text-amber-600" />
                </div>
                <span className="text-xl font-bold">BakeStatements</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                The complete business management platform for Australian bakers.
                From hobby to profit, we're with you every step of the way.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white mb-4">Product</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/landing" className="text-gray-300 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/auth?mode=signup" className="text-gray-300 hover:text-white transition-colors">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link to="/enquiry" className="text-gray-300 hover:text-white transition-colors">
                    Get Quote
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white mb-4">Company</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/about-us" className="text-gray-300 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/enquiry" className="text-gray-300 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-terms" className="text-gray-300 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-terms" className="text-gray-300 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-700 gap-4">
            <p className="text-gray-400">
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
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <span>🇦🇺</span>
              <span className="font-semibold">
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
    </>
  )
}
