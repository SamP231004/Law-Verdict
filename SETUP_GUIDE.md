# Quick Setup Guide

## Step 1: MongoDB Atlas Setup (5 minutes)

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Create a free cluster (M0 Sandbox)
4. **Create Database User**:
   - Go to "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Set username: `admin`
   - Set password: Generate a secure password
   - Set role: "Atlas Admin" or "Read and write to any database"
   - Click "Add User"

5. **Whitelist IP Address**:
   - Go to "Network Access" (left sidebar)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

6. **Get Connection String**:
   - Go to "Database" (left sidebar)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Example: `mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/deviceauth?retryWrites=true&w=majority`

## Step 2: Auth0 Setup (5 minutes)

1. Visit [Auth0](https://auth0.com/)
2. Sign up for a free account
3. **Create Application**:
   - Go to "Applications" → "Applications"
   - Click "Create Application"
   - Name: `SecureAuth`
   - Type: "Regular Web Applications"
   - Click "Create"

4. **Configure Settings**:
   - Go to the "Settings" tab
   - Scroll to "Application URIs"
   - Set these values:

   ```
   Allowed Callback URLs:
   http://localhost:3000/api/auth/callback, http://localhost:3000/api/auth/device-check

   Allowed Logout URLs:
   http://localhost:3000

   Allowed Web Origins:
   http://localhost:3000
   ```

   - Scroll down and click "Save Changes"

5. **Copy Credentials**:
   - Still in Settings tab, find:
     - Domain (e.g., `dev-abc123.us.auth0.com`)
     - Client ID (long string starting with letters)
     - Client Secret (click "Show" to reveal)

## Step 3: Project Setup (2 minutes)

1. **Copy environment variables**:
   ```bash
   cp .env.example .env.local
   ```

2. **Generate Auth0 Secret**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Copy the output.

3. **Edit `.env.local`**:
   ```env
   AUTH0_SECRET=paste_generated_secret_here
   AUTH0_BASE_URL=http://localhost:3000
   AUTH0_ISSUER_BASE_URL=https://YOUR_AUTH0_DOMAIN.auth0.com
   AUTH0_CLIENT_ID=your_client_id_here
   AUTH0_CLIENT_SECRET=your_client_secret_here
   MONGODB_URI=your_mongodb_connection_string_here
   MAX_DEVICES=3
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

6. **Visit**: [http://localhost:3000](http://localhost:3000)

## Step 4: Test the Application

1. **First Login**:
   - Click "Get Started" or "Sign In"
   - Sign up with email or social login
   - Complete your profile (name + phone)
   - See your dashboard

2. **Test Device Limit**:
   - Open 3 different browsers (Chrome, Firefox, Safari)
   - Login with same account in all 3
   - All should work fine
   - Open 4th browser and login
   - You'll see device conflict screen
   - Choose a device to disconnect
   - That device will be logged out

## Troubleshooting

### Auth0 "Invalid State" Error
- Clear browser cookies
- Double-check callback URLs in Auth0 dashboard
- Ensure `AUTH0_BASE_URL` matches exactly

### MongoDB Connection Error
- Verify connection string format
- Check username/password are correct
- Ensure IP is whitelisted
- Replace `<password>` in connection string

### Application Won't Start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## Deployment to Vercel

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add all environment variables from `.env.local`
   - Update `AUTH0_BASE_URL` to your Vercel URL
   - Deploy

3. **Update Auth0**:
   - Add Vercel URL to Auth0 callback/logout URLs
   - Format: `https://your-app.vercel.app/api/auth/callback`

## Support

For issues or questions, check:
- MongoDB Atlas connection status
- Auth0 application logs
- Browser console for errors
- Network tab for failed requests

All services used are **FREE** for this application!
