# 🚀 Quick Start Guide - Project Red

Get your reviewer library running in 15 minutes!

---

## 📋 What You Need

Before you start, make sure you have:
- ✅ Node.js 18 or higher installed
- ✅ A web browser
- ✅ A text editor (like VS Code)
- ⏰ 15-20 minutes of your time

**No credit card needed for anything!**

---

## 🎯 Step-by-Step Setup

### Step 1: Verify Setup (2 minutes)

Open PowerShell in the project folder and run:

```powershell
.\setup.ps1
```

This will check your environment and tell you what's missing.

---

### Step 2: Install Dependencies (3 minutes)

If node_modules doesn't exist, run:

```powershell
npm install --legacy-peer-deps
```

Wait for it to finish (shows a tree of installed packages).

---

### Step 3: Create MongoDB Database (5 minutes)

1. **Go to MongoDB Atlas**
   - Visit: https://www.mongodb.com/cloud/atlas
   - Click "Try Free"
   - Sign up with your email

2. **Create a Cluster**
   - Click "Create" (accept defaults)
   - Choose "M0 FREE" tier
   - Click "Create Deployment"

3. **Create User**
   - Username: `reviewer-admin`
   - Password: Click "Autogenerate" and **SAVE IT**
   - Click "Create Database User"

4. **Allow Access**
   - Click "Add My Current IP Address"
   - OR click "Allow Access from Anywhere"
   - Click "Confirm"

5. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your saved password
   - Replace `<database>` with `reviewer-library`

Example result:
```
mongodb+srv://reviewer-admin:MyP@ssw0rd@cluster0.xxxxx.mongodb.net/reviewer-library?retryWrites=true&w=majority
```

---

### Step 4: Create Cloudflare R2 Storage (5 minutes)

1. **Sign Up for Cloudflare**
   - Visit: https://dash.cloudflare.com/sign-up
   - Sign up with your email
   - Verify email

2. **Enable R2**
   - In dashboard, click "R2" in left sidebar
   - Click "Purchase R2"
   - Accept free plan (no credit card!)

3. **Create Bucket**
   - Click "Create bucket"
   - Name: `reviewer-files-yourname` (must be unique)
   - Click "Create bucket"

4. **Make it Public**
   - Click on your bucket name
   - Go to "Settings"
   - Scroll to "Public Access"
   - Click "Allow Access"
   - **SAVE the Public URL** (looks like `https://pub-xxxxx.r2.dev`)

5. **Create API Token**
   - Go back to R2 main page
   - Click "Manage R2 API Tokens"
   - Click "Create API Token"
   - Name: `reviewer-app`
   - Permissions: "Object Read & Write"
   - Click "Create API Token"
   - **SAVE ALL THREE VALUES**:
     - Access Key ID
     - Secret Access Key
     - Account ID (at top of page)

---

### Step 5: Configure Environment (2 minutes)

1. **Create .env.local file**
   - In the project-red folder, create a file named `.env.local`
   - Copy this template and fill in YOUR values:

```env
# MongoDB - paste your connection string here
MONGODB_URI=mongodb+srv://reviewer-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/reviewer-library?retryWrites=true&w=majority

# NextAuth - generate a random secret
NEXTAUTH_SECRET=PASTE_GENERATED_SECRET_HERE
NEXTAUTH_URL=http://localhost:3000

# Cloudflare R2 - paste your values from Step 4
R2_ACCOUNT_ID=paste-account-id-here
R2_ACCESS_KEY_ID=paste-access-key-here
R2_SECRET_ACCESS_KEY=paste-secret-access-key-here
R2_BUCKET_NAME=reviewer-files-yourname
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

2. **Generate NextAuth Secret**
   
Run this command and copy the output:

```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

Paste the result as your `NEXTAUTH_SECRET`.

3. **Save the file**

---

### Step 6: Start the App (1 minute)

Run:

```powershell
npm run dev
```

You should see:
```
▲ Next.js 15.0.3
- Local:        http://localhost:3000

✓ Ready in 3.2s
```

**🎉 SUCCESS! Your app is running!**

---

## 🧪 Test Your App

### 1. Visit the Homepage

Open your browser and go to: **http://localhost:3000**

You should see a beautiful homepage with "No reviewers yet" message.

### 2. Create an Account

1. Click **"Sign Up"** in the top right
2. Fill in:
   - Name: Your name
   - Email: your@email.com
   - Password: Choose a strong password
3. Click **"Create Account"**

You should be redirected to the homepage, now logged in.

### 3. Upload a Reviewer

1. Click **"Upload Reviewer"** in the header
2. Fill in the form:
   - **Title**: "Math Review - Chapter 1"
   - **Description**: "Covers algebra basics"
   - **Subject**: "Mathematics"
   - **Grade Level**: "9"
   - **File**: Choose a PDF or DOCX file (under 10MB)
3. Click **"Upload"**

Wait for the success message!

### 4. View Your Reviewer

1. Click **"Home"** in the header
2. You should see your uploaded reviewer card
3. Click **"Download"** to test downloading

### 5. Test Theme Toggle

Click the sun/moon icon in the header to switch between light and dark modes!

---

## ✅ Success Checklist

You're all set when:
- [x] Homepage loads at http://localhost:3000
- [x] You created an account successfully
- [x] You can log in and out
- [x] You uploaded a reviewer file
- [x] The reviewer appears on the homepage
- [x] You can download the file
- [x] Theme toggle works

---

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Check your MongoDB IP whitelist
- Verify the connection string password
- Make sure you replaced `<password>` and `<database>`

### "Failed to upload file"
- Verify all R2 credentials in .env.local
- Check the bucket name is correct
- Make sure public access is enabled on R2

### "Port 3000 already in use"
Kill the process or use a different port:
```powershell
npm run dev -- -p 3001
```

### "Module not found" errors
Clean install:
```powershell
rm -r node_modules
rm package-lock.json
npm install --legacy-peer-deps
```

---

## 🎉 What's Next?

Now that your app is running:

1. **Customize It**
   - Change colors in `tailwind.config.ts`
   - Add your logo
   - Modify text in components

2. **Add Features**
   - Implement search functionality
   - Add rating system
   - Create categories

3. **Deploy It**
   - Push to GitHub
   - Deploy to Vercel (free!)
   - Share with your school

---

## 📚 Need More Help?

- **Full Setup Guide**: Read `setup.md`
- **Technical Details**: Read `BUILD_SUMMARY.md`
- **Validation Report**: Read `VALIDATION_REPORT.md`
- **Project Info**: Read `README.md`

---

## 🎊 Congratulations!

You've successfully set up a modern, full-stack reviewer library website!

**What you built:**
- ✅ Authentication system
- ✅ Cloud file storage
- ✅ Database integration
- ✅ Modern UI with dark mode
- ✅ Fully responsive design
- ✅ Production-ready code

**All for FREE, no credit card needed!**

---

**Time Spent**: ~15 minutes
**Cost**: $0.00
**Awesomeness**: 100%

Now go share some reviewers! 🚀
