import { handleAuth, handleLogin, handleCallback, handleLogout } from '@auth0/nextjs-auth0';

const handler = handleAuth({
  login: handleLogin({
    returnTo: '/api/auth/device-check',
  }),
  callback: handleCallback({
    redirectUri: process.env.AUTH0_BASE_URL + '/api/auth/device-check',
  }),
  logout: handleLogout({
    returnTo: process.env.AUTH0_BASE_URL,
  }),
});

export default async function authRoute(req: any, res: any) {
  try {
    await Promise.resolve(handler(req, res));
  } catch (err: any) {
    console.error('Auth handler failure:', err);
    try {
      const base = process.env.NEXT_PUBLIC_AUTH0_BASE_URL || process.env.AUTH0_BASE_URL || '/';
      const redirectTo = `${(base || '').replace(/\/$/, '') || '/'}?auth_error=1`;
      return res.writeHead(302, { Location: redirectTo }).end();
    } catch (redirectErr) {
      return res.status(500).json({
        error: 'auth_handler_failure',
        message: err?.message || 'Unknown auth error. Check server logs.',
      });
    }
  }
}