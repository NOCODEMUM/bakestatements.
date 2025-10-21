@@ .. @@
 import React from 'react';
-import { Link } from 'react-router-dom';
+import { Link, useLocation } from 'react-router-dom';
 import { useAuth } from '../contexts/AuthContext';
-import { LogOut, User, PieChart, FileText, Receipt } from 'lucide-react';
+import { LogOut, User, PieChart, FileText, Receipt, CreditCard } from 'lucide-react';
 
 export const Navbar: React.FC = () => {
   const { user, signOut } = useAuth();
+  const location = useLocation();
 
   return (
     <nav className="bg-white shadow-lg">
       <div className="max-w-7xl mx-auto px-4">
         <div className="flex justify-between h-16">
           <div className="flex">
             <div className="flex-shrink-0 flex items-center">
               <Link to="/" className="text-xl font-bold text-gray-800">
                 🐨 BakeStatements
               </Link>
             </div>
-            {user && (
+            {user && location.pathname !== '/pricing' && (
               <div className="hidden md:ml-6 md:flex md:space-x-8">
                 <Link
                   to="/dashboard"
                   className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                 >
@@ .. @@
                   <Receipt className="h-4 w-4 mr-2" />
                   Invoices
                 </Link>
+                <Link
+                  to="/pricing"
+                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
+                >
+                  <CreditCard className="h-4 w-4 mr-2" />
+                  Pricing
+                </Link>
               </div>
             )}
           </div>
@@ .. @@
             {user ? (
               <div className="flex items-center space-x-4">
                 <span className="text-gray-700">Welcome, {user.email}</span>
+                {location.pathname !== '/pricing' && (
+                  <Link
+                    to="/pricing"
+                    className="text-pink-600 hover:text-pink-800 px-3 py-2 text-sm font-medium"
+                  >
+                    Upgrade
+                  </Link>
+                )}
                 <button
                   onClick={signOut}
                   className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                 >
                   <LogOut className="h-4 w-4 mr-2" />
                   Sign Out
                 </button>
               </div>
             ) : (
               <div className="flex items-center space-x-4">
+                <Link
+                  to="/pricing"
+                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
+                >
+                  Pricing
+                </Link>
                 <Link
                   to="/login"
                   className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                 >
                   Sign In
                 </Link>
                 <Link
                   to="/signup"
                   className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                 >
                   Sign Up
                 </Link>
               </div>
             )}
           </div>
         </div>
       </div>
     </nav>
   );
 };