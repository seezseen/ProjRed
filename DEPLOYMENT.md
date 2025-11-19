# Deployment Guide - Vercel

## Prerequisites
- GitHub account
- MongoDB Atlas account (already set up)
- Vercel account (sign up at vercel.com with GitHub)

## Step 1: Prepare Repository

Your code is already pushed to GitHub: `seezseen/ProjRed`

## Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository: `seezseen/ProjRed`
4. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./project-red`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

## Step 3: Configure Environment Variables

In Vercel project settings → Environment Variables, add:

```
MONGODB_URI=mongodb+srv://projread:pabpab10@projectred.rawezmy.mongodb.net/?appName=ProjectRed

AUTH_SECRET=eI2fHeygoLQrC5WAuXri/GjSbdyy+rTlmzxjNmN+MTc=

NEXTAUTH_SECRET=eI2fHeygoLQrC5WAuXri/GjSbdyy+rTlmzxjNmN+MTc=

NEXTAUTH_URL=https://your-project-name.vercel.app
```

**Important**: Update `NEXTAUTH_URL` after deployment with your actual Vercel URL!

## Step 4: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. Your site will be live at: `https://your-project-name.vercel.app`

## Step 5: Post-Deployment Setup

### Update NEXTAUTH_URL
1. Copy your Vercel URL (e.g., `proj-red.vercel.app`)
2. Go to Vercel → Your Project → Settings → Environment Variables
3. Edit `NEXTAUTH_URL` to your actual URL: `https://proj-red.vercel.app`
4. Redeploy (Settings → Deployments → Latest → ⋯ → Redeploy)

### Seed Founder Account
After deployment, you need to create the founder account on production:

**Option A: Run locally with production DB**
```bash
npm run seed:founder
```

**Option B: Manual MongoDB insert**
1. Go to MongoDB Atlas
2. Browse Collections → `users`
3. Insert Document:
```json
{
  "name": "System Founder",
  "username": "founder",
  "email": "founder@example.com",
  "password": "$2a$10$hash_your_password_here",
  "role": "founder",
  "createdAt": {"$date": "2025-11-19T00:00:00.000Z"}
}
```

For hashed password, run locally:
```bash
node -e "console.log(require('bcryptjs').hashSync('founder123', 10))"
```

## Step 6: Test Production

1. Visit your Vercel URL
2. Click "🔐 Admin Login"
3. Login with:
   - Username: `founder`
   - Password: `founder123`
4. Test uploading a reviewer
5. Test viewing on grade pages
6. **Change founder password immediately!**

## MongoDB Atlas Configuration

Your MongoDB is already configured. If you need to whitelist Vercel IPs:

1. Go to MongoDB Atlas
2. Network Access → Add IP Address
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
   - ⚠️ This is safe - authentication still required

## Troubleshooting

### Build Fails
- Check Vercel build logs
- Verify all dependencies in package.json
- Ensure no TypeScript errors locally

### 500 Errors
- Check Vercel Function Logs (Settings → Logs)
- Verify environment variables are set correctly
- Check MongoDB connection string

### Login Issues
- Verify `NEXTAUTH_URL` matches your actual domain
- Check `AUTH_SECRET` is set
- Ensure founder account exists in database

### File Upload Fails
- Check file size (<10MB recommended for Vercel)
- Verify MongoDB connection
- Check Vercel function timeout (10s on free tier)

## Performance Optimization

### For 1000+ Users:
1. **Enable Vercel Edge Network** (automatic)
2. **MongoDB Index**: Create index on `gradeLevel` field
   ```javascript
   db.reviewers.createIndex({ gradeLevel: 1 })
   ```
3. **File Size Limits**: Keep PDFs under 5MB
4. **Compression**: Enable in upload form

## Custom Domain (Optional)

1. Go to Vercel → Your Project → Settings → Domains
2. Add your custom domain
3. Update `NEXTAUTH_URL` environment variable
4. Redeploy

## Monitoring

- **Vercel Analytics**: Settings → Analytics (enable for free)
- **MongoDB Atlas**: Monitor → View metrics
- **Function Logs**: Vercel → Deployments → Latest → Function Logs

## Cost & Limits

### Vercel Free Tier:
- 100GB bandwidth/month
- 100GB-hours serverless function execution
- Unlimited sites
- **Plenty for 1000+ users viewing files**

### MongoDB Atlas Free Tier:
- 512MB storage
- ~100-250 PDF reviewers
- Shared cluster
- **Monitor storage usage**

## Support

- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Next.js: https://nextjs.org/docs

---

**Ready to deploy? Follow the steps above!**
