# 🚀 Deployment Guide - Domestic Violence Support System

This guide walks you through deploying your application using **Vercel** (frontend) and **Render** (backend).

---

## 📋 Prerequisites

Before starting, ensure you have:

1. ✅ **GitHub Account** - [Sign up here](https://github.com/join)
2. ✅ **Vercel Account** - [Sign up here](https://vercel.com/signup)
3. ✅ **Render Account** - [Sign up here](https://render.com/register)
4. ✅ **Git installed** on your computer
5. ✅ **Your project code** pushed to a GitHub repository

---

## 📦 Step 1: Push Your Code to GitHub

If you haven't already pushed your code to GitHub:

```bash
# Navigate to your project directory
cd "c:\Users\bharg\OneDrive\Documents\VS code\FrontEnd-Project"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - ready for deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git branch -M main
git push -u origin main
```

> **💡 Tip**: Make sure your repository is set to **Public** or grant Render/Vercel access to private repos.

---

## 🖥️ Step 2: Deploy Backend to Render

### 2.1 Create New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

   **Basic Settings:**
   - **Name**: `domestic-violence-backend` (or your choice)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users (e.g., Singapore for India)
   - **Branch**: `main`

   **Build & Start Commands:**
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 2.2 Add Environment Variables

In the **Environment** section, add these variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | `<generate-a-strong-random-string>` |
| `PORT` | `10000` |

> **🔐 Security Tip**: For JWT_SECRET, use a strong random string. You can generate one with:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### 2.3 Configure Persistent Disk (Important for SQLite)

1. Scroll to **"Disks"** section
2. Click **"Add Disk"**
3. Configure:
   - **Name**: `sqlite-data`
   - **Mount Path**: `/opt/render/project/src/database`
   - **Size**: `1 GB` (free tier)

### 2.4 Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes for first deploy)
3. Once deployed, you'll see a URL like: `https://domestic-violence-backend.onrender.com`

### 2.5 Initialize the Database

After deployment, you need to initialize the SQLite database:

1. In Render dashboard, go to your service
2. Click **"Shell"** tab (top right)
3. Run the database initialization command:
   ```bash
   npm run init-db
   ```
4. Wait for confirmation message about database creation and default users

> **📝 Note**: Save your backend URL - you'll need it for frontend deployment!

---

## 🌐 Step 3: Deploy Frontend to Vercel

### 3.1 Deploy Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure the project:

   **Framework Preset:** Vercel should auto-detect "Create React App"
   
   **Build Settings:**
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `build` (auto-filled)

### 3.2 Add Environment Variables

Before deploying, add environment variables:

1. Click **"Environment Variables"**
2. Add this variable:

   | Name | Value |
   |------|-------|
   | `REACT_APP_API_URL` | `https://your-backend-url.onrender.com` |

   > ⚠️ **Important**: Replace with your actual Render backend URL from Step 2.4

### 3.3 Deploy

1. Click **"Deploy"**
2. Wait for build (2-5 minutes)
3. Once deployed, Vercel will show your live URL: `https://your-project.vercel.app`

---

## ✅ Step 4: Verify Deployment

### 4.1 Test Backend

Visit your backend health endpoint:
```
https://your-backend-url.onrender.com/api/health
```

You should see:
```json
{"status":"ok","message":"Server is running"}
```

### 4.2 Test Frontend

1. Visit your Vercel URL
2. Check that the home page loads correctly
3. Click the **Login** button in the header
4. Login modal should appear

### 4.3 Test Full Integration

Login with default credentials:

**Admin:**
- Email: `admin@support.org`
- Password: `admin123`

**Counsellor:**
- Email: `counsellor@support.org`
- Password: `counsellor123`

**Legal Advisor:**
- Email: `legal@support.org`
- Password: `legal123`

After logging in, verify:
- ✅ You're redirected to the correct portal
- ✅ Quick Exit button works
- ✅ No console errors related to API calls
- ✅ Data loads correctly from backend

---

## 🔧 Troubleshooting

### Frontend can't connect to backend

**Problem:** API calls failing, CORS errors

**Solutions:**
1. Check `REACT_APP_API_URL` in Vercel environment variables
2. Verify backend URL doesn't have trailing slash
3. Check browser console for exact error
4. Ensure backend is actually running on Render

### Backend database not initialized

**Problem:** Login fails "User not found"

**Solution:**
1. Go to Render Shell
2. Run `npm run init-db`
3. Verify success message

### Render free tier cold starts

**Problem:** First request to backend takes 30+ seconds

**Explanation:** Render's free tier spins down after 15 minutes of inactivity. First request wakes it up (cold start).

**Solutions:**
- Upgrade to paid tier for always-on service
- Accept cold starts for free tier
- Use a service like [UptimeRobot](https://uptimerobot.com/) to ping your backend every 5 minutes

### Build fails on Vercel

**Problem:** Build errors during deployment

**Solutions:**
1. Check build logs in Vercel dashboard
2. Ensure `frontend` is set as root directory
3. Verify all dependencies in `package.json`
4. Test build locally: `cd frontend && npm run build`

---

## 🔄 Updating Your Deployment

### Push Updates

Whenever you push to GitHub, both platforms auto-deploy:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

- **Vercel**: Auto-deploys in 2-3 minutes
- **Render**: Auto-deploys in 5-10 minutes

### Manual Redeploy

**Vercel:**
1. Go to project → Deployments tab
2. Click "..." menu → "Redeploy"

**Render:**
1. Go to service dashboard
2. Click "Manual Deploy" → "Deploy latest commit"

---

## 🎉 Success!

Your application is now live:

- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-backend.onrender.com`

### Next Steps

1. 📝 Update emergency contact numbers for your region (if needed)
2. 🔐 Change default passwords for admin/counsellor/legal accounts
3. 📱 Test on mobile devices
4. 🔗 Share the URL with stakeholders
5. 📊 Monitor usage in Vercel and Render dashboards

---

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Vercel/Render documentation
3. Check browser console and network tab for errors
4. Review deployment logs in respective dashboards

---

**🔒 Security Reminder**: This is a sensitive application dealing with domestic violence support. Ensure:
- Default passwords are changed immediately
- JWT_SECRET is kept secret
- Regular security updates are applied
- User data privacy is maintained
