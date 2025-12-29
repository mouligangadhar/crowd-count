# Quick Start Guide - Supabase Authentication

## ⚡ Quick Setup (5 minutes)

1. **Get Supabase Credentials**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Copy your Project URL and anon key from Settings → API

2. **Configure Environment**
   ```bash
   # Create .env file
   cp .env.example .env
   
   # Edit .env and add your credentials
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

3. **Run the App**
   ```bash
   npm install
   npm run dev
   ```

## 🎯 What Changed

### ✅ Added
- **Supabase Integration** - Full authentication backend
- **Email/Password Login** - Direct login without OTP
- **Password Reset** - Via email link (no OTP codes)
- **User Metadata** - Stores additional user info (name, organization, role, etc.)
- **Authentication Context** - Global auth state management

### ❌ Removed
- **OTP Login** - No longer available
- **Admin Login** - No longer a separate login method
- **Verification Codes** - Password reset now uses email links

## 🔑 Key Features

### Login Screen
- Simple email/password authentication
- Error handling with clear messages
- "Forgot Password" link
- Auto-redirect to home on success

### Signup Screen
- 3-step registration process
- Form validation (email format, password strength)
- Stores user metadata in Supabase
- Password confirmation check

### Forgot Password
- Email-based password reset
- Secure reset links (expires in 1 hour)
- No OTP codes needed

## 💻 Using Authentication in Your Code

### Check if User is Logged In
```typescript
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;
  
  return <div>Hello, {user.email}!</div>;
}
```

### Sign Out
```typescript
const { signOut } = useAuth();

const handleLogout = async () => {
  await signOut();
  navigate('/login');
};
```

### Access User Data
```typescript
const { user } = useAuth();

// Email
const email = user?.email;

// Custom metadata from signup
const fullName = user?.user_metadata?.full_name;
const organization = user?.user_metadata?.organization;
const role = user?.user_metadata?.role;
```

## 🛡️ Security Notes

- ✅ `.env` is in `.gitignore` - credentials won't be committed
- ✅ Supabase handles password hashing and security
- ✅ Session tokens auto-refresh
- ✅ Secure password reset via email

## 📁 New Files Created

```
src/
├── lib/
│   └── supabase.ts          # Supabase client configuration
├── contexts/
│   └── AuthContext.tsx      # Authentication context provider
└── pages/
    ├── LoginScreen.tsx      # Updated - email/password only
    ├── SignupScreen.tsx     # Updated - with Supabase
    └── ForgotPasswordScreen.tsx  # Updated - email reset link

.env.example                 # Template for environment variables
SUPABASE_SETUP.md           # Detailed setup instructions
```

## 🚀 Next Steps

1. **Set up Supabase project** (see SUPABASE_SETUP.md)
2. **Add your credentials** to `.env`
3. **Test the authentication** - try signup and login
4. **Protect routes** - Add auth checks to protected pages
5. **Customize** - Update email templates in Supabase dashboard

## ❓ Common Issues

**"Invalid API key"**
- Check your `.env` file has correct credentials
- Restart dev server after changing `.env`

**"Email not confirmed"**
- Check Supabase dashboard → Authentication → Settings
- Disable "Confirm email" for development (optional)

**User data not showing**
- User metadata is in `user.user_metadata` object
- Check Supabase dashboard → Authentication → Users

## 📖 Full Documentation

See `SUPABASE_SETUP.md` for complete setup instructions and advanced features.
