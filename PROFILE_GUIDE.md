# 👤 Profile Page - User Guide

## ✨ What's New

The Profile page now displays **real user data** from Supabase authentication!

## 🎯 Features

### **Dynamic User Information**
- ✅ **Full Name** - From signup form
- ✅ **Email Address** - User's login email
- ✅ **Phone Number** - Contact information
- ✅ **Organization** - Company/organization name
- ✅ **Role** - User's role (Security Staff, Event Manager, etc.)
- ✅ **Department** - Optional department info

### **Profile Avatar**
- ✅ **Personalized Avatar** - Generated from user's initials
- ✅ **Color Coded** - Unique gradient color based on name
- ✅ **Online Status** - Green indicator showing active status
- ✅ **No Image Upload Needed** - Automatic avatar generation

### **Protected Route**
- ✅ **Login Required** - Must be authenticated to view profile
- ✅ **Auto Redirect** - Redirects to login if not authenticated
- ✅ **Session Persistence** - Stays logged in across page refreshes

## 📸 Profile Page Layout

```
┌─────────────────────────────────────┐
│          Profile Header             │
│                                     │
│         ┌─────────────┐            │
│         │     JD      │ ← Avatar   │
│         │  (Initials) │            │
│         └─────────────┘            │
│         🟢 Online                  │
│                                     │
│         John Doe                    │
│         Security Staff              │
│         Security Operations         │
│         [Active User]               │
│                                     │
├─────────────────────────────────────┤
│     Contact Information             │
│                                     │
│  📧 Email                           │
│     john.doe@company.com           │
│                                     │
│  📱 Phone                           │
│     +1 (555) 123-4567              │
│                                     │
│  🏢 Organization                    │
│     Acme Corporation               │
│                                     │
│  💼 Role                            │
│     Security Staff                 │
│                                     │
├─────────────────────────────────────┤
│     Settings Menu                   │
│                                     │
│  👤 Account Settings         →     │
│  🔔 Notifications            →     │
│  🌙 Appearance               →     │
│  🛡️ Security & Privacy       →     │
│  ❓ Help & Support           →     │
│                                     │
├─────────────────────────────────────┤
│                                     │
│     [🚪 Log Out]                   │
│                                     │
│     CrowdVision v2.1.0             │
│                                     │
└─────────────────────────────────────┘
```

## 🎨 Avatar Generation

The profile avatar is automatically generated based on the user's name:

### **How It Works:**
1. **Extracts Initials** - Takes first letter of each name part
   - "John Doe" → "JD"
   - "Alice Smith Johnson" → "AS"

2. **Color Assignment** - Assigns a gradient color based on name
   - Cyan to Blue
   - Purple to Pink
   - Green to Cyan
   - Orange to Red

3. **Consistent Colors** - Same name always gets same color

### **Example Avatars:**
```
John Doe     →  [JD]  Cyan-Blue gradient
Alice Smith  →  [AS]  Purple-Pink gradient
Bob Johnson  →  [BJ]  Green-Cyan gradient
```

## 🔐 How to Access Profile

### **From Navigation:**
1. Log in to the app
2. Click the **Profile** icon in bottom navigation
3. View your profile information

### **Direct URL:**
- Navigate to `/profile`
- If not logged in, you'll be redirected to `/login`

## 📊 Data Source

All profile data comes from **Supabase Authentication**:

### **Where Data is Stored:**
```
Supabase → Authentication → Users → User Metadata
```

### **Data Structure:**
```json
{
  "email": "john.doe@company.com",
  "user_metadata": {
    "full_name": "John Doe",
    "phone": "+1 (555) 123-4567",
    "organization": "Acme Corporation",
    "role": "security",
    "department": "Security Operations"
  }
}
```

## 🛠️ Customization Options

### **Update Profile Information:**
Currently, profile data is set during signup. To update:

1. **Via Supabase Dashboard:**
   - Go to Authentication → Users
   - Click on user
   - Edit User Metadata
   - Save changes

2. **Future Enhancement:**
   - Add "Edit Profile" functionality
   - Allow users to update their own info
   - Add profile picture upload

## 🎯 Role Display Mapping

The app displays user-friendly role names:

| Database Value   | Display Name      |
|-----------------|-------------------|
| `security`      | Security Staff    |
| `event_manager` | Event Manager     |
| `mall_operator` | Mall Operator     |
| `admin`         | Administrator     |

## 🔒 Security Features

### **Protected Route:**
- Profile page requires authentication
- Unauthenticated users are redirected to login
- Session is checked on every page load

### **Data Privacy:**
- Only shows current user's data
- No access to other users' profiles
- Secure session management via Supabase

## 💡 Tips

### **For Users:**
1. **Keep Info Updated** - Contact admin to update profile info
2. **Check Role** - Verify your role is correct for access permissions
3. **Logout Properly** - Use the logout button to end session securely

### **For Developers:**
1. **Access User Data:**
   ```typescript
   import { useAuth } from '../contexts/AuthContext';
   
   const { user } = useAuth();
   const fullName = user?.user_metadata?.full_name;
   ```

2. **Protect Other Routes:**
   ```typescript
   <Route path="/protected" element={
     <ProtectedRoute>
       <YourComponent />
     </ProtectedRoute>
   } />
   ```

3. **Check User Role:**
   ```typescript
   const role = user?.user_metadata?.role;
   if (role === 'admin') {
     // Show admin features
   }
   ```

## 🚀 Future Enhancements

Potential features to add:

- [ ] **Edit Profile** - Allow users to update their info
- [ ] **Profile Picture Upload** - Upload custom avatar images
- [ ] **Activity Log** - Show recent user activity
- [ ] **Preferences** - Save user preferences
- [ ] **Two-Factor Auth** - Enhanced security options
- [ ] **Session Management** - View and manage active sessions
- [ ] **Notification Settings** - Customize notifications
- [ ] **Privacy Controls** - Control data visibility

## 📝 Testing Checklist

- [ ] Sign up with a new account
- [ ] Navigate to profile page
- [ ] Verify name displays correctly
- [ ] Check email is shown
- [ ] Verify organization and role
- [ ] Test logout functionality
- [ ] Try accessing profile without login (should redirect)
- [ ] Refresh page while logged in (should stay logged in)

## 🐛 Troubleshooting

### **Profile shows "User" instead of name:**
- Check that you filled in "Full Name" during signup
- Verify data in Supabase dashboard → Authentication → Users

### **Can't access profile page:**
- Make sure you're logged in
- Check browser console for errors
- Verify session is active

### **Data not updating:**
- Refresh the page
- Log out and log back in
- Check Supabase dashboard for latest data

## 📚 Related Documentation

- `SUPABASE_SETUP.md` - Supabase configuration
- `QUICKSTART.md` - Quick start guide
- `CHANGES_SUMMARY.md` - What changed in the app

---

**Your profile is now fully integrated with Supabase! 🎉**
