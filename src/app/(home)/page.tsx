// app/login/page.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSidebarContext } from "@/components/Layouts/sidebar/sidebar-context";

export default function LoginPage() {
  const { setSidebarEnabled } = useSidebarContext();

  useEffect(() => {
    // Hide sidebar on login page
    setSidebarEnabled(false);
    
    // Show sidebar again when leaving this page
    return () => {
      setSidebarEnabled(true);
    };
  }, [setSidebarEnabled]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        {/* Your login form here */}
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input 
              type="email" 
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input 
              type="password" 
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter your password"
            />
          </div>
          
          {/* Change button to Link */}
          <Link 
            href="/dashboard" // Change this to your target page
            className="block w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-center"
          >
            Sign In
          </Link>
        </form>
      </div>
    </div>
  );
}