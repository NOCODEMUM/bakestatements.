import React from 'react'
import { ChefHat } from 'lucide-react'

export default function PrivacyTerms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-amber-100 p-2 rounded-lg">
                <ChefHat className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />
              </div>
              <span className="text-lg md:text-xl font-bold text-teal-600">BakeStatements</span>
            </div>
            
            {/* Back to Home */}
            <div className="flex items-center space-x-4">
              <a href="/landing" className="text-gray-600 hover:text-teal-600 font-medium transition-colors">
                Back to Home
              </a>
              <a 
                href="/auth" 
                className="bg-amber-500 text-white px-4 py-2 md:px-6 md:py-2 rounded-full font-bold hover:bg-amber-600 transition-colors shadow-lg"
              >
                Start Free Trial
              </a>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-8 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Page Header */}
            <div className="bg-gradient-to-r from-teal-600 to-amber-500 text-white p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Privacy Policy & Terms</h1>
              <p className="text-teal-100 text-sm md:text-base">
                Keeping your baking business data safe and secure
              </p>
            </div>

            <div className="p-6 md:p-8 space-y-12">
              {/* Privacy Policy Section */}
              <section>
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-2xl">📜</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Privacy Policy</h2>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 md:p-6 mb-6">
                  <p className="text-amber-800 font-medium">
                    PIX3L ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and protect your information when you use our service BakeStatements ("the Service").
                  </p>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 flex items-center">
                      <span className="bg-teal-100 text-teal-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                      Information We Collect
                    </h3>
                    <div className="ml-9 space-y-3">
                      <p className="text-gray-700"><strong>Account Information:</strong> name, email address, business name, ABN, payment details.</p>
                      <p className="text-gray-700"><strong>Usage Data:</strong> recipes, expenses, labels, and business card details you input.</p>
                      <p className="text-gray-700"><strong>Technical Data:</strong> browser type, device type, IP address, and cookies.</p>
                      <p className="text-gray-700"><strong>Communications:</strong> feedback, support queries, survey responses.</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 flex items-center">
                      <span className="bg-teal-100 text-teal-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                      How We Use Your Information
                    </h3>
                    <div className="ml-9 space-y-2">
                      <p className="text-gray-700">We use your data to:</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                        <li>Provide and improve the Service.</li>
                        <li>Generate summaries, reports, and invoices.</li>
                        <li>Customise your experience (e.g., ABN, recipes, labels).</li>
                        <li>Process payments and subscriptions.</li>
                        <li>Communicate updates, new features, or promotional offers (you can opt out anytime).</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 flex items-center">
                      <span className="bg-teal-100 text-teal-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                      Sharing of Information
                    </h3>
                    <div className="ml-9 space-y-2">
                      <p className="text-gray-700">We do not sell your data. We may share information only:</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                        <li>With trusted service providers (e.g., hosting, payment processors).</li>
                        <li>If required by law, regulation, or court order.</li>
                        <li>In the event of a merger, acquisition, or sale of assets.</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 flex items-center">
                      <span className="bg-teal-100 text-teal-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                      Data Security
                    </h3>
                    <div className="ml-9">
                      <p className="text-gray-700">We take reasonable steps to protect your data from unauthorised access, loss, or misuse. However, no system is 100% secure.</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 flex items-center">
                      <span className="bg-teal-100 text-teal-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">5</span>
                      Data Retention
                    </h3>
                    <div className="ml-9">
                      <p className="text-gray-700">We keep your data only as long as needed for business or legal purposes. You may request deletion of your account and data by contacting us.</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 flex items-center">
                      <span className="bg-teal-100 text-teal-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">6</span>
                      Access and Correction
                    </h3>
                    <div className="ml-9">
                      <p className="text-gray-700">Under the Australian Privacy Principles, you have the right to access, update, or correct your personal information. Email us at <a href="mailto:hello@pix3l.com.au" className="text-teal-600 hover:text-teal-700 font-medium">hello@pix3l.com.au</a> to make a request.</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 flex items-center">
                      <span className="bg-teal-100 text-teal-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">7</span>
                      Overseas Disclosure
                    </h3>
                    <div className="ml-9">
                      <p className="text-gray-700">Some service providers may be located outside Australia. Where your data is transferred overseas, we take steps to ensure appropriate protections are in place.</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 flex items-center">
                      <span className="bg-teal-100 text-teal-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">8</span>
                      Cookies & Analytics
                    </h3>
                    <div className="ml-9">
                      <p className="text-gray-700">We may use cookies and third-party analytics tools to improve user experience. You can disable cookies in your browser, but some features may not work.</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 flex items-center">
                      <span className="bg-teal-100 text-teal-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">9</span>
                      Complaints
                    </h3>
                    <div className="ml-9">
                      <p className="text-gray-700">If you believe your privacy has been breached, please contact us at <a href="mailto:hello@pix3l.com.au" className="text-teal-600 hover:text-teal-700 font-medium">hello@pix3l.com.au</a>. If unresolved, you may contact the Office of the Australian Information Commissioner (OAIC).</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 flex items-center">
                      <span className="bg-teal-100 text-teal-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">10</span>
                      Contact
                    </h3>
                    <div className="ml-9">
                      <p className="text-gray-700 mb-2">For any privacy-related questions, contact us at:</p>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium text-gray-800">PIX3L</p>
                        <p className="text-gray-700">PO Box 88</p>
                        <p className="text-gray-700">Macquarie Fields NSW 2564</p>
                        <p className="text-gray-700">Email: <a href="mailto:hello@pix3l.com.au" className="text-teal-600 hover:text-teal-700 font-medium">hello@pix3l.com.au</a></p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Terms & Conditions Section */}
              <section>
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-2xl">⚖️</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Terms & Conditions</h2>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6 mb-6">
                  <p className="text-blue-800 font-medium">
                    These Terms and Conditions ("Terms") govern your use of BakeStatements, provided by PIX3L ("we", "our", or "us"). By using our Service, you agree to these Terms.
                  </p>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 flex items-center">
                      <span className="bg-amber-100 text-amber-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                      Service
                    </h3>
                    <div className="ml-9">
                      <p className="text-gray-700">BakeStatements is a digital tool that helps bakers and small businesses manage expenses, generate reports, and streamline admin tasks. Features may change or improve over time.</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 flex items-center">
                      <span className="bg-amber-100 text-amber-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                      Eligibility
                    </h3>
                    <div className="ml-9">
                      <p className="text-gray-700">You must be at least 18 years old and capable of entering into a legally binding contract under Australian law.</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 flex items-center">
                      <span className="bg-amber-100 text-amber-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                      Accounts
                    </h3>
                    <div className="ml-9 space-y-2">
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>You are responsible for keeping your login secure.</li>
                        <li>You must provide accurate details, including your ABN (if applicable).</li>
                        <li>You are responsible for all activity under your account.</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 flex items-center">
                      <span className="bg-amber-100 text-amber-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                      Payments & Subscriptions
                    </h3>
                    <div className="ml-9 space-y-2">
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>Pricing is in AUD unless otherwise stated.</li>
                        <li>We offer a 7-day free trial, after which payment is required.</li>
                        <li>Lifetime memberships (if offered) are non-refundable.</li>
                        <li>Subscriptions renew automatically unless cancelled.</li>
                        <li>You may cancel at any time, but refunds are not provided unless required by law.</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 flex items-center">
                      <span className="bg-amber-100 text-amber-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">5</span>
                      Acceptable Use
                    </h3>
                    <div className="ml-9 space-y-2">
                      <p className="text-gray-700">You agree not to:</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                        <li>Misuse the Service for unlawful or fraudulent purposes.</li>
                        <li>Upload content that infringes copyright or intellectual property.</li>
                        <li>Attempt to reverse-engineer, copy, or resell the Service.</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 flex items-center">
                      <span className="bg-amber-100 text-amber-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">6</span>
                      Intellectual Property
                    </h3>
                    <div className="ml-9 space-y-2">
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>PIX3L owns all rights in the BakeStatements platform, branding, and content.</li>
                        <li>You retain ownership of your recipes, data, and uploaded content.</li>
                        <li>By using the Service, you grant us a licence to use your data solely to operate the Service.</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 flex items-center">
                      <span className="bg-amber-100 text-amber-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">7</span>
                      Limitation of Liability
                    </h3>
                    <div className="ml-9 space-y-2">
                      <p className="text-gray-700">To the maximum extent permitted by law:</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                        <li>We do not guarantee uninterrupted or error-free Service.</li>
                        <li>PIX3L is not liable for any loss of profits, revenue, or data arising from your use of BakeStatements.</li>
                        <li>Our total liability is limited to the subscription fees paid in the last 12 months.</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 flex items-center">
                      <span className="bg-amber-100 text-amber-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">8</span>
                      Termination
                    </h3>
                    <div className="ml-9">
                      <p className="text-gray-700">We may suspend or terminate accounts that breach these Terms. You may terminate at any time by cancelling your subscription.</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 flex items-center">
                      <span className="bg-amber-100 text-amber-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">9</span>
                      Governing Law
                    </h3>
                    <div className="ml-9">
                      <p className="text-gray-700">These Terms are governed by the laws of New South Wales, Australia. Any disputes will be subject to the jurisdiction of the courts of NSW.</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 flex items-center">
                      <span className="bg-amber-100 text-amber-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">10</span>
                      Changes to Terms
                    </h3>
                    <div className="ml-9">
                      <p className="text-gray-700">We may update these Terms from time to time. Continued use of the Service constitutes acceptance of the updated Terms.</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 flex items-center">
                      <span className="bg-amber-100 text-amber-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">11</span>
                      Contact
                    </h3>
                    <div className="ml-9">
                      <p className="text-gray-700 mb-3">For questions, email us at:</p>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium text-gray-800">PIX3L</p>
                        <p className="text-gray-700">PO Box 88</p>
                        <p className="text-gray-700">Macquarie Fields NSW 2564</p>
                        <p className="text-gray-700">Email: <a href="mailto:hello@pix3l.com.au" className="text-teal-600 hover:text-teal-700 font-medium">hello@pix3l.com.au</a></p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer CTA */}
            <div className="bg-gradient-to-r from-amber-50 to-teal-50 p-6 md:p-8 text-center border-t border-gray-200">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
                  Ready to Start Baking Success? 🍞
                </h3>
                <p className="text-gray-600 mb-6">
                  Join hundreds of Australian bakers who trust BakeStatements to manage their business
                </p>
                <a 
                  href="/auth" 
                  className="inline-block bg-amber-500 text-white px-6 py-3 md:px-8 md:py-4 rounded-full text-lg font-bold hover:bg-amber-600 transition-colors shadow-lg"
                >
                  Start Your Free 7-Day Trial
                </a>
                <p className="text-sm text-gray-500 mt-3">No credit card required • Cancel anytime</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Acknowledgement of Country */}
      <section className="py-12 md:py-16 px-4 bg-white/80">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-2xl mb-4 flex justify-center space-x-2">
            <span>🖤</span>
            <span>💛</span>
            <span>❤️</span>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Developed on Dharawal Country, in Macquarie Fields, NSW. We acknowledge the Traditional Custodians of this land
            <br />
            and pay our respects to Elders past and present.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-white/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-amber-100 p-2 rounded-lg">
              <ChefHat className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-lg font-bold text-gray-800">BakeStatements by PIX3L</span>
          </div>
          <p className="text-sm text-gray-500">
            © 2025 PIX3L. Made with ❤️ in Sydney, Australia.
          </p>
        </div>
      </footer>
    </div>
  )
}