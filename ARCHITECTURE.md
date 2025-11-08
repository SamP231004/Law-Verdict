# Application Architecture

## Overview

This is a production-ready Next.js application that implements Auth0 authentication with intelligent N-device concurrency management (N=3). The application ensures users can only be logged in on a maximum of 3 devices simultaneously.

## Tech Stack

- **Frontend Framework**: Next.js 13 (Pages Router)
- **Language**: TypeScript
- **Authentication**: Auth0 (OAuth 2.0 / OpenID Connect)
- **Database**: MongoDB Atlas
- **UI Framework**: React 18
- **Styling**: Tailwind CSS
- **Component Library**: shadcn/ui
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Browser                       │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Public    │  │   Private    │  │  Device Conflict │  │
│  │   Landing   │  │  Dashboard   │  │   Resolution     │  │
│  └──────┬──────┘  └──────┬───────┘  └────────┬─────────┘  │
│         │                  │                    │            │
│         └──────────────────┴────────────────────┘            │
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   Next.js API   │
                    │     Routes      │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
         ┌────▼────┐   ┌─────▼─────┐  ┌───▼───┐
         │  Auth0  │   │  MongoDB  │  │Device │
         │   API   │   │   Atlas   │  │Session│
         └─────────┘   └───────────┘  └───────┘
```

## Data Flow

### 1. Authentication Flow

```
User clicks "Sign In"
    ↓
Auth0 Login Page
    ↓
Auth0 validates credentials
    ↓
Callback to /api/auth/callback
    ↓
Redirect to /api/auth/device-check
    ↓
Check if device limit (3) reached
    ↓
├─ Not reached → /profile-setup
└─ Reached → /device-conflict
```

### 2. Device Session Management

```
User logs in
    ↓
Generate/Retrieve Device ID
    ↓
Check existing device sessions
    ↓
├─ < 3 devices → Register device
└─ ≥ 3 devices → Show conflict screen
                     ↓
            User selects device to disconnect
                     ↓
            Remove selected device session
                     ↓
            Register current device
```

### 3. Heartbeat Monitoring

```
Every 30 seconds (while logged in):
    ↓
Send heartbeat to /api/device/heartbeat
    ↓
Update lastActive timestamp
    ↓
Check if device still active
    ↓
├─ Active → Continue
└─ Inactive → Force logout
                  ↓
            Show "Force Logout" message
                  ↓
            Redirect to logout
```

## Database Schema

### Collections

#### 1. device_sessions
Stores active device sessions for each user.

```typescript
{
  _id: ObjectId,
  userId: string,           // Auth0 user ID (e.g., "auth0|123...")
  deviceId: string,         // UUID v4 device identifier
  deviceName: string,       // Human-readable name (e.g., "iPhone", "Mac")
  userAgent: string,        // Browser user agent string
  lastActive: Date,         // Last heartbeat timestamp
  createdAt: Date          // Session creation time
}

// Indexes
{userId: 1, deviceId: 1}   // Compound unique index
{userId: 1, lastActive: -1} // For querying user's devices
```

#### 2. user_profiles
Stores user profile information.

```typescript
{
  _id: ObjectId,
  userId: string,           // Auth0 user ID
  fullName: string,         // User's full name
  phoneNumber: string,      // User's phone number
  email: string,            // User's email (from Auth0)
  createdAt: Date,         // Profile creation time
  updatedAt: Date          // Last update time
}

// Indexes
{userId: 1}                 // Unique index
```

## API Routes

### Authentication Routes (`/api/auth/*`)

- **GET /api/auth/login**
  - Initiates Auth0 login flow
  - Redirects to Auth0 login page

- **GET /api/auth/callback**
  - Handles Auth0 callback
  - Sets up user session
  - Redirects to device-check

- **GET /api/auth/device-check**
  - Checks device limit after login
  - Redirects to conflict or profile-setup

- **GET /api/auth/logout**
  - Clears session and logs out user
  - Redirects to home page

### Device Management Routes (`/api/device/*`)

- **POST /api/device/check**
  ```typescript
  Request: { deviceId: string }
  Response: {
    isActive: boolean,
    hasConflict?: boolean,
    existingDevices?: Device[],
    deviceCount?: number,
    forceLogout?: boolean
  }
  ```

- **POST /api/device/register**
  ```typescript
  Request: { deviceId: string }
  Response: { success: boolean }
  // Also sets deviceId cookie
  ```

- **POST /api/device/remove**
  ```typescript
  Request: { deviceId: string }
  Response: { success: boolean }
  ```

- **POST /api/device/heartbeat**
  ```typescript
  Request: { deviceId: string }
  Response: {
    isActive: boolean,
    forceLogout?: boolean
  }
  ```

### Profile Routes (`/api/profile/*`)

- **GET /api/profile/setup**
  ```typescript
  Response: {
    profile: UserProfile | null
  }
  ```

- **POST /api/profile/setup**
  ```typescript
  Request: {
    fullName: string,
    phoneNumber: string
  }
  Response: { success: boolean }
  ```

## Pages

### Public Pages

#### `/` (index.tsx)
- Landing page with feature showcase
- Call-to-action for sign up/sign in
- Responsive design with animations
- Accessible to all users

### Protected Pages

#### `/dashboard` (dashboard.tsx)
- User's private dashboard
- Displays full name and phone number
- Shows security status
- Device management information
- Requires authentication

#### `/profile-setup` (profile-setup.tsx)
- First-time profile completion
- Collects full name and phone number
- Required before accessing dashboard
- Validates phone number format

#### `/device-conflict` (device-conflict.tsx)
- Shown when device limit reached
- Lists active devices with last active time
- Allows user to disconnect devices
- Force login or cancel options

## Components

### Core Components

#### `DeviceSessionManager`
- Manages device ID generation and storage
- Implements heartbeat mechanism
- Handles force logout detection
- Runs on all pages except landing

#### `Navbar`
- Navigation bar component
- Shows login/logout buttons
- User-aware navigation
- Responsive design

## Security Features

### 1. Session Management
- JWT-based authentication via Auth0
- HttpOnly cookies for device tracking
- Secure session storage
- Automatic session validation

### 2. Device Fingerprinting
- UUID v4 device identifiers
- Stored in localStorage
- Persistent across page reloads
- Unique per browser/device

### 3. Real-time Monitoring
- 30-second heartbeat interval
- Automatic stale session detection
- Graceful force logout handling
- User notification system

### 4. Data Protection
- MongoDB connection over TLS
- Environment variable protection
- No client-side sensitive data
- Server-side validation

## Configuration

### Environment Variables

```env
# Auth0 Configuration
AUTH0_SECRET=                # 32+ character secret
AUTH0_BASE_URL=             # Application URL
AUTH0_ISSUER_BASE_URL=      # Auth0 domain
AUTH0_CLIENT_ID=            # Auth0 client ID
AUTH0_CLIENT_SECRET=        # Auth0 client secret

# MongoDB Configuration
MONGODB_URI=                # MongoDB connection string

# Application Configuration
MAX_DEVICES=3               # Maximum concurrent devices
```

### Next.js Configuration

- Webpack fallbacks for MongoDB client-side
- ESM externals handling
- TypeScript and ESLint configuration
- Image optimization settings

## Deployment

### Vercel Deployment

1. **Prerequisites**
   - GitHub repository
   - Vercel account
   - MongoDB Atlas cluster
   - Auth0 application

2. **Steps**
   - Push code to GitHub
   - Import project in Vercel
   - Add environment variables
   - Update Auth0 callback URLs
   - Deploy

3. **Environment Updates**
   - `AUTH0_BASE_URL`: Production URL
   - Auth0: Add production callbacks
   - MongoDB: Whitelist Vercel IPs

## Performance Considerations

### Client-Side
- Code splitting by route
- Lazy loading for heavy components
- Optimized images
- Efficient re-renders with React keys

### Server-Side
- MongoDB connection pooling
- API route optimization
- Efficient database queries
- Indexed collections

### Caching
- Static page generation where possible
- API response optimization
- Browser caching for assets

## Error Handling

### Authentication Errors
- Invalid credentials → Auth0 error page
- Session expiry → Redirect to login
- Invalid state → Clear and retry

### Device Errors
- Connection failure → Retry mechanism
- Force logout → User notification
- Conflict → Resolution UI

### Database Errors
- Connection failure → Error logging
- Query errors → Graceful degradation
- Transaction failures → Rollback

## Testing Strategy

### Manual Testing
1. **Authentication Flow**
   - Sign up new user
   - Login existing user
   - Logout

2. **Device Limit**
   - Login on 3 devices
   - Attempt 4th device login
   - Verify conflict screen
   - Disconnect device
   - Verify force logout

3. **Profile Management**
   - Complete profile
   - View dashboard
   - Update information

### Browser Testing
- Chrome, Firefox, Safari
- Mobile browsers (iOS Safari, Chrome)
- Different screen sizes
- Incognito/private mode

## Monitoring

### Key Metrics
- Active user sessions
- Device session count
- Authentication success rate
- API response times
- Error rates

### Logging
- Authentication events
- Device registration/removal
- Force logout events
- Database errors
- API errors

## Future Enhancements

### Potential Features
1. Device naming and management
2. Login history
3. Email notifications for new devices
4. Suspicious activity detection
5. Two-factor authentication
6. Session timeout configuration
7. Device trust levels
8. Geographic tracking
9. Browser fingerprinting
10. Admin dashboard

### Technical Improvements
1. WebSocket for real-time updates
2. Redis for session management
3. Rate limiting
4. API versioning
5. Comprehensive test suite
6. CI/CD pipeline
7. Performance monitoring
8. Analytics integration

## Troubleshooting

### Common Issues

1. **"Invalid State" Auth0 Error**
   - Clear browser cookies
   - Verify callback URLs
   - Check AUTH0_BASE_URL

2. **MongoDB Connection Error**
   - Verify connection string
   - Check IP whitelist
   - Confirm credentials

3. **Device Limit Not Working**
   - Check MAX_DEVICES env variable
   - Verify MongoDB connection
   - Check browser console

4. **Heartbeat Failures**
   - Check API route accessibility
   - Verify device session exists
   - Check network tab

## License

MIT
