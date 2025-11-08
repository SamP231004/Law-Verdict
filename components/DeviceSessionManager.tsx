'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { generateDeviceId, getStoredDeviceId, storeDeviceId, clearDeviceId } from '@/lib/deviceManager';
import toast from 'react-hot-toast';

const HEARTBEAT_INTERVAL = 30000;

export default function DeviceSessionManager({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const deviceIdRef = useRef<string | null>(null);

  useEffect(() => {
    let deviceId = getStoredDeviceId();

    if (!deviceId) {
      deviceId = generateDeviceId();
      storeDeviceId(deviceId);
    }

    deviceIdRef.current = deviceId;

    const startHeartbeat = () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }

      heartbeatIntervalRef.current = setInterval(async () => {
        try {
          const response = await fetch('/api/device/heartbeat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deviceId: deviceIdRef.current }),
          });

          if (response.ok) {
            const data = await response.json();

            if (data.forceLogout) {
              if (heartbeatIntervalRef.current) {
                clearInterval(heartbeatIntervalRef.current);
              }
              clearDeviceId();
              toast.error('You have been logged out because this device was disconnected from another location.');
              setTimeout(() => {
                window.location.href = '/api/auth/logout';
              }, 2000);
            }
          }
        } catch (error) {
          console.error('Heartbeat error:', error);
        }
      }, HEARTBEAT_INTERVAL);
    };

    if (router.pathname !== '/' && !router.pathname.startsWith('/api')) {
      startHeartbeat();
    }

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    };
  }, [router.pathname]);

  return <>{children}</>;
}
