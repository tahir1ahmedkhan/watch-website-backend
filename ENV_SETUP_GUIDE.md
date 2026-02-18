# 🔐 Environment Variables Setup Guide

## Where to Get Each Variable

### 1. MongoDB Atlas Variables

**MONGODB_URI**
```
Where: MongoDB Atlas Dashboard
Steps:
1. Go to https://cloud.mongodb.com/
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace <password> with your database user password
6. Replace <dbname> with "watch-store"

Format:
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/watch-store?retryWrites=true&w=majority

Example:
mongodb+srv://myuser:MyP@ssw0rd@cluster0.mongodb.net/watch-store?retryWrites=true&w=majority
```

**Important**: 
- URL encode special characters in password
- Whitelist IP: 0.0.0.0/0 (Network Access → Add IP Address → Allow Access from Anywhere)

---

### 2. JWT Variables

**JWT_SECRET**
```
Where: Generate yourself
Steps:
1. Open terminal/command prompt
2. Run: openssl rand -base64 32
3. Copy the output

Example output:
Xk7mp9Qw3vR8nL2jH5tY1uI4oP6aS0dF9gK3mN7bV8c=

Use this as your JWT_SECRET
```

**JWT_EXPIRES_IN**
```
Value: 7d
(This means JWT tokens expire after 7 days)

You can change to:
- 1d (1 day)
- 24h (24 hours)
- 30d (30 days)
```

---

### 3. Supabase Variables

**SUPABASE_URL**
```
Where: Supabase Dashboard
Steps:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings → API
4. Copy "Project URL"

Format:
https://your-project-id.supabase.co

Example:
https://hsrcbmqmtxnzxdwgenkm.supabase.co
```

**SUPABASE_ANON_KEY**
```
Where: Supabase Dashboard
Steps:
1. Go to Settings → API
2. Copy "anon public" key

Example:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzcm...
```

**SUPABASE_SERVICE_ROLE_KEY**
```
Where: Supabase Dashboard
Steps:
1. Go to Settings → API
2. Copy "service_role" key (keep this secret!)

Example:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzcm...
```

**SUPABASE_BUCKET_NAME**
```
Value: watch-website-images

Steps to create bucket:
1. Go to Storage in Supabase dashboard
2. Click "New bucket"
3. Name: watch-website-images
4. Make it public
5. Click "Create bucket"
```

---

### 4. Application Variables

**NODE_ENV**
```
Value: production
(For Render deployment, always use "production")
```

**PORT**
```
Value: 10000
(Render automatically sets this, but we specify it for clarity)
```

**FRONTEND_URL**
```
Where: Vercel Dashboard (after deploying frontend)
Steps:
1. Deploy frontend to Vercel first
2. Copy the Vercel URL
3. Add to Render environment variables

Format:
https://your-app.vercel.app

Example:
https://watch-store-frontend.vercel.app

Important: 
- Include https://
- No trailing slash
- Must match exactly for CORS to work
```

**ADMIN_EMAIL**
```
Value: admin@watchstore.com
(Or change to your preferred admin email)
```

**ADMIN_PASSWORD**
```
Value: Choose a secure password

Requirements:
- At least 8 characters
- Mix of letters, numbers, symbols
- Don't use "admin123" in production!

Example:
WatchStore2026!Secure
```

---

## 📋 Complete Environment Variables List

Copy this template and fill in your values:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://[username]:[password]@[cluster].mongodb.net/watch-store?retryWrites=true&w=majority
JWT_SECRET=[generate-with-openssl-rand-base64-32]
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://[your-app].vercel.app
ADMIN_EMAIL=admin@watchstore.com
ADMIN_PASSWORD=[your-secure-password]
SUPABASE_URL=https://[your-project].supabase.co
SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
SUPABASE_BUCKET_NAME=watch-website-images
```

---

## 🎯 How to Add to Render

### Method 1: One by One
1. Go to Render Dashboard
2. Select your service
3. Go to "Environment" tab
4. Click "Add Environment Variable"
5. Enter Key and Value
6. Click "Save Changes"

### Method 2: Bulk Add
1. Go to Render Dashboard
2. Select your service
3. Go to "Environment" tab
4. Click "Add from .env"
5. Paste all variables at once
6. Click "Save Changes"

---

## ✅ Verification Checklist

After adding all variables:

- [ ] All 12 variables added
- [ ] No typos in variable names
- [ ] MongoDB URI includes database name "watch-store"
- [ ] MongoDB Atlas IP whitelist includes 0.0.0.0/0
- [ ] JWT_SECRET is at least 32 characters
- [ ] FRONTEND_URL includes https:// and no trailing slash
- [ ] ADMIN_PASSWORD is secure (not "admin123")
- [ ] Supabase bucket exists and is public
- [ ] All Supabase keys copied correctly

---

## 🔒 Security Notes

### Keep These Secret (Never Commit to Git):
- ❌ MONGODB_URI (contains password)
- ❌ JWT_SECRET (used for authentication)
- ❌ ADMIN_PASSWORD (admin access)
- ❌ SUPABASE_SERVICE_ROLE_KEY (full database access)

### Safe to Share:
- ✅ SUPABASE_URL (public)
- ✅ SUPABASE_ANON_KEY (public, limited access)
- ✅ FRONTEND_URL (public)
- ✅ ADMIN_EMAIL (public)

---

## 🐛 Common Issues

### MongoDB Connection Fails
**Error**: "MongoServerError: Authentication failed"
**Solution**: 
- Check username and password in MONGODB_URI
- URL encode special characters in password
- Example: `p@ssw0rd` becomes `p%40ssw0rd`

### CORS Errors
**Error**: "CORS policy blocked"
**Solution**:
- Verify FRONTEND_URL matches Vercel URL exactly
- Include https://
- Remove trailing slash
- Redeploy after changing

### Supabase Upload Fails
**Error**: "Storage bucket not found"
**Solution**:
- Verify bucket name is "watch-website-images"
- Check bucket is public
- Verify SUPABASE_SERVICE_ROLE_KEY is correct

---

## 📞 Need Help?

### MongoDB Atlas
- Docs: https://docs.atlas.mongodb.com/
- Support: https://support.mongodb.com/

### Supabase
- Docs: https://supabase.com/docs
- Support: https://supabase.com/support

### Render
- Docs: https://render.com/docs
- Community: https://community.render.com/

---

**Last Updated**: February 2026  
**For**: Render.com Deployment
