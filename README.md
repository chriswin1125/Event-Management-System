<img width="1907" height="902" alt="image" src="https://github.com/user-attachments/assets/a092ba4a-4079-4e47-a2a0-b4bb2eef0e5f" /># NexEvent — Connect • Engage • Experience (MERN Stack)

A modern, responsive, and commercial-grade **Event Management System** built with **MongoDB Atlas, Express.js, React 19, and Node.js**, featuring custom brand identity and following **Apple's official website design language** (reference: [apple.com](https://www.apple.com)).

---

## 🌟 Apple Design Language & Visual System

- **Clean Typography & Generous Whitespace**: Editorial headings with Apple SF Pro typography hierarchy (`-0.02em` tracking) and spacious, breathable layouts.
- **Color Palette**:
  - Primary Background: `#FFFFFF`
  - Secondary Background: `#F5F5F7`
  - Primary Typography: `#1D1D1F`
  - Secondary Typography: `#6E6E73`
  - Accent Blue: `#0071E3` (Hover: `#0077ED`)
  - Subtle Borders: `#D2D2D7`
  - Keynote Dark Accent: `#000000`
- **Liquid Glass Navigation**: Frosted glass top navigation bar with `backdrop-filter: blur(20px)` and quick demo switcher.
- **Minimalist Product-Style Cards**: Elegant hover elevation, smooth image transforms, and uncluttered layouts.
- **Apple Wallet-Style Digital Passes**: High-resolution encrypted QR codes for contactless gate check-in and one-click printing.

---

## 🚀 Live Demo Accounts (1-Click Fast Login)

Use the built-in **"Demo"** pill in the top navigation bar or the login screen to sign in instantly:

| Role | Email | Password | Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@eventhub.com` | `password123` | Curation queue (Approve/Reject events), user role & status moderation, platform analytics, all transactions |
| **Event Organizer** | `organizer@eventhub.com` | `password123` | Publish new events, multi-tier ticket capacity, attendee lists, Recharts sales analytics |
| **Attendee / User** | `user@eventhub.com` | `password123` | Discover events, book tickets, digital QR passes, reviews, self-service cancellation |

---

## 🛠️ Technology Stack

### Frontend
- **React.js 19** + **Vite 8**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **React Router DOM v7**
- **Framer Motion** (Apple-grade fluid transitions)
- **Lucide React Icons**
- **Recharts** (Interactive box office & platform charts)
- **Canvas Confetti** (Booking celebration feedback)

### Backend
- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose 8**
- **JWT (JSON Web Tokens)** + HTTP Bearer middleware
- **bcrypt.js** (Secure salt password hashing)
- **QRCode** (High-fidelity QR digital pass generation)
- **Nodemailer** (HTML booking confirmation emails with Ethereal fallback)
- **Atomic MongoDB Inventory Updates** (`$inc` locks to prevent overbooking)

---

## 📁 Project Architecture

```
Event Management System/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Auth & Profile
│   │   ├── eventController.js    # Search, Filters, Organizer Stats
│   │   ├── bookingController.js  # Atomic Seat Reservation & QR Code
│   │   ├── adminController.js    # Approvals, Moderation & Analytics
│   │   ├── categoryController.js # Event Categories
│   │   ├── reviewController.js   # Attendee Reviews & Star Ratings
│   │   └── notificationController.js
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & role authorization
│   │   └── errorMiddleware.js    # Centralized error handler
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── Category.js
│   │   ├── Booking.js
│   │   ├── Notification.js
│   │   └── Review.js
│   ├── routes/                   # RESTful API Endpoints
│   ├── utils/
│   │   ├── seeder.js             # Realistic Apple events & demo accounts
│   │   ├── qrCodeService.js      # QR code generation
│   │   └── emailService.js       # Transactional email service
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Apple frosted glass header & demo switcher
│   │   │   ├── Footer.jsx        # Apple directory footer
│   │   │   ├── EventCard.jsx     # Premium product-style event card
│   │   │   ├── TicketModal.jsx   # Apple Wallet digital pass with QR code
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── LoadingSkeleton.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global auth state & notifications
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Apple Keynote Hero, Categories, Highlights
│   │   │   ├── ExploreEvents.jsx # Live search, category pills, city filter
│   │   │   ├── EventDetails.jsx  # Rich agenda, ticket tiers & booking
│   │   │   ├── Categories.jsx    # Dedicated collection browser
│   │   │   ├── About.jsx         # Apple design philosophy & numbers
│   │   │   ├── Contact.jsx       # Concierge form & FAQ accordion
│   │   │   ├── Login.jsx         # Sign in & 1-click demo evaluation
│   │   │   ├── Register.jsx      # Sign up with role picker
│   │   │   ├── user/
│   │   │   │   ├── UserDashboard.jsx
│   │   │   │   └── MyBookings.jsx
│   │   │   ├── organizer/
│   │   │   │   ├── OrganizerDashboard.jsx
│   │   │   │   └── CreateEvent.jsx
│   │   │   └── admin/
│   │   │       └── AdminDashboard.jsx # Approval queue, user & event moderation
│   │   ├── services/
│   │   │   └── api.js            # Axios with JWT bearer interceptors
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB**: Either local instance (`mongodb://127.0.0.1:27017`) or **MongoDB Atlas** cloud cluster (see [DEPLOYMENT.md](file:///c:/Users/J.CHRISWIN%20PRAYSON/Documents/Projects/Event%20Management%20System/DEPLOYMENT.md)).

### 2. Backend Setup & Database Seeding
```bash
# Configure MONGO_URI in .env (Supports both local and mongodb+srv:// Atlas URIs)
cd backend
npm install

# Seed the database with Apple events and test accounts
npm run seed

# Start the backend server (runs on http://localhost:5000)
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Start the Vite development server (runs on http://localhost:5173)
npm run dev
```

---

## 🛡️ Key Features & Workflows

### 1. Atomic Booking & Anti-Overbooking Engine
- Ticket reservations execute via atomic MongoDB queries (`$inc` matching available capacity).
- Real-time inventory deduction guarantees no double-booking under concurrent load.
- Automatically generates unique alphanumeric booking IDs (e.g., `BK-893421`).
- Embeds encrypted SHA-256 verification hashes into a scannable digital QR pass.

### 2. Organizer Studio
- Step-by-step event creator with multi-tiered passes (General, VIP, Early Bird), pricing, seat capacity, perks, and Apple keynote-grade photo presets.
- Real-time attendee register with guest names and booking references.
- Recharts bar analytics tracking ticket volume across each hosted event.

### 3. Admin Governance & Approval Queue
- Event moderation queue where admins can review organizer submissions and **Approve** or **Reject** with custom feedback before public publishing.
- User management table to change roles (User ↔ Organizer ↔ Admin) or toggle active status.
- Platform-wide transaction ledger and revenue distribution.
<img width="1917" height="907" alt="image" src="https://github.com/user-attachments/assets/6e1f6a44-e586-4f7a-ba14-ea99e7b739fc" />
<img width="1917" height="902" alt="image" src="https://github.com/user-attachments/assets/4253dec5-8959-4386-8a69-339c511162e8" />
