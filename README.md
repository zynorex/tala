# T.A.L.A. - Trust is Code

**Tamper-proof Automated Locking Algorithm**

A decentralized time-locked vault for exam papers built on Polygon, eliminating human intervention from the storage and delivery process.

---

## 🎯 Mission

To eliminate exam paper leaks in India by making it mathematically impossible to access papers before the scheduled time, regardless of who you are.

---

## 🏗️ Architecture

### Hybrid Storage Model

- **IPFS (Pinata)**: Stores encrypted PDF files (publicly accessible but unreadable)
- **Smart Contract (Polygon Amoy)**: Stores decryption keys locked by `block.timestamp`
- **Client-Side Encryption**: AES-256 encryption in browser (raw files never touch servers)

### User Flow

1. **Admin Upload**: Select PDF → Set exam time → Generate key → Encrypt → Upload to IPFS → Lock key in smart contract
2. **Student Wait**: Download encrypted file → App checks blockchain → Key locked until exam time
3. **Student Unlock**: Exam time reached → Contract releases key → App auto-decrypts file

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript
- **Styling**: Tailwind CSS (Neo-Brutalist Design System)
- **Blockchain**: Solidity, Hardhat, Polygon Amoy Testnet
- **Web3**: Wagmi v2, RainbowKit, Viem
- **Storage**: IPFS via Pinata

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
# Get from https://cloud.walletconnect.com/
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Get from https://app.pinata.cloud/
NEXT_PUBLIC_PINATA_API_KEY=your_api_key
NEXT_PUBLIC_PINATA_SECRET_API_KEY=your_secret_key
NEXT_PUBLIC_PINATA_JWT=your_jwt_token

# Add after deploying smart contract
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

### 3. Run Development Server

```bash
npm run dev

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📦 Project Structure

```
tala/
├── app/
│   ├── layout.tsx          # Root layout with Web3Provider
│   ├── page.tsx            # Homepage (Design System Demo)
│   └── globals.css         # Global styles + Brutalist tokens
├── components/
│   └── providers/
│       └── Web3Provider.tsx # Wagmi + RainbowKit config
├── config/
│   └── wagmi.ts            # Wagmi configuration (Polygon Amoy)
├── .env.local              # Environment variables (gitignored)
├── .env.example            # Template for env variables
└── tailwind.config.ts      # Tailwind with custom brutalist theme
```

---

## 🔗 Network Configuration

- **Blockchain**: Polygon Amoy Testnet
- **Chain ID**: 80002
- **RPC**: `https://rpc-amoy.polygon.technology/`
- **Explorer**: `https://amoy.polygonscan.com/`

### Get Test MATIC

[Polygon Faucet](https://faucet.polygon.technology/)

---

## 🧪 Design System Components

All components follow the Neo-Brutalist design rules:

- ✅ Zero border radius
- ✅ 3px black borders
- ✅ Hard shadows with mechanical click effect
- ✅ Space Mono monospace font
- ✅ High contrast colors

---

## 🛡️ Security Model

1. **Zero Trust**: No human has access to unencrypted files or keys before exam time
2. **Mathematical Enforcement**: `block.timestamp` ensures time-based unlocking
3. **Client-Side Crypto**: Encryption/decryption happens in browser only
4. **Immutable Audit Trail**: All uploads recorded on blockchain

---

## ⚠️ Known Challenges

### 1. Block Timestamp Manipulation
- Validators can manipulate ±15 seconds
- **Mitigation**: Acceptable risk window for educational use

### 2. IPFS Availability
- Pinata downtime = encrypted file unavailable
- **Mitigation**: Redundant pinning + CDN fallback + pre-download

### 3. RPC Rate Limits
- 10,000 simultaneous students = throttling
- **Mitigation**: Multiple RPC providers + client-side caching

---

## 📝 Next Steps

1. **Smart Contract Development**: Create TimeLockVault.sol
2. **IPFS Integration**: Build upload/download utilities
3. **Encryption Service**: Implement AES-256 client-side crypto
4. **Admin Dashboard**: PDF upload interface
5. **Student Portal**: Download + auto-decrypt interface

---

## 📄 License

MIT License - Built for educational transparency.

---

**Trust is Code.**
