# Hardhat Deployment Guide

## Prerequisites

1. **Get a private key** from your Web3 wallet (MetaMask, etc.)
   - Open MetaMask → Click Account Details → Export Private Key
   - ⚠️ **NEVER share this key or commit it to git!**

2. **Fund your wallet** with test MATIC on Polygon Amoy
   - Faucet: https://faucet.polygon.technology/
   - Get at least 0.5 MATIC for deployment

## Setup

### 1. Add Private Key to .env

Edit `.env` file and add:
```env
PRIVATE_KEY=your_private_key_here
```

### 2. (Optional) Get PolygonScan API Key for Contract Verification

- Go to https://polygonscan.com/apis
- Create an API key
- Add to `.env`:
```env
POLYGONSCAN_API_KEY=your_api_key_here
```

## Deployment Steps

### Option A: Deploy directly in VS Code Terminal

```bash
npm run deploy
```

The script will:
- Deploy TALAVault contract to Polygon Amoy
- Automatically update your `.env` with the contract address
- Show deployment summary

### Option B: Manual deployment commands

**Compile the contract:**
```bash
npx hardhat compile
```

**Deploy to Polygon Amoy:**
```bash
npx hardhat run scripts/deploy.ts --network polygon-amoy
```

## After Deployment

✅ Your contract address will be automatically added to `.env` as `NEXT_PUBLIC_TALA_VAULT_ADDRESS`

The app will be able to create vaults!

## Troubleshooting

### "Insufficient funds" error
- Your wallet needs MATIC on Polygon Amoy
- Get test MATIC from the faucet: https://faucet.polygon.technology/

### "Invalid private key" error
- Check the private key format (should start with `0x`)
- Ensure it's a valid hex string

### "Network error" error
- Check your internet connection
- Verify the RPC endpoint is working
- Try again in a few moments

## Security Notes

⚠️ **Important:**
- Never commit `.env` with your private key to git
- Use `.env.local` for local development instead
- Consider using a separate wallet for testnet deployments only
