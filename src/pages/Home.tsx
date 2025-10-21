@@ .. @@
       </section>

       {/* CTA Section */}
       <section className="bg-pink-50 py-16">
         <div className="max-w-4xl mx-auto text-center px-4">
           <h2 className="text-3xl font-bold text-gray-900 mb-4">
             Ready to Transform Your Bakery Business?
           </h2>
           <p className="text-xl text-gray-600 mb-8">
             Join thousands of bakers who trust BakeStatements for their financial management
           </p>
+          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
+            <Link
+              to="/pricing"
+              className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
+            >
+              View Pricing
+            </Link>
+            <Link
+              to="/signup"
+              className="inline-block bg-white hover:bg-gray-50 text-pink-600 font-bold py-3 px-8 rounded-lg border-2 border-pink-600 transition-colors"
+            >
+              Start Free Trial
+            </Link>
+          </div>
+          <p className="mt-4 text-sm text-gray-500">
+            7-day free trial • No credit card required
+          </p>
-          <Link
-            to="/signup"
-            className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
-          >
-            Start Free Trial - No Credit Card Required
-          </Link>
         </div>
       </section>
     </div>
   );
 };