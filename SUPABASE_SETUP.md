# CrowdVision - Supabase Authentication Setup

This application now uses Supabase for authentication with email/password login.

## 🚀 Setup Instructions

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in your project details:
   - Project name: `crowdvision` (or your preferred name)
   - Database password: Choose a strong password
   - Region: Select the closest region to your users
4. Wait for the project to be created (takes ~2 minutes)

### 2. Get Your Supabase Credentials

1. In your Supabase project dashboard, click on the **Settings** icon (gear icon) in the sidebar
2. Go to **API** section
3. You'll find two important values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (a long string starting with `eyJ...`)

### 3. Configure Environment Variables

1. Create a `.env` file in the root of your project:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and replace the placeholder values with your actual Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 4. Set Up Authentication in Supabase

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Make sure **Email** provider is enabled (it should be by default)
3. Configure email settings:
   - Go to **Authentication** → **Email Templates**
   - Customize the email templates if desired (optional)

### 5. Configure Email Settings (Optional but Recommended)

By default, Supabase uses their email service for testing. For production:

1. Go to **Authentication** → **Settings**
2. Scroll to **SMTP Settings**
3. Configure your own SMTP provider (like SendGrid, AWS SES, etc.)

### 6. Set Up User Metadata (Optional)

The signup form collects additional user information (name, phone, organization, role, department). This is stored in the user's metadata. To access this data later:

1. Go to **Authentication** → **Users** to see registered users
2. Click on a user to view their metadata

### 7. Run the Application

```bash
# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

## 🔐 Authentication Features

### Login
- **Email/Password authentication** - Direct login with email and password
- **Error handling** - Clear error messages for invalid credentials
- **Forgot password** - Password reset via email link

### Signup
- **Multi-step registration** - 3-step signup process
  - Step 1: Personal information (name, email, phone)
  - Step 2: Organization details (organization, role, department)
  - Step 3: Password creation
- **Form validation** - Email format, password strength, matching passwords
- **User metadata** - Additional user info stored in Supabase

### Password Reset
- **Email-based reset** - Users receive a password reset link via email
- **Secure tokens** - Supabase handles token generation and validation

## 📝 How It Works

1. **Authentication Context** (`src/contexts/AuthContext.tsx`)
   - Manages authentication state globally
   - Provides `signIn`, `signUp`, `signOut`, and `resetPassword` functions
   - Automatically tracks user session

2. **Supabase Client** (`src/lib/supabase.ts`)
   - Configured with your project credentials
   - Handles all communication with Supabase

3. **Protected Routes** (Future Enhancement)
   - You can add route protection by checking `user` from `useAuth()` hook
   - Redirect unauthenticated users to login page

## 🛠️ Development Tips

### Check if User is Logged In

```typescript
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;
  
  return <div>Welcome, {user.email}!</div>;
}
```

### Sign Out

```typescript
import { useAuth } from './contexts/AuthContext';

function LogoutButton() {
  const { signOut } = useAuth();
  
  const handleLogout = async () => {
    await signOut();
    // User will be automatically redirected due to auth state change
  };
  
  return <button onClick={handleLogout}>Sign Out</button>;
}
```

### Access User Metadata

```typescript
import { useAuth } from './contexts/AuthContext';

function Profile() {
  const { user } = useAuth();
  
  const fullName = user?.user_metadata?.full_name;
  const organization = user?.user_metadata?.organization;
  
  return (
    <div>
      <h1>{fullName}</h1>
      <p>{organization}</p>
    </div>
  );
}
```

## 🔒 Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use environment variables** - Never hardcode credentials
3. **Enable Row Level Security (RLS)** in Supabase for database tables
4. **Use HTTPS in production** - Supabase requires it
5. **Implement proper error handling** - Don't expose sensitive error details to users

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth)
- [React Authentication Guide](https://supabase.com/docs/guides/auth/auth-helpers/react)

## 🐛 Troubleshooting

### "Invalid API key" error
- Check that your `.env` file has the correct credentials
- Restart the dev server after changing `.env`

### Email not sending
- Check Supabase email settings in dashboard
- For production, configure custom SMTP

### User not persisting after refresh
- Check that `persistSession: true` is set in `supabase.ts`
- Clear browser localStorage and try again

## 📞 Support

For issues specific to Supabase, check:
- [Supabase Discord](https://discord.supabase.com)
- [Supabase GitHub Discussions](https://github.com/supabase/supabase/discussions)
