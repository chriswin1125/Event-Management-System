# MongoDB Atlas & Cloud Deployment Guide

This guide walks you through configuring **MongoDB Atlas** and deploying both the Backend and Frontend of the **Apple-Inspired Event Management System**.

---

## Part 1: Setting up MongoDB Atlas (Free Tier)

### Step 1: Create a Free MongoDB Atlas Account & Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create or log in to your account.
2. Click **"Create"** to create a new cluster.
3. Select the **M0 Free Tier** (Free forever, 512MB storage).
4. Choose a cloud provider and region closest to your target audience (e.g., AWS - Mumbai, Virginia, Frankfurt, etc.).
5. Name your cluster (e.g., `Cluster0` or `EventHubCluster`) and click **"Create Cluster"**.

---

### Step 2: Configure Database Access (Create Database User)
1. In the Atlas sidebar under **Security**, navigate to **"Database Access"**.
2. Click **"Add New Database User"**.
3. Choose **Password** authentication:
   - **Username**: e.g., `eventhub_admin`
   - **Password**: Choose a secure password (avoid special symbols like `@`, `:`, `/`, or `#` in passwords to avoid URL-encoding issues, or use numbers and letters).
4. Under **Database User Privileges**, select **"Read and write to any database"** (or Atlas Admin).
5. Click **"Add User"**.

---

### Step 3: Configure Network Access (Whitelist IP for Cloud Deployment)
Cloud hosting platforms (Render, Vercel, Railway, Heroku) use dynamic IPs, so your Atlas cluster must allow connections from all IPs:
1. In the Atlas sidebar under **Security**, click **"Network Access"**.
2. Click **"Add IP Address"**.
3. Click the **"Allow Access From Anywhere"** button (this sets the IP to `0.0.0.0/0`).
4. Click **"Confirm"**. (It will take ~30 seconds to become active).

---

### Step 4: Obtain Your Connection String (URI)
1. In the Atlas sidebar, navigate to **"Database"** (under Deployment).
2. Click the **"Connect"** button next to your cluster.
3. Under *Connect to your application*, choose **"Drivers"**.
4. Select Driver: **Node.js**, Version: **5.5 or later**.
5. Copy the connection string. It will look like:
   ```text
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=EventHub
   ```
6. **Important**: Insert your database name (e.g., `event_management_db`) right before the `?` query parameters:
   ```text
   mongodb+srv://eventhub_admin:YourPassword123@cluster0.abcde.mongodb.net/event_management_db?retryWrites=true&w=majority&appName=EventHub
   ```

---

## Part 2: Connecting and Seeding MongoDB Atlas

### 1. Update Backend `.env`
In `backend/.env`, replace the local `MONGO_URI` with your Atlas connection string:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://eventhub_admin:YourPassword123@cluster0.abcde.mongodb.net/event_management_db?retryWrites=true&w=majority&appName=EventHub
JWT_SECRET=super_secret_apple_grade_event_management_jwt_key_2026
CLIENT_URL=http://localhost:5173
```

### 2. Populate Atlas with Apple Events & Demo Accounts
Run the database seeder from the `backend/` folder:
```bash
cd backend
npm run seed
```

You should see output similar to:
```text
[Seeder] Connecting to MongoDB Atlas Cloud...
[Seeder] Connected! Purging existing records...
[Seeder] Creating Users & Demo Accounts...
[Seeder] Creating Categories...
[Seeder] Creating Events...
[Seeder] Created 10 events!
[Seeder] Database successfully seeded with Apple-grade sample data!
```

---

## Part 3: Deploying the Backend (e.g., Render / Railway)

### Deploying to [Render](https://render.com) (Recommended Free/Affordable Tier)
1. Push your repository to GitHub.
2. Sign in to Render and click **"New +"** -> **"Web Service"**.
3. Connect your GitHub repository.
4. Set the service settings:
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Under **Environment Variables**, add:
   | Key | Value |
   | :--- | :--- |
   | `NODE_ENV` | `production` |
   | `MONGO_URI` | `mongodb+srv://...` (Your Atlas URI) |
   | `JWT_SECRET` | `your_production_secret_key` |
   | `CLIENT_URL` | `https://your-frontend.vercel.app` (Your frontend URL) |
6. Click **"Deploy Web Service"**.
7. Note down your backend URL (e.g., `https://event-management-api.onrender.com`).

---

## Part 4: Deploying the Frontend (e.g., Vercel / Netlify)

### Deploying to [Vercel](https://vercel.com) (Recommended)
1. Sign in to Vercel and click **"Add New Project"**.
2. Import your GitHub repository.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
4. Under **Environment Variables**, add:
   | Key | Value |
   | :--- | :--- |
   | `VITE_API_URL` | `https://event-management-api.onrender.com/api` |
5. Click **"Deploy"**.

*(Note: `frontend/vercel.json` and `frontend/public/_redirects` are already created to guarantee SPA routing works on direct page refreshes).*

---

## Part 5: Final Check

1. Update the backend's `CLIENT_URL` environment variable on Render with your newly assigned Vercel URL:
   ```env
   CLIENT_URL=https://eventnex.vercel.app
   ```
2. Open your live Vercel URL: [https://eventnex.vercel.app](https://eventnex.vercel.app) in your browser.
3. Click the **"Demo"** pill in the top navigation bar to test instant sign-in with **Admin**, **Organizer**, or **Attendee**!
