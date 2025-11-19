# Project Red - Reviewer Library

A modern, full-stack reviewer library website for students in grades 7-10. Built with Next.js 15, TypeScript, and Tailwind CSS.

## ✨ Features

- 🔐 **Authentication System** - Secure user registration and login with NextAuth.js
- 📤 **File Upload** - Direct uploads to Cloudflare R2 with presigned URLs
- 📚 **Reviewer Management** - Browse, upload, and download study materials
- 🎨 **Modern UI** - Beautiful interface with Shadcn/UI components
- 🌓 **Dark Mode** - Seamless theme switching
- 📱 **Responsive Design** - Works perfectly on all devices
- 🔒 **Secure** - Password hashing with bcrypt, JWT sessions
- ⚡ **Fast** - Server-side rendering with Next.js App Router

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS v4
- **Authentication**: NextAuth.js v5 (beta)
- **Database**: MongoDB Atlas (FREE tier)
- **File Storage**: Cloudflare R2 (FREE tier)
- **UI Components**: Shadcn/UI + Radix UI
- **Form Validation**: React Hook Form + Zod
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (FREE, no credit card required)
- Cloudflare account with R2 enabled (FREE, no credit card required)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
cd project-red
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/reviewer-library?retryWrites=true&w=majority

# NextAuth
NEXTAUTH_SECRET=your-random-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Cloudflare R2
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_BUCKET_NAME=reviewer-files
NEXT_PUBLIC_R2_PUBLIC_URL=https://your-bucket.r2.dev
```

### 4. Configure MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a FREE cluster
3. Create a database user
4. Whitelist your IP (or use 0.0.0.0/0 for all IPs)
5. Get your connection string and add it to `MONGODB_URI`

### 5. Configure Cloudflare R2

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to R2 Object Storage
3. Create a new bucket (e.g., `reviewer-files`)
4. Go to "Manage R2 API Tokens"
5. Create an API token with read/write permissions
6. Add credentials to `.env.local`
7. Configure public access for your bucket

### 6. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Add the output to `NEXTAUTH_SECRET` in `.env.local`

### 7. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
project-red/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth routes (login, signup)
│   │   ├── api/               # API routes
│   │   ├── profile/           # User profile page
│   │   ├── upload/            # File upload page
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   │   ├── auth/              # Auth forms
│   │   ├── ui/                # Shadcn UI components
│   │   ├── header.tsx         # Navigation header
│   │   └── reviewer-card.tsx  # Reviewer display card
│   ├── lib/                   # Utility functions
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── client.ts          # MongoDB client
│   │   ├── r2.ts              # Cloudflare R2 client
│   │   ├── reviewers.ts       # Reviewer operations
│   │   └── users.ts           # User operations
│   └── pages/api/             # Pages API routes
├── public/                    # Static files
└── .env.local                 # Environment variables
```

## 🔑 Key Features Explained

### Authentication Flow
1. User signs up with name, email, and password
2. Password is hashed with bcrypt
3. User data is stored in MongoDB
4. NextAuth.js handles session management with JWT

### File Upload Flow
1. User submits file upload form
2. Backend generates presigned URL for R2
3. File is uploaded directly to R2 from the client
4. Metadata is saved to MongoDB
5. Files are publicly accessible via R2 public URL

### Security Features
- Passwords hashed with bcrypt (12 rounds)
- JWT-based session management
- Environment variables for sensitive data
- Secure file uploads with presigned URLs
- Protected routes with middleware

## 🎨 UI Components

All UI components are built with:
- **Shadcn/UI**: Pre-built, accessible components
- **Radix UI**: Unstyled, accessible primitives
- **Tailwind CSS**: Utility-first styling
- **Class Variance Authority**: Component variants

## 📝 API Routes

- `POST /api/auth/signup` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth handlers
- `GET /api/reviewers` - Get all reviewers
- `POST /api/reviewers` - Create new reviewer
- `POST /api/upload-url` - Generate presigned URL

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Build for Production

```bash
npm run build
npm start
```

## 🐛 Troubleshooting

### Peer Dependency Issues
Always use `--legacy-peer-deps` flag when installing packages:
```bash
npm install package-name --legacy-peer-deps
```

### MongoDB Connection Issues
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify connection string format
- Check database user permissions

### R2 Upload Issues
- Verify CORS settings on R2 bucket
- Check API token permissions
- Ensure bucket has public access enabled

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [Shadcn/UI Documentation](https://ui.shadcn.com/)

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🙏 Acknowledgments

Built as an improved version of the "Alpha Version" reviewer library, featuring:
- Modern Next.js architecture
- Enhanced security
- Better UX/UI
- Scalable infrastructure
- Free, no-credit-card services

