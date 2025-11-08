'use client';

import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { motion } from 'framer-motion';
import { Shield, Lock, Smartphone, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';

export default function Home() {
  const { user } = useUser();
  const [status, setStatus] = useState<string>('checking...');

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch('/api/connect');
        const json = await res.json();
        setStatus(json?.message ?? (json?.ok ? 'OK' : 'Unexpected response'));
      } catch (e: any) {
        setStatus(e?.message ?? 'fetch error');
      }
    }
    check();
  }, []);

  const features = [
    {
      icon: Shield,
      title: 'Secure Authentication',
      description: 'Enterprise-grade authentication powered by Auth0',
    },
    {
      icon: Smartphone,
      title: 'Device Management',
      description: 'Control your account across multiple devices with ease',
    },
    {
      icon: Lock,
      title: 'Enhanced Security',
      description: 'Limited to 3 concurrent devices for maximum security',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block"
              >
                <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <Shield className="h-10 w-10 text-white" />
                </div>
              </motion.div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Secure Device
                <br />
                <span className="text-blue-600">Authentication</span>
              </h1>

              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Enterprise-level security with intelligent device management.
                Stay protected across all your devices with seamless multi-device authentication.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {user ? (
                <Link href="/dashboard">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <a href="/api/auth/login">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow h-full">
                    <CardContent className="p-6 space-y-4">
                      <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                        <feature.icon className="h-7 w-7 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-16 bg-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <h3 className="font-semibold text-gray-900">Sign In</h3>
                  <p className="text-sm text-gray-600">
                    Authenticate securely with Auth0
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <h3 className="font-semibold text-gray-900">Complete Profile</h3>
                  <p className="text-sm text-gray-600">
                    Provide your details for a personalized experience
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <h3 className="font-semibold text-gray-900">Access Dashboard</h3>
                  <p className="text-sm text-gray-600">
                    Manage your account across up to 3 devices
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-500"
            >
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>3 Device Limit</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Real-time Monitoring</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Instant Notifications</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
