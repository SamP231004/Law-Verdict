'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@auth0/nextjs-auth0/client';
import { motion } from 'framer-motion';
import { User, Phone, Mail, Shield, Smartphone, Monitor } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';

interface UserProfile {
  fullName: string;
  phoneNumber: string;
  email: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
      return;
    }

    if (user) {
      loadProfile();
    }
  }, [user, isLoading]);

  const loadProfile = async () => {
    try {
      const response = await fetch('/api/profile/setup');
      if (response.ok) {
        const data = await response.json();
        if (data.profile) {
          setProfile(data.profile);
        } else {
          router.push('/profile-setup');
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50">
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold text-gray-900">
                Welcome Back, {profile?.fullName}!
              </h1>
              <p className="text-lg text-gray-600">
                Your secure dashboard
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 }}
              >
                <Card className="shadow-2xl border-0 hover:shadow-2xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-cyan-100 rounded-lg flex items-center justify-center">
                        <User className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Your personal details</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <User className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-semibold text-gray-900">{profile?.fullName}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <p className="font-semibold text-gray-900">{profile?.phoneNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-semibold text-gray-900">{profile?.email}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 }}
              >
                <Card className="shadow-2xl border-0 hover:shadow-2xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-teal-100 rounded-lg flex items-center justify-center">
                        <Shield className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <CardTitle>Security Status</CardTitle>
                        <CardDescription>Your account security</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Shield className="h-5 w-5 text-green-600" />
                        <p className="font-semibold text-green-900">Account Secure</p>
                      </div>
                      <p className="text-sm text-green-700">
                        Your account is protected with device management
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Monitor className="h-5 w-5 text-blue-600" />
                          <span className="text-sm font-medium">Max Devices</span>
                        </div>
                        <span className="font-bold text-blue-600">3</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Smartphone className="h-5 w-5 text-blue-600" />
                          <span className="text-sm font-medium">Current Device</span>
                        </div>
                        <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                          Active
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>About Device Management</CardTitle>
                  <CardDescription>
                    How your account security works
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-gray-700">
                  <p>
                    Your account is limited to <strong>3 concurrent devices</strong> for enhanced security.
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>You can be logged in on up to 3 devices simultaneously</li>
                    <li>If you try to log in from a 4th device, you'll need to disconnect one existing device</li>
                    <li>Disconnected devices will be notified when they return to the app</li>
                    <li>Your sessions are continuously monitored for security</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}