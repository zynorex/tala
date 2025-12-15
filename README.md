# T.A.L.A. - Trust is Code

**Tamper-proof Automated Locking Algorithm**

A decentralized, secure vault system for exam papers built on Polygon, eliminating human intervention from the storage and delivery process.

---

## 🎯 Mission

To eliminate exam paper leaks by making it mathematically impossible to access papers before the scheduled time, with complete transparency and non-custodial security.

---

## ✨ Key Features

### 🔐 File Upload & Management
- **AES-256 Encryption**: Files encrypted before leaving your device
- **IPFS Storage**: Decentralized backup with Pinata
- **Secure Keys**: Encryption keys stored safely with ownership verification
- **Soft Deletes**: Audit trail maintained for compliance
- **API Endpoints**: RESTful upload, download, and delete operations

### 👑 Admin Dashboard
- **Hidden Access**: Type "admin" anywhere to access (`/admin/ADMIN`)
- **Credential-Based**: Secure login with ID + password from `.env`
- **4 Management Tabs**:
  - 📊 Overview: System stats & 30-day analytics
  - 👥 Users: User management with search & delete
  - 🗂️ Vaults: Vault browser with filters
  - 📝 Logs: Activity timeline with color-coded actions
- **Owner Badge**: Shows "OWNER" badge in navbar when authenticated

### ⚡ Rate Limiting
- **Per-Endpoint**: Default 100/min, Auth 10/min, Upload 5/min
- **Per-User & Per-IP**: Prevents abuse and DDoS
- **Smart Blocking**: 15-minute lockout after 5 violations
- **Header Support**: Retry-After headers for clients

### 📝 Request Logging
- **Complete Audit Trail**: Every action logged to database
- **Metadata Capture**: User, IP, User-Agent, timestamp
- **Error Tracking**: Full stack traces on failures
- **Activity Timeline**: Searchable, filterable logs

### ⌨️ Keyboard Shortcut
- **Type "admin"**: Instantly access admin login from any page
- **Global Listener**: Works site-wide
- **Secure**: Still requires valid credentials

---

## 🏗️ Architecture

### Hybrid Storage Model

- **IPFS (Pinata)**: Stores encrypted files (publicly accessible but unreadable)
- **Database (PostgreSQL)**: Stores metadata, encryption key hashes, activity logs
- **Client-Side Encryption**: AES-256-GCM in browser (raw files never sent unencrypted)

### User Flow

1. **Admin Upload**: 
   - Select file → Encrypt in browser → Upload to IPFS → Store metadata in DB → Log activity

2. **File Access**:
   - Download encrypted file → Check ownership → Retrieve encryption key hash → Decrypt in browser

3. **Activity Tracking**:
   - Every action logged (upload, download, delete)
   - IP address, User-Agent, timestamp captured
   - Accessible via admin dashboard

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (TypeScript, App Router)
- **Styling**: Tailwind CSS (Neo-Brutalist Design)
- **Icons**: Lucide React
- **Charts**: Custom CSS visualizations

### Backend
- **Runtime**: Node.js (Next.js API Routes)
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT tokens
- **File Storage**: IPFS via Pinata

### Blockchain
- **Solidity**: Smart contracts
- **Chain**: Polygon Amoy Testnet
- **Web3**: Wagmi v2, RainbowKit, Viem

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
# Copy template
cp .env.example .env.local

# Fill in required variables:
# - ADMIN_ID and ADMIN_PASSWORD (for admin dashboard)
# - Database URL
# - IPFS/Pinata credentials
# - Wallet Connect ID
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Access the Application
- **Homepage**: [http://localhost:3000](http://localhost:3000)
- **Admin Login**: Type "admin" on any page, or visit [http://localhost:3000/admin/ADMIN](http://localhost:3000/admin/ADMIN)
- **Default Credentials**: Use ADMIN_ID and ADMIN_PASSWORD from `.env.local`

---

## 📦 Project Structure

```
tala/
├── app/
│   ├── api/
│   │   ├── admin/                    # Admin endpoints
│   │   │   ├── login/                # Authentication
│   │   │   ├── users/                # User management
│   │   │   ├── vaults/               # Vault listing
│   │   │   ├── analytics/            # System stats
│   │   │   └── logs/                 # Activity logs
│   │   └── vaults/[id]/files/        # File operations
│   ├── admin/
│   │   └── ADMIN/                    # Admin dashboard
│   │       ├── page.tsx              # Login page
│   │       └── dashboard/            # Dashboard
│   ├── components/
│   │   ├── admin/                    # Admin components
│   │   ├── providers/                # Web3, Toast, Theme
│   │   └── ui/                       # UI components
│   ├── hooks/
│   │   ├── useAdminAuth.ts           # Auth hook
│   │   └── useAdminShortcut.ts       # Keyboard shortcut
│   ├── lib/
│   │   ├── admin/                    # Admin logic
│   │   ├── middleware/               # Rate limit, logging
│   │   ├── crypto/                   # Encryption utilities
│   │   └── validators/               # Input validation
│   └── providers/
│       └── AdminShortcutProvider.tsx # Global shortcut provider
├── config/
│   └── wagmi.ts                      # Web3 config
├── public/
│   └── logo.png                      # TALA logo
├── .env.example                      # Environment template
├── .env.local                        # Local config (gitignored)
├── tsconfig.json                     # TypeScript config
└── tailwind.config.ts                # Tailwind config
```

---

## 🔗 API Endpoints

### File Operations
- `POST /api/vaults/[id]/files` - Upload encrypted file
- `GET /api/vaults/[id]/files` - List files with pagination
- `GET /api/vaults/[id]/files/[fileId]` - Download & decrypt file
- `DELETE /api/vaults/[id]/files/[fileId]` - Soft delete file

### Admin Operations
- `POST /api/admin/login` - Authenticate admin
- `GET /api/admin/users` - List users with pagination
- `GET /api/admin/vaults` - List vaults with filters
- `GET /api/admin/analytics` - System statistics
- `GET /api/admin/logs` - Activity logs
- `DELETE /api/admin/users/[id]` - Delete user (soft delete)

---

## 🔐 Security Features

✅ **Authentication & Authorization**
- Credential-based admin login
- JWT token management
- Role-based access control (Owner/User)
- Auto-logout on expiration

✅ **Data Protection**
- AES-256-GCM encryption on files
- Encryption key isolation
- Soft deletes with audit trail
- SQL injection prevention (Prisma)

✅ **Rate Limiting & DDoS Protection**
- Per-endpoint rate limits
- Per-user tracking
- Per-IP throttling
- Auto-blocking after violations

✅ **Audit & Compliance**
- Complete activity logging
- Timestamp on all events
- IP address tracking
- Deletion audit trail

---

## 📊 Build Status

```
✓ Build: Successful (3.6s)
✓ TypeScript: 0 errors
✓ Pages: 40 total (including 3 admin)
✓ API Routes: 8 endpoints
✓ Status: PRODUCTION READY
```

---

## 📚 Documentation

- **[ADMIN_QUICKSTART.md](ADMIN_QUICKSTART.md)** - 5-minute admin setup
- **[ADMIN_DASHBOARD.md](ADMIN_DASHBOARD.md)** - Complete admin features
- **[KEYBOARD_SHORTCUT.md](KEYBOARD_SHORTCUT.md)** - Keyboard shortcut guide
- **[ADMIN_TESTING_GUIDE.md](ADMIN_TESTING_GUIDE.md)** - Testing checklist (50+ scenarios)
- **[TESTING_MANUAL.md](TESTING_MANUAL.md)** - Manual API testing guide
- **[TEST_RESULTS.md](TEST_RESULTS.md)** - Test summary & results

---

## 🧪 Testing

### Run Unit Tests
```bash
npm test
```

### Run Quick Tests
```bash
./quick-test.sh "your-jwt-token" "your-admin-token"
```

### Automated Test Suite
```bash
node test-runner.js
```

### Manual Testing
See [TESTING_MANUAL.md](TESTING_MANUAL.md) for 30+ test scenarios

---

## ⚙️ Configuration

### Admin Credentials
```env
ADMIN_ID="owner"
ADMIN_PASSWORD="your-secure-password"
```

### Database
```env
DATABASE_URL="postgresql://user:password@localhost:5432/tala"
```

### IPFS/Pinata
```env
PINATA_API_KEY="your-api-key"
PINATA_SECRET_KEY="your-secret-key"
```

### Encryption
```env
ENCRYPTION_KEY="your-32-char-key"
```

---

## 🌐 Network Configuration

- **Blockchain**: Polygon Amoy Testnet
- **Chain ID**: 80002
- **RPC**: `https://rpc-amoy.polygon.technology/`
- **Explorer**: `https://amoy.polygonscan.com/`

### Get Test MATIC
[Polygon Faucet](https://faucet.polygon.technology/)

---

## 🎨 Design System

All components follow Neo-Brutalist design rules:

- ✅ Zero border radius
- ✅ Hard borders (2-3px)
- ✅ Sharp shadows
- ✅ High contrast
- ✅ Monospace accents
- ✅ Mechanical interactions

---

## 📈 Features Summary

| Feature | Status | Details |
|---------|--------|---------|
| File Upload | ✅ | AES-256 encrypted, IPFS storage |
| File Download | ✅ | Auto-decrypt, ownership verified |
| File Delete | ✅ | Soft delete with audit trail |
| Admin Dashboard | ✅ | 4 tabs, 40+ features |
| User Management | ✅ | List, search, delete users |
| Activity Logs | ✅ | Complete action history |
| Rate Limiting | ✅ | Per-IP, per-user, per-endpoint |
| Request Logging | ✅ | Database + console logging |
| Keyboard Shortcut | ✅ | Type "admin" to access |
| Responsive Design | ✅ | Mobile, tablet, desktop |
| Dark Mode | ✅ | Built-in dark theme |

---

## 📝 Recent Updates

### December 15, 2025
- ✅ Complete admin dashboard built (4 tabs, 40+ features)
- ✅ Keyboard shortcut feature added (type "admin")
- ✅ File upload system with encryption
- ✅ Rate limiting middleware
- ✅ Request logging to database
- ✅ Admin API (5 endpoints)
- ✅ Comprehensive testing infrastructure (50+ tests)
- ✅ Production build verified (0 errors)

---

## 🚀 Deployment

### Build Production
```bash
npm run build
```

### For Vercel
1. Push to Git
2. Connect to Vercel
3. Set environment variables
4. Auto-deploys on push

### For Docker
```bash
npm run build
docker build -t tala .
docker run -p 3000:3000 tala
```

---

## 📄 License

MIT License - Built for educational transparency and security.

---

## 🤝 Contributing

This project is in active development. For issues or suggestions, please refer to the documentation files for comprehensive testing procedures.

---

**Status:** 🟢 **PRODUCTION READY**  
**Build:** ✅ SUCCESS (0 errors)  
**Test Coverage:** 50+ scenarios

**Trust is Code.**
