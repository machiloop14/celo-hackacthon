# Complete Setup Guide - UI Electrical Fault Prediction Market

This guide will walk you through setting up and deploying the prediction market dApp step by step.

## Prerequisites Checklist

- [ ] Node.js v16+ installed
- [ ] npm or yarn installed
- [ ] MetaMask or Celo Wallet browser extension
- [ ] A wallet with Celo Alfajores testnet CELO (get from faucet)

## Step 1: Initial Setup

### 1.1 Install Root Dependencies

```bash
# Navigate to project root
cd C:\Users\USER\coding\celo

# Install dependencies
npm install
```

This installs:
- Hardhat and plugins
- Ethers.js
- Celo ContractKit
- Other development dependencies

### 1.2 Install Frontend Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install Next.js and frontend dependencies
npm install

# Return to root
cd ..
```

## Step 2: Configure Environment

### 2.1 Create Root .env File

Create a `.env` file in the root directory:

```bash
PRIVATE_KEY=your_wallet_private_key_here
CELO_ALFAJORES_RPC_URL=https://alfajores-forno.celo-testnet.org
```

**⚠️ Security Warning:**
- Never share your private key
- Never commit `.env` to git (it's already in .gitignore)
- Use a separate wallet for testing, not your main wallet

### 2.2 Get Testnet CELO

1. Go to [Celo Alfajores Faucet](https://faucet.celo.org/alfajores)
2. Connect your wallet
3. Request testnet CELO tokens
4. Wait for the transaction to confirm

## Step 3: Compile Smart Contracts

```bash
# From project root
npm run compile
```

This will:
- Compile `contracts/PredictionMarket.sol`
- Generate artifacts in `artifacts/` directory
- Create type definitions

**Expected Output:**
```
Compiled 1 Solidity file successfully
```

## Step 4: Deploy to Celo Alfajores

### 4.1 Deploy the Contract

```bash
npm run deploy:alfajores
```

**Expected Output:**
```
Deploying PredictionMarket contract...
PredictionMarket deployed to: 0x...
Network: alfajores
Deployment info saved to deployments/alfajores.json
```

### 4.2 Save Contract Address

Copy the contract address from the output. You'll need it for the frontend.

## Step 5: Configure Frontend

### 5.1 Create Frontend Environment File

Create `frontend/.env.local`:

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContractAddress
NEXT_PUBLIC_NETWORK=alfajores
NEXT_PUBLIC_RPC_URL=https://alfajores-forno.celo-testnet.org
```

Replace `0xYourDeployedContractAddress` with the actual address from Step 4.

### 5.2 (Optional) Export Contract ABI

If you want to use the full ABI instead of the minimal one in the code:

```bash
# From project root
npm run export-abi
```

This creates `frontend/contracts/PredictionMarket.json` with the full ABI.

## Step 6: Configure MetaMask/Celo Wallet

### 6.1 Add Celo Alfajores Network

**For MetaMask:**
1. Open MetaMask
2. Click network dropdown → "Add Network" → "Add a network manually"
3. Enter:
   - Network Name: `Celo Alfajores`
   - RPC URL: `https://alfajores-forno.celo-testnet.org`
   - Chain ID: `44787`
   - Currency Symbol: `CELO`
   - Block Explorer: `https://alfajores.celoscan.io`
4. Save

**For Celo Wallet:**
- Celo Alfajores is usually pre-configured

### 6.2 Switch to Alfajores Network

Make sure your wallet is connected to Celo Alfajores testnet.

## Step 7: Run the Frontend

### 7.1 Start Development Server

```bash
cd frontend
npm run dev
```

**Expected Output:**
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- info Loaded env from .env.local
```

### 7.2 Open in Browser

Navigate to: `http://localhost:3000`

## Step 8: Using the Application

### 8.1 Connect Wallet

1. Click "Connect Wallet" button
2. Approve the connection in your wallet
3. You should see your wallet address displayed

### 8.2 Create Your First Market

1. In the "Create New Prediction Market" section:
   - Enter a date (e.g., "December 25, 2024")
   - Set duration (e.g., 1 day)
2. Click "Create Market"
3. Approve the transaction in your wallet
4. Wait for confirmation

### 8.3 Place Bets

1. Find a market in the "Active Markets" section
2. Enter bet amount (in CELO)
3. Click "Bet YES" or "Bet NO"
4. Approve the transaction

### 8.4 Resolve Markets

1. Wait for market end time
2. If you're the creator, you'll see resolve buttons
3. Click "YES Won" or "NO Won" based on actual outcome
4. Approve the transaction

### 8.5 Claim Winnings

1. After resolution, if you bet on the winning side
2. Click "Claim Winnings"
3. Approve the transaction
4. Receive your proportional share

## Troubleshooting

### "Cannot find module" errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### "Insufficient funds" error
- Check you have CELO in your wallet
- Get more from the faucet
- Make sure you're on Alfajores testnet

### "Contract not deployed" error
- Verify contract address in `frontend/.env.local`
- Make sure you deployed to Alfajores
- Check the address on [CeloScan](https://alfajores.celoscan.io)

### Frontend won't connect to wallet
- Make sure MetaMask/Celo Wallet is installed
- Check browser console for errors
- Try refreshing the page
- Make sure wallet is unlocked

### Transaction stuck
- Check network congestion
- Try increasing gas (if option available)
- Cancel and retry the transaction

## Testing the Contract

Run the test suite:

```bash
npm test
```

## Next Steps

1. **Customize the UI**: Modify components in `frontend/components/`
2. **Add Features**: Extend the smart contract with new functionality
3. **Deploy to Mainnet**: When ready, deploy to Celo mainnet (requires real CELO)
4. **Add Analytics**: Track market activity and user engagement

## Support

- Check the main README.md for detailed documentation
- Review Celo documentation: https://docs.celo.org/
- Hardhat docs: https://hardhat.org/docs

## Common Commands Reference

```bash
# Compile contracts
npm run compile

# Deploy to Alfajores
npm run deploy:alfajores

# Run tests
npm test

# Export ABI
npm run export-abi

# Run frontend
cd frontend && npm run dev

# Build frontend for production
cd frontend && npm run build
```




