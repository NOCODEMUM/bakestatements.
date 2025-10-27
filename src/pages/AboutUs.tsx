import PublicHeader from '../components/PublicHeader'
import PublicFooter from '../components/PublicFooter'

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-amber-50">
      <PublicHeader />

      <main className="pt-8 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">About Us</h1>
            <p className="text-gray-600">Our story and journey with BakeStatements</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Journal: The PIX3L Story</h2>
          
          <div className="space-y-8">
            <div className="border-l-4 border-amber-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Entry: The Foundation (2020-2025)</h3>
              <p className="text-gray-700 leading-relaxed">
                It all started in 2020, right here in Sydney, Australia. We're P and James, a mum and dad team with 
                a shared passion for supporting makers and creators. What began as PIX3L – an ECO 3D printing press 
                crafting unique cookie cutters – became something much bigger. Over the past five years, we've built 
                deep relationships with bakers, crafters, and small business owners across Australia.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Through countless conversations, orders, and feedback sessions, we discovered something crucial: the 
                makers we serve needed more than just cookie cutters. They needed tools to manage their businesses, 
                track their finances, and streamline their operations. That insight sparked our evolution.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Entry: The Australian Opportunity</h3>
              <p className="text-gray-700 leading-relaxed">
                Australia's maker economy is at a tipping point. Small bakeries, craft businesses, and independent 
                creators are thriving, but they're often held back by clunky, expensive software that wasn't built 
                for them. After five years of working directly with this community, we understand their pain points 
                intimately – from ATO compliance challenges to recipe costing struggles.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                The timing couldn't be better. Australian small businesses are hungry for locally-made solutions 
                that understand their specific needs, regulations, and market dynamics. We're uniquely positioned 
                to serve them because we've been in the trenches alongside them.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Entry: Building the Ecosystem</h3>
              <p className="text-gray-700 leading-relaxed">
                Today, PIX3L is pivoting to create a comprehensive ecosystem of tools for Australian makers. 
                BakeStatements is our first step – purpose-built bakery management software that solves real 
                problems we've witnessed firsthand. But this is just the beginning.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Our vision extends beyond baking: we're building interconnected tools for the entire maker economy. 
                Inventory management for crafters, e-commerce solutions for small retailers, compliance tools for 
                food businesses – all designed with the same principles that made PIX3L successful: understanding 
                our users deeply, building for the Australian market specifically, and never losing sight of the 
                human element behind every business.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Five years of relationships have become our foundation. Now we're scaling that trust into 
                software that truly serves the Australian maker community.
              </p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">❤️</span>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-amber-800">From Makers to Makers</h4>
                <p className="text-amber-700 text-sm">P & James, The PIX3L Team</p>
              </div>
            </div>
            <p className="text-amber-800">
              Every tool we build is crafted with the deep understanding that comes from five years of walking
              alongside Australian makers. We're not just building software – we're building the infrastructure
              for a thriving maker economy. Thank you for being part of this journey.
            </p>
          </div>
        </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}