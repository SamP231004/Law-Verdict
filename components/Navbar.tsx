'use client';

import React from 'react';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { motion } from 'framer-motion';
import { LogOut, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { user, isLoading } = useUser();

  const handleLogout = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const base = process.env.NEXT_PUBLIC_AUTH0_BASE_URL || window.location.origin;
    window.location.href = `${base.replace(/\/$/, '')}/api/auth/logout`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500/95 backdrop-blur-lg shadow-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.45 }}
              className="flex items-center space-x-3"
            >
              <Link href="/" className="flex items-center space-x-2">
                <div className="p-1 bg-white/10 rounded-md shadow-sm">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <span className="text-white text-lg font-semibold tracking-tight">SecureAuth</span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ y: -6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="flex items-center space-x-3"
            >
              {!isLoading && (
                <>
                  {user ? (
                    <>
                      <Link href="/dashboard" className="hidden sm:inline">
                        <Button
                          variant="ghost"
                          className="text-white hover:bg-white/10 border-transparent transition-colors"
                        >
                          <User className="h-4 w-4 mr-2 text-white" />
                          <span>Dashboard</span>
                        </Button>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition transform hover:-translate-y-0.5"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <Link href="/api/auth/login">
                      <Button className="bg-white text-indigo-600 transition-all duration-200 hover:text-lg hover:bg-white">
                        Sign In
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </nav>
  );
}