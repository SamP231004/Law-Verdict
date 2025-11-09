import '@/app/globals.css';
import type { AppProps } from 'next/app';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Toaster } from 'react-hot-toast';
import DeviceSessionManager from '@/components/DeviceSessionManager';
import Script from 'next/script'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Script src="http://localhost:3000/script.js" data-website-id="2a6cd30e-df8c-4117-9f5e-08e4cd8a3ee5" />
      <DeviceSessionManager>
        <Component {...pageProps} />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#363636',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              borderRadius: '12px',
              padding: '16px',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </DeviceSessionManager>
    </UserProvider>
  );
}
