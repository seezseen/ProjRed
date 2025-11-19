# Username Login Implementation - Complete

## Overview
Successfully implemented username support throughout the entire authentication system. Users can now log in with either email OR username.

## 🎯 Changes Implemented

### 1. Database Schema Update
**File**: `src/app/types/index.ts`
```typescript
interface User {
  _id?: string
  name: string
  username: string        // ✅ NEW: Added username field
  email: string
  password: string
  role: "student" | "admin" | "founder"
  createdAt?: Date
  updatedAt?: Date
}
```

### 2. Database Query Functions
**File**: `src/lib/users.ts`

Added three new/updated functions:
```typescript
// Get user by username
export async function getUserByUsername(username: string)

// Get user by email OR username
export async function getUserByEmailOrUsername(emailOrUsername: string)
```

The `getUserByEmailOrUsername` function uses MongoDB's `$or` operator:
```typescript
users.findOne({ 
  $or: [{ email: emailOrUsername }, { username: emailOrUsername }] 
})
```

### 3. Authentication Configuration
**File**: `src/lib/auth.ts`

Updated NextAuth CredentialsProvider:
- Changed credential field from `email` to `emailOrUsername`
- Updated authorize function to call `getUserByEmailOrUsername()`
- Supports login with either email or username

```typescript
credentials: {
  emailOrUsername: { label: "Email or Username", type: "text" },
  password: { label: "Password", type: "password" }
}
```

### 4. Login Form
**File**: `src/components/auth/login-form.tsx`

**Changes**:
- Form field renamed from `email` to `emailOrUsername`
- Validation changed from `z.string().email()` to `z.string().min(1)`
- Placeholder: `"admin or admin@example.com"`
- Label: `"Email or Username"`

**User Experience**:
- Users can enter either format in a single field
- Form accepts both emails and usernames without requiring format detection

### 5. Signup Form
**File**: `src/components/auth/signup-form.tsx`

**Changes**:
- Added new `username` field to form
- Validation: `/^[a-zA-Z0-9_]+$/` (alphanumeric + underscore)
- Minimum length: 3 characters
- Positioned between name and email fields

**Form Schema**:
```typescript
const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})
```

### 6. Admin User Creation Form
**File**: `src/app/admin/users/page.tsx`

**Changes**:
- Added `username` field to `createAdminSchema`
- Added username input field to form (between name and email)
- Updated default values to include `username: ""`
- Same validation as signup form

### 7. API Endpoints

#### Admin Creation API
**File**: `src/app/api/users/route.ts` (POST)

**Changes**:
- Extracts `username` from request body
- Validates username is provided
- Checks for existing users with same email OR username:
  ```typescript
  users.findOne({ $or: [{ email }, { username }] })
  ```
- Returns specific error messages:
  - "User with this email already exists"
  - "User with this username already exists"
- Includes username when creating user document

#### Student Signup API
**File**: `src/pages/api/auth/signup.ts`

**Changes**:
- Extracts `username` from request body
- Validates username is provided
- Checks email uniqueness with `getUserByEmail()`
- Checks username uniqueness with `getUserByUsername()`
- Returns specific error messages for each conflict
- Includes username in `createUser()` call

## 🔐 Default Founder Account

### Seed Script
**File**: `src/scripts/seed-founder.ts`

Created a seed script to initialize the system with a default founder account.

**Features**:
- Checks if founder already exists (prevents duplicates)
- Creates founder with hashed password
- Displays credentials after creation
- Shows security warning to change password

**Default Credentials**:
```
Username: founder
Email:    founder@example.com
Password: founder123
Role:     founder
```

### Running the Seed Script

1. **Install tsx** (if not installed):
   ```bash
   npm install -D tsx
   ```

2. **Run the seed script**:
   ```bash
   npm run seed:founder
   ```

3. **Output**:
   ```
   ✅ Founder account created successfully!

   📋 Default Login Credentials:
      ────────────────────────────
      Username: founder
      Email:    founder@example.com
      Password: founder123
      ────────────────────────────

   ⚠️  SECURITY NOTICE:
      Please change your password immediately after first login!
      Go to: Profile → Settings → Change Password
   ```

### First Time Login

You can log in with either:
- **Username**: `founder`
- **Email**: `founder@example.com`

Both work with password: `founder123`

**IMPORTANT**: Change your password immediately after first login!

## 📝 Validation Rules

### Username Requirements
- **Minimum length**: 3 characters
- **Allowed characters**: Letters (a-z, A-Z), numbers (0-9), underscore (_)
- **Pattern**: `/^[a-zA-Z0-9_]+$/`
- **Uniqueness**: Must be unique across all users

### Examples
✅ Valid usernames:
- `admin`
- `john_doe`
- `user123`
- `Project_Admin_2024`

❌ Invalid usernames:
- `ab` (too short)
- `user@example` (contains @)
- `admin-user` (contains hyphen)
- `user name` (contains space)

## 🧪 Testing Checklist

### Login Tests
- [ ] Log in with email (e.g., `founder@example.com`)
- [ ] Log in with username (e.g., `founder`)
- [ ] Verify error message for wrong password
- [ ] Verify error message for non-existent user

### Signup Tests
- [ ] Create new account with username
- [ ] Verify error for duplicate email
- [ ] Verify error for duplicate username
- [ ] Verify error for invalid username format (special chars)
- [ ] Verify error for username too short (< 3 chars)

### Admin Creation Tests
- [ ] Create admin with username via `/admin/users`
- [ ] Verify error for duplicate email
- [ ] Verify error for duplicate username
- [ ] Verify new admin can log in with username
- [ ] Verify new admin can log in with email

### Seed Script Tests
- [ ] Run `npm run seed:founder` on fresh database
- [ ] Verify founder account created
- [ ] Log in with username `founder`
- [ ] Log in with email `founder@example.com`
- [ ] Run seed script again - verify it detects existing founder
- [ ] Change password after first login

## 🚀 Next Steps

### For First-Time Setup:
1. ✅ Install dependencies: `npm install`
2. ✅ Install tsx: `npm install -D tsx`
3. ✅ Set up MongoDB connection (check `.env.local`)
4. ✅ Run seed script: `npm run seed:founder`
5. ✅ Start dev server: `npm run dev`
6. ✅ Log in with `founder` / `founder123`
7. ⚠️ Change password immediately via Settings

### For Existing Users:
If you already have admin accounts created before this update, they won't have usernames yet. You have two options:

1. **Add usernames manually in MongoDB**:
   ```javascript
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { username: "admin" } }
   )
   ```

2. **Create new admin accounts**:
   - Log in as founder
   - Go to `/admin/users`
   - Create new admin accounts with usernames
   - Delete old accounts without usernames

## 📊 Database Migration

If you have existing users without usernames, you may want to create a migration script:

```typescript
// src/scripts/migrate-usernames.ts
import clientPromise from "@/lib/client"

async function migrateUsernames() {
  const client = await clientPromise
  const db = client.db()
  const users = db.collection("users")
  
  const usersWithoutUsername = await users.find({ 
    username: { $exists: false } 
  }).toArray()
  
  for (const user of usersWithoutUsername) {
    // Generate username from email
    const username = user.email.split('@')[0]
    
    // Check if username exists
    const existing = await users.findOne({ username })
    
    if (!existing) {
      await users.updateOne(
        { _id: user._id },
        { $set: { username } }
      )
      console.log(`Updated ${user.email} with username: ${username}`)
    } else {
      console.log(`Username ${username} already exists, skipping ${user.email}`)
    }
  }
}

migrateUsernames()
```

## 📖 Documentation Updates

Updated files:
- ✅ `ADMIN_DASHBOARDS_COMPLETE.md` - Added default credentials section
- ✅ `ADMIN_DASHBOARDS_COMPLETE.md` - Updated User schema with username field
- ✅ `package.json` - Added `seed:founder` script

## ✨ Benefits

1. **Easier Login**: Users can choose shorter, memorable usernames instead of typing full emails
2. **Flexibility**: Both login methods work - users can use whichever they prefer
3. **Professional**: Usernames provide a more professional admin experience
4. **Unique Identity**: Each user has both email and username as unique identifiers
5. **Better UX**: Single input field accepts both formats without requiring format selection

## 🔒 Security Considerations

1. **Password Hashing**: All passwords hashed with bcrypt (10 rounds)
2. **Uniqueness**: Both email and username must be unique
3. **Validation**: Username format restricted to prevent injection attacks
4. **Default Credentials**: Must be changed after first login
5. **Founder Access**: Only founders can create admin accounts

---

**Implementation Date**: 2024
**Status**: ✅ Complete
**Breaking Changes**: None (existing email login still works)
