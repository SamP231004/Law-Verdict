# SecureAuth - Multi-Device Authentication System

A production-ready Next.js application featuring Auth0 authentication with intelligent N-device concurrency management (N=3). This application ensures that users can only be logged in on a maximum of 3 devices simultaneously, providing enhanced security and device management.

## Features

- **Auth0 Authentication**: Enterprise-grade authentication with social login support
- **Device Limit Management**: Maximum of 3 concurrent device sessions per account
- **Graceful Device Conflict Resolution**: Interactive UI for managing device conflicts
- **Real-time Session Monitoring**: Heartbeat mechanism to detect force logouts
- **User Profile Management**: Collect and display user's full name and phone number
- **Beautiful, Animated UI**: Professional design with Framer Motion animations
- **MongoDB Integration**: Secure storage for device sessions and user profiles

## Tech Stack

- **Frontend**: Next.js 13, React 18, TypeScript
- **Authentication**: Auth0
- **Database**: MongoDB Atlas
- **UI Components**: shadcn/ui, Tailwind CSS
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast

## Prerequisites

1. **Node.js** 16.x or higher
2. **MongoDB Atlas Account** (Free tier available)
3. **Auth0 Account** (Free tier available)

## Setup Instructions

### 1. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free account and cluster
3. Create a database user with password
4. Whitelist your IP address (or use 0.0.0.0/0 for all IPs during development)
5. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/`)

### 2. Auth0 Setup

1. Go to [Auth0](https://auth0.com/) and create an account
2. Create a new application:
   - Go to Applications → Create Application
   - Name: "SecureAuth"
   - Type: "Regular Web Applications"
   - Click Create

3. Configure Application Settings:
   - **Allowed Callback URLs**:
     ```
     http://localhost:3000/api/auth/callback,
     http://localhost:3000/api/auth/device-check
     ```
   - **Allowed Logout URLs**:
     ```
     http://localhost:3000
     ```
   - **Allowed Web Origins**:
     ```
     http://localhost:3000
     ```
   - Save Changes

4. Copy your credentials:
   - Domain (e.g., `dev-xxxxx.us.auth0.com`)
   - Client ID
   - Client Secret

### 3. Environment Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your credentials:

   ```env
   # Generate a random secret (at least 32 characters)
   AUTH0_SECRET=your_random_secret_here_at_least_32_characters_long

   # Your local development URL
   AUTH0_BASE_URL=http://localhost:3000

   # Auth0 credentials
   AUTH0_ISSUER_BASE_URL=https://YOUR_DOMAIN.auth0.com
   AUTH0_CLIENT_ID=your_client_id
   AUTH0_CLIENT_SECRET=your_client_secret

   # MongoDB connection string
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/deviceauth?retryWrites=true&w=majority

   # Device limit (default: 3)
   MAX_DEVICES=3
   ```

   **To generate AUTH0_SECRET**, run:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Architecture

### Device Session Flow

1. **Login**: User authenticates via Auth0
2. **Device Check**: System checks if device limit (3) is reached
3. **Conflict Resolution**: If limit reached, user must disconnect an existing device
4. **Profile Setup**: First-time users complete their profile (name + phone)
5. **Dashboard Access**: User gains access to private dashboard
6. **Heartbeat Monitoring**: Every 30 seconds, active sessions send heartbeats
7. **Force Logout Detection**: If a device is disconnected, it's notified on next heartbeat

### Database Schema

#### device_sessions Collection
```typescript
{
  userId: string,          // Auth0 user ID
  deviceId: string,        // Unique device identifier
  deviceName: string,      // Human-readable device name
  userAgent: string,       // Browser/device user agent
  lastActive: Date,        // Last heartbeat timestamp
  createdAt: Date          // Session creation time
}
```

#### user_profiles Collection
```typescript
{
  userId: string,          // Auth0 user ID
  fullName: string,        // User's full name
  phoneNumber: string,     // User's phone number
  email: string,           // User's email
  createdAt: Date,         // Profile creation time
  updatedAt: Date          // Last update time
}
```

## API Routes

### Authentication
- `GET /api/auth/login` - Initiate Auth0 login
- `GET /api/auth/logout` - Logout and clear session
- `GET /api/auth/callback` - Auth0 callback handler
- `GET /api/auth/device-check` - Check device limit after login

### Device Management
- `POST /api/device/check` - Check device status and conflicts
- `POST /api/device/register` - Register new device session
- `POST /api/device/remove` - Remove device session
- `POST /api/device/heartbeat` - Update device activity

### Profile
- `GET /api/profile/setup` - Get user profile
- `POST /api/profile/setup` - Create/update user profile

## Pages

- `/` - Public landing page
- `/dashboard` - Private user dashboard (requires auth)
- `/profile-setup` - Profile completion page
- `/device-conflict` - Device conflict resolution page

## Deployment

### Vercel Deployment

1. Push your code to GitHub

2. Import project to Vercel:
   ```bash
   vercel
   ```

3. Add environment variables in Vercel dashboard:
   - All variables from `.env.local`
   - Update `AUTH0_BASE_URL` to your production URL

4. Update Auth0 settings with production URLs:
   - Allowed Callback URLs: Add `https://your-domain.vercel.app/api/auth/callback`
   - Allowed Logout URLs: Add `https://your-domain.vercel.app`
   - Allowed Web Origins: Add `https://your-domain.vercel.app`

### Environment Variables for Production

Update these in Vercel:
- `AUTH0_BASE_URL`: Your production URL (e.g., `https://your-app.vercel.app`)
- All other variables remain the same

## Testing the N-Device Feature

1. Open the app in 3 different browsers (Chrome, Firefox, Safari) or incognito windows
2. Login with the same account in all 3 browsers
3. All 3 should work fine
4. Open a 4th browser and try to login
5. You'll see the device conflict screen
6. Select a device to disconnect
7. The disconnected device will be logged out on next activity

## Security Features

- **JWT Sessions**: Secure session management with Auth0
- **Device Fingerprinting**: Unique device identification
- **Session Monitoring**: Real-time heartbeat mechanism
- **Graceful Logouts**: Users are notified when force-logged out
- **Secure Cookies**: HttpOnly cookies for device tracking
- **MongoDB Connection**: Encrypted connections to database

## Troubleshooting

### Common Issues

1. **"Invalid state" error from Auth0**
   - Clear browser cookies and try again
   - Verify callback URLs in Auth0 dashboard

2. **MongoDB connection fails**
   - Check IP whitelist in MongoDB Atlas
   - Verify connection string format
   - Ensure database user has proper permissions

3. **Device limit not working**
   - Check MongoDB connection
   - Verify `MAX_DEVICES` environment variable
   - Check browser console for errors

4. **Heartbeat not working**
   - Ensure API routes are accessible
   - Check browser console for network errors
   - Verify device session exists in MongoDB

## License

MIT

## Author

Built with Next.js, Auth0, and MongoDB
