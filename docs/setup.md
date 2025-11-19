# Setup Guide for Project Red

Follow these steps to get your reviewer library website up and running.

## 🎯 Quick Setup Checklist

- [ ] MongoDB Atlas account created
- [ ] Cloudflare R2 account created
- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Application running locally

## 📝 Detailed Setup Instructions

### Step 1: MongoDB Atlas Setup (5 minutes)

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Click "Try Free"
   - Sign up with email (NO credit card required)

2. **Create Cluster**
   - Choose "M0 Sandbox" (FREE tier)
   - Select your preferred region
   - Click "Create Deployment"

3. **Create Database User**
   - Username: `reviewer-admin` (or your choice)
   - Password: Click "Autogenerate Secure Password" and save it
   - Click "Create Database User"

4. **Configure Network Access**
   - Click "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access From Anywhere" (or add your specific IP)
   - Click "Confirm"

5. **Get Connection String**
   - Click "Database" in left sidebar
   - Click "Connect" on your cluster
   - Select "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<database>` with `reviewer-library`

   Example:
   ```
   mongodb+srv://reviewer-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/reviewer-library?retryWrites=true&w=majority
   ```

### Step 2: Cloudflare R2 Setup (10 minutes)

1. **Create Cloudflare Account**
   - Go to https://dash.cloudflare.com/sign-up
   - Sign up with email (NO credit card required)

2. **Enable R2**
   - Go to https://dash.cloudflare.com/
   - Click "R2" in left sidebar
   - Click "Get Started" or "Create Bucket"

3. **Create Bucket**
   - Bucket name: `reviewer-files` (must be globally unique, try `reviewer-files-yourname`)
   - Location: Automatic
   - Click "Create Bucket"

4. **Configure Public Access**
   - Click on your bucket name
   - Go to "Settings" tab
   - Scroll to "Public Access"
   - Click "Allow Access"
   - Copy the "Public Bucket URL" (something like `https://pub-xxxxx.r2.dev`)

5. **Create API Token**
   - Go back to R2 main page
   - Click "Manage R2 API Tokens"
   - Click "Create API Token"
   - Token Name: `reviewer-app`
   - Permissions: "Object Read & Write"
   - Select your bucket
   - Click "Create API Token"
   - **IMPORTANT**: Copy and save these values:
     - Access Key ID
     - Secret Access Key
     - Account ID (shown at top of page)

6. **Configure CORS (Important!)**
   - Go to your bucket
   - Click "Settings" tab
   - Scroll to "CORS Policy"
   - Click "Edit"
   - Add this configuration:
   ```json
   [
     {
       "AllowedOrigins": ["http://localhost:3000", "https://your-domain.com"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
       "AllowedHeaders": ["*"],
       "ExposeHeaders": ["ETag"],
       "MaxAgeSeconds": 3000
     }
   ]
   ```

### Step 3: Configure Environment Variables

1. **Create .env.local file**
   - In the `project-red` folder, create a file named `.env.local`
   - Add the following (replace with your actual values):

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://reviewer-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/reviewer-library?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=http://localhost:3000

# Cloudflare R2 Configuration
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_BUCKET_NAME=reviewer-files
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

2. **Generate NextAuth Secret**
   
   **On Windows (PowerShell):**
   ```powershell
   -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
   ```
   
   **On Windows (Git Bash/WSL):**
   ```bash
   openssl rand -base64 32
   ```
   
   Copy the output and paste it as your `NEXTAUTH_SECRET`

### Step 4: Install Dependencies

Open PowerShell in the project folder and run:

```powershell
npm install --legacy-peer-deps
```

This may take 2-3 minutes. The `--legacy-peer-deps` flag is required due to Next.js 15 compatibility.

### Step 5: Run the Application

```powershell
npm run dev
```

You should see:
```
▲ Next.js 15.0.3
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Ready in 3.2s
```

### Step 6: Test the Application

1. **Open Browser**
   - Go to http://localhost:3000
   - You should see the homepage with "No reviewers yet" message

2. **Create Account**
   - Click "Sign Up"
   - Enter name, email, and password
   - Click "Create Account"

3. **Upload Reviewer**
   - Click "Upload Reviewer"
   - Fill in the form:
     - Title: "Math Review - Chapter 1"
     - Description: "Covers basic algebra concepts"
     - Subject: "Mathematics"
     - Grade Level: "9"
     - File: Select a PDF file
   - Click "Upload"

4. **View Reviewer**
   - Go back to homepage
   - You should see your uploaded reviewer
   - Click "Download" to test file download

## 🔧 Troubleshooting

### Problem: "Cannot connect to MongoDB"
**Solution:**
- Check if your IP is whitelisted in MongoDB Atlas Network Access
- Verify the connection string is correct
- Ensure password doesn't contain special characters (or URL-encode them)

### Problem: "Failed to upload file"
**Solution:**
- Check R2 API credentials are correct
- Verify bucket name matches
- Ensure CORS is configured on R2 bucket
- Check that public access is enabled

### Problem: "Module not found" errors
**Solution:**
```powershell
rm -r node_modules
rm package-lock.json
npm install --legacy-peer-deps
```

### Problem: Port 3000 already in use
**Solution:**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or run on different port
npm run dev -- -p 3001
```

### Problem: "NextAuth configuration error"
**Solution:**
- Verify `NEXTAUTH_SECRET` is set in `.env.local`
- Ensure `NEXTAUTH_URL` is `http://localhost:3000` (no trailing slash)
- Restart dev server after changing `.env.local`

## 🎉 Success Criteria

You've successfully set up Project Red when:
- ✅ Application loads at http://localhost:3000
- ✅ You can create a new account
- ✅ You can log in with your credentials
- ✅ You can upload a PDF file
- ✅ Uploaded reviewers appear on the homepage
- ✅ You can download uploaded files

## 📞 Need Help?

If you encounter issues:
1. Check the browser console (F12) for error messages
2. Check the terminal where `npm run dev` is running for server errors
3. Verify all environment variables are set correctly
4. Ensure MongoDB and R2 are configured properly

## 🚀 Next Steps

Once setup is complete:
- Customize the UI colors and branding
- Add more reviewer categories
- Implement search and filtering
- Add user roles and permissions
- Deploy to Vercel for public access

---

**Estimated Total Setup Time**: 15-20 minutes

**Cost**: $0.00 (Everything is FREE!)
