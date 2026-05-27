# SkillSphere - Intelligent Hyperlocal Freelance Ecosystem

A full-stack MERN application for connecting clients with freelancers in a local environment with AI-powered job matching, real-time collaboration, and secure payments.

## 🎯 Project Overview

SkillSphere is a comprehensive freelance marketplace platform that enables:
- **Clients**: Post gigs, manage proposals, make secure payments
- **Freelancers**: Browse gigs, submit proposals, receive real-time notifications
- **Admins**: Monitor platform activity, manage users, fraud detection

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.IO
- **File Storage**: Cloudinary
- **Payment Gateway**: Stripe/Razorpay

### Frontend
- **Framework**: React (Vite)
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client
- **Styling**: CSS3 + Custom CSS
- **Routing**: React Router v6

## 📂 Project Structure

```
SkillSphere/
├── backend/
│   ├── models/              (12 MongoDB schemas)
│   ├── controllers/         (12 endpoint handlers)
│   ├── services/           (Business logic layer)
│   ├── repositories/       (Data access layer)
│   ├── routes/             (API endpoints)
│   ├── middleware/         (Auth, validation, error handling)
│   ├── sockets/            (Real-time events)
│   ├── config/             (Database, environment configs)
│   ├── utils/              (Helper functions)
│   ├── server.js           (Entry point)
│   └── app.js              (Express app setup)
│
└── frontend/
    ├── src/
    │   ├── pages/          (5 main pages)
    │   ├── components/     (Reusable components)
    │   ├── styles/         (CSS files)
    │   ├── services/       (API calls)
    │   ├── redux/          (State management)
    │   ├── utils/          (Helper functions)
    │   ├── constants/      (App constants)
    │   ├── App.jsx
    │   └── main.jsx
    ├── public/
    └── index.html
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB Atlas account
- Stripe/Razorpay API keys
- Cloudinary account

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << 'EOF'
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillsphere
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_public

RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password

NODE_ENV=development
EOF

# Start server
npm start
# Server runs on http://localhost:5000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cat > .env.local << 'EOF'
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
EOF

# Start development server
npm run dev
# App runs on http://localhost:5173
```

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `POST /api/v1/auth/refresh-token` - Refresh JWT

### Gigs
- `POST /api/v1/gigs` - Create gig (Client)
- `GET /api/v1/gigs/all` - Get all gigs
- `GET /api/v1/gigs/:id` - Get gig details
- `PUT /api/v1/gigs/:id` - Update gig
- `DELETE /api/v1/gigs/:id` - Delete gig
- `GET /api/v1/gigs/my-gigs` - Get user's gigs

### Proposals
- `POST /api/v1/proposals` - Submit proposal
- `GET /api/v1/proposals/:id` - Get proposal details
- `GET /api/v1/proposals/gig/:gigId` - Get gig proposals
- `GET /api/v1/proposals/my-proposals` - Get user proposals
- `POST /api/v1/proposals/:id/accept` - Accept proposal
- `POST /api/v1/proposals/:id/reject` - Reject proposal

### Chat & Messaging
- `POST /api/v1/chat/send` - Send message
- `GET /api/v1/chat/conversation/:otherUserId` - Get conversation
- `GET /api/v1/chat/conversations` - Get all conversations

### Payments
- `POST /api/v1/payments` - Create payment
- `GET /api/v1/payments/:id` - Get payment details
- `GET /api/v1/payments/client/payments` - Get client payments
- `GET /api/v1/payments/freelancer/payments` - Get freelancer payments
- `GET /api/v1/payments/freelancer/stats` - Get earning stats

### Reviews & Ratings
- `POST /api/v1/reviews` - Submit review
- `GET /api/v1/reviews/freelancer/:freelancerId` - Get freelancer reviews
- `GET /api/v1/reviews/freelancer/:freelancerId/rating` - Get rating

### Notifications
- `GET /api/v1/notifications` - Get user notifications
- `GET /api/v1/notifications/unread` - Get unread notifications
- `PUT /api/v1/notifications/:id/read` - Mark as read
- `DELETE /api/v1/notifications/:id` - Delete notification

### Admin
- `GET /api/v1/admin/dashboard/stats` - Dashboard statistics
- `GET /api/v1/admin/users` - List all users
- `POST /api/v1/admin/users/:id/suspend` - Suspend user
- `POST /api/v1/admin/users/:id/activate` - Activate user
- `GET /api/v1/admin/logs` - Activity logs

## 🔐 Key Features

### ✅ Completed
- ✓ Multi-role authentication (Client, Freelancer, Admin)
- ✓ JWT + 2FA security
- ✓ AI-powered gig matching (Huggingface)
- ✓ Real-time chat (Socket.IO)
- ✓ Milestone-based payments
- ✓ Rating & review system
- ✓ Admin dashboard
- ✓ Dispute resolution
- ✓ Email notifications
- ✓ Real-time notifications
- ✓ Search & filtering
- ✓ Responsive design

## 📖 Database Models

1. **User** - Authentication & profile
2. **Client** - Client-specific data
3. **Freelancer** - Freelancer profile
4. **Gig** - Job postings
5. **Proposal** - Project proposals
6. **Message** - Chat messages
7. **Notification** - User notifications
8. **Payment** - Transaction records
9. **Review** - User ratings
10. **Dispute** - Conflict resolution
11. **AdminLog** - Activity tracking

## 🔌 Real-time Events (Socket.IO)

### Chat Events
- `send-message` - Send message
- `receive-message` - Receive message
- `typing` - User typing indicator
- `message-read` - Message read receipt

### Notification Events
- `new-notification` - New notification
- `unread-count` - Unread count update

## 🎨 Frontend Pages

| Page | Route | Features |
|------|-------|----------|
| Gig Marketplace | `/gigs` | Browse, filter, search |
| Gig Details | `/gig/:id` | View details, submit proposal |
| Chat | `/chat` | Real-time messaging |
| Reviews | `/reviews` | View/submit reviews |
| Payments | `/payments` | Payment history, stats |
| Admin Dashboard | `/admin` | User management, stats |

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📦 Deployment

### Backend (Heroku/Railway/Render)
```bash
git push heroku main
```

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Support

For support, email: support@skillsphere.com

## 📞 Contact

- **Website**: www.skillsphere.com
- **Email**: info@skillsphere.com
- **GitHub**: github.com/skillsphere

---

**Last Updated**: May 2026
**Version**: 1.0.0
