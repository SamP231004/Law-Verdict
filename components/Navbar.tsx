'use client';

import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { motion } from 'framer-motion';
import { LogOut, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { user, isLoading } = useUser();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">SecureAuth</span>
          </Link>

          <div className="flex items-center space-x-4">
            {!isLoading && (
              <>
                {user ? (
                  <>
                    <Link href="/dashboard">
                      <Button variant="ghost" className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Button>
                    </Link>
                    <a href="/api/auth/logout">
                      <Button variant="outline" className="flex items-center space-x-2">
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </Button>
                    </a>
                  </>
                ) : (
                  <a href="/api/auth/login">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Sign In
                    </Button>
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
