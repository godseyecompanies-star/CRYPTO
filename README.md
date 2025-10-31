# CryptoCoins - Cryptocurrency Investment Platform

A complete MERN stack cryptocurrency investment platform that allows users to invest money in cryptocurrencies managed by admin, with weekly returns.

## 🚀 Features

### User Features
- **Authentication System**
  - User registration with phone number
  - Login with phone number and password
  - OTP-based password recovery
  - JWT token-based authentication
  - Show/hide password toggle

- **Wallet Management**
  - View wallet balance
  - Deposit money via PayTM/UPI QR code
  - Upload payment proof for verification
  - Track deposit request status

- **Investment System**
  - Browse available cryptocurrencies
  - View coin prices and weekly profit percentages
  - Invest in multiple coins
  - Track investment performance
  - View current value and profits

- **Dashboard**
  - View wallet balance, total invested, and total profit
  - Quick actions for adding money and viewing coins
  - Investment summary
  - Recent transaction history

- **Transaction History**
  - View all transactions (deposits, investments, withdrawals)
  - Filter by type and status
  - Track pending approvals

### Admin Features
- **Dashboard Analytics**
  - Total users count
  - Total deposits and investments
  - Pending transactions count
  - Total profit distributed

- **User Management**
  - View all registered users
  - Add/deduct money from user wallets
  - Activate/deactivate user accounts
  - View user investment details

- **Coin Management**
  - Add new cryptocurrencies
  - Update coin prices
  - Set weekly profit percentages
  - Activate/deactivate coins

- **Transaction Management**
  - View all transactions (pending, approved, rejected)
  - Approve/reject deposit requests
  - View payment proofs
  - Add admin notes

- **Analytics & Reports**
  - Coin-wise purchase analysis
  - User growth tracking
  - Revenue metrics
  - Investment distribution

- **Settings**
  - Upload/update PayTM QR code
  - Platform configuration

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Multer** - File uploads
- **Twilio** - SMS/OTP service (optional)

### Frontend
- **React.js** - UI library
- **React Router** - Routing
- **Axios** - HTTP client
- **TailwindCSS** - Styling
- **Lucide React** - Icons

## 📁 Project Structure

```
cryptocoins-platform/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── coinController.js
│   │   ├── transactionController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── adminAuth.js
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/
│   │   ├── Coin.js
│   │   ├── OTP.js
│   │   ├── Settings.js
│   │   ├── Transaction.js
│   │   └── User.js
│   ├── routes/
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── coins.js
│   │   ├── transactions.js
│   │   └── user.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── sendOTP.js
│   ├── uploads/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── AdminRoute.js
    │   │   ├── Navbar.js
    │   │   └── ProtectedRoute.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── admin/
    │   │   │   ├── AdminDashboard.js
    │   │   │   ├── Analytics.js
    │   │   │   ├── CoinManagement.js
    │   │   │   ├── Settings.js
    │   │   │   ├── TransactionManagement.js
    │   │   │   └── UserManagement.js
    │   │   ├── AddMoney.js
    │   │   ├── Coins.js
    │   │   ├── Dashboard.js
    │   │   ├── ForgotPassword.js
    │   │   ├── Investments.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   └── Transactions.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   ├── index.css
    │   └── index.js
    ├── .gitignore
    ├── package.json
    ├── postcss.config.js
    └── tailwind.config.js
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cryptocoins
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone
CLIENT_URL=http://localhost:3000
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

5. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on http://localhost:3000

## 👤 Default Admin Account

To create an admin account, you can either:

1. **Manually in MongoDB**: Update a user's `role` field to `'admin'`

2. **Register normally then update**: Register through the UI, then use MongoDB shell:
```javascript
db.users.updateOne(
  { phoneNumber: "+919999999999" },
  { $set: { role: "admin" } }
)
```

## 🎨 UI/UX Design

The platform features a **Green & White Profit Theme**:
- Primary Green: #10B981
- Profit Green: #16A34A
- Success Green: #22C55E
- White backgrounds with green accents
- Smooth transitions and hover effects
- Mobile-responsive design

## 📱 Key Pages

### User Pages
- `/register` - User registration
- `/login` - User login
- `/forgot-password` - Password recovery
- `/dashboard` - Main dashboard
- `/coins` - Browse and invest in coins
- `/add-money` - Deposit funds
- `/investments` - View all investments
- `/transactions` - Transaction history

### Admin Pages
- `/admin/dashboard` - Admin overview
- `/admin/users` - User management
- `/admin/coins` - Coin management
- `/admin/transactions` - Transaction approval
- `/admin/analytics` - Platform analytics
- `/admin/settings` - Platform settings

## 🔐 Security Features

- JWT token-based authentication
- Password hashing with bcrypt (10 salt rounds)
- Protected API routes with middleware
- Role-based access control (User/Admin)
- Input validation and sanitization
- File upload validation (type and size)
- OTP expiration (5 minutes)
- Secure password requirements

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/wallet` - Get wallet info
- `GET /api/user/investments` - Get investments
- `GET /api/user/transactions` - Get transactions

### Coins
- `GET /api/coins` - Get all active coins
- `GET /api/coins/:id` - Get coin by ID

### Transactions
- `POST /api/transactions/deposit` - Create deposit request
- `POST /api/transactions/invest` - Create investment
- `POST /api/transactions/withdraw` - Create withdrawal

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user by ID
- `PUT /api/admin/users/:id/wallet` - Update user wallet
- `PUT /api/admin/users/:id/status` - Update user status
- `GET /api/admin/transactions` - Get all transactions
- `PUT /api/admin/transactions/:id` - Update transaction
- `POST /api/admin/coins` - Add new coin
- `PUT /api/admin/coins/:id` - Update coin
- `DELETE /api/admin/coins/:id` - Delete coin
- `GET /api/admin/analytics` - Get analytics
- `GET /api/admin/settings` - Get settings
- `PUT /api/admin/settings` - Update settings

## 🌟 Key Highlights

✅ Complete MERN stack implementation
✅ JWT authentication with OTP verification
✅ Admin panel with full control
✅ Real-time investment tracking
✅ Payment QR code system
✅ Transaction approval workflow
✅ Analytics and reporting
✅ Responsive green & white UI
✅ Secure file uploads
✅ Role-based access control

## 🐛 Known Issues / Future Enhancements

- Twilio integration is optional (OTP logs to console if not configured)
- Email notifications can be added
- Push notifications for mobile
- Dark mode support
- Multi-language support
- Referral system
- Automated profit distribution (cron jobs)

## 📝 License

This project is for educational purposes.

## 👨‍💻 Developer Notes

- All passwords are hashed before storage
- OTPs expire after 5 minutes
- File uploads limited to 5MB
- Only image files allowed for payment proofs
- Admin can manually adjust wallet balances
- Investments deduct from wallet immediately
- Deposits require admin approval

## 🤝 Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ using MERN Stack**
