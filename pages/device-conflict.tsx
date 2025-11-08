'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Smartphone, Monitor, AlertTriangle, LogOut, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';
import { getStoredDeviceId } from '@/lib/deviceManager';

interface Device {
  _id: string;
  deviceId: string;
  deviceName: string;
  lastActive: string;
}

export default function DeviceConflict() {
  const router = useRouter();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    checkDevices();
  }, []);

  const checkDevices = async () => {
    try {
      const deviceId = getStoredDeviceId();
      const response = await fetch('/api/device/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.hasConflict && data.existingDevices) {
          setDevices(data.existingDevices);
        } else {
          router.push('/profile-setup');
        }
      }
    } catch (error) {
      console.error('Error checking devices:', error);
      toast.error('Failed to check devices');
    } finally {
      setLoading(false);
    }
  };

  const handleForceLogin = async (deviceToRemove: string) => {
    setProcessing(true);
    try {
      const removeResponse = await fetch('/api/device/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId: deviceToRemove }),
      });

      if (!removeResponse.ok) {
        throw new Error('Failed to remove device');
      }

      const currentDeviceId = getStoredDeviceId();
      const registerResponse = await fetch('/api/device/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId: currentDeviceId }),
      });

      if (!registerResponse.ok) {
        throw new Error('Failed to register device');
      }

      toast.success('Device disconnected successfully');
      router.push('/profile-setup');
    } catch (error) {
      console.error('Error forcing login:', error);
      toast.error('Failed to force login');
      setProcessing(false);
    }
  };

  const handleCancelLogin = () => {
    window.location.href = '/api/auth/logout';
  };

  const getDeviceIcon = (deviceName: string) => {
    const name = deviceName.toLowerCase();
    if (name.includes('mobile') || name.includes('iphone') || name.includes('android')) {
      return <Smartphone className="h-6 w-6 text-blue-600" />;
    }
    return <Monitor className="h-6 w-6 text-blue-600" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Device Limit Reached</CardTitle>
            <CardDescription className="text-base">
              You have reached the maximum number of concurrent devices (3). Please disconnect one device to continue.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-gray-900">Active Devices:</h3>
              {devices.map((device, index) => (
                <motion.div
                  key={device.deviceId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {getDeviceIcon(device.deviceName)}
                    <div>
                      <p className="font-medium text-gray-900">{device.deviceName}</p>
                      <p className="text-sm text-gray-500">Last active: {formatDate(device.lastActive)}</p>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleForceLogin(device.deviceId)}
                    disabled={processing}
                    className="flex items-center space-x-1"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Disconnect</span>
                  </Button>
                </motion.div>
              ))}
            </div>

            <div className="pt-4 border-t">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleCancelLogin}
                disabled={processing}
              >
                Cancel Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
