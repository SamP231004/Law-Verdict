import { handleAuth, handleLogin, handleCallback } from '@auth0/nextjs-auth0';

export default handleAuth({
  login: handleLogin({
    returnTo: '/api/auth/device-check',
  }),
  callback: handleCallback({
    redirectUri: process.env.AUTH0_BASE_URL + '/api/auth/device-check',
  }),
});
