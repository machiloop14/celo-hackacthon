# UI Electrical Fault Prediction Market on Celo

A decentralized prediction market dApp built on Celo Sepolia testnet for predicting daily electrical faults at the University of Ibadan.

## 🏗️ Project Structure

```
celo/
├── contracts/          # Solidity smart contracts
│   └── PredictionMarket.sol
├── scripts/            # Deployment scripts
│   └── deploy.js
├── test/               # Hardhat tests
│   └── PredictionMarket.test.js
├── frontend/           # Next.js frontend application
│   ├── app/
│   ├── components/
│   └── package.json
├── hardhat.config.js   # Hardhat configuration
└── package.json        # Root package.json
```

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask or Celo Wallet extension
- Celo Sepolia testnet CELO tokens (get from [faucet](https://faucet.celo.org/))

## 🚀 Step-by-Step Setup

### Step 1: Install Dependencies

```bash
# Install root dependencies (Hardhat, etc.)
# Note: Use --legacy-peer-deps to resolve dependency conflicts
npm install --legacy-peer-deps

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 2: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
PRIVATE_KEY=your_private_key_here
CELO_SEPOLIA_RPC_URL=https://forno.celo-sepolia.celo-testnet.org
```

**⚠️ Important:** Never commit your private key to version control!

### Step 3: Compile Smart Contracts

```bash
npm run compile
```

This will compile the Solidity contracts and generate artifacts in the `artifacts/` directory.

### Step 4: Deploy to Celo Sepolia Testnet

Make sure you have:

1. A wallet with CELO tokens on Sepolia testnet
2. Your private key in the `.env` file

```bash
npm run deploy:sepolia
```

After deployment, you'll see:

- Contract address
- Deployment info saved to `deployments/sepolia.json`

### Step 5: Configure Frontend

1. Copy the contract address from the deployment output
2. Create `frontend/.env.local`:

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address
NEXT_PUBLIC_NETWORK=sepolia
NEXT_PUBLIC_RPC_URL=https://forno.celo-sepolia.celo-testnet.org
```

3. **Note about ABI**: The contract ABI (Application Binary Interface) is already included in `frontend/app/page.tsx` (lines 11-23). You don't need to change anything unless you modify the smart contract. If you do modify the contract:
   - Option 1: Manually update the `CONTRACT_ABI` array in `frontend/app/page.tsx` with the new function signatures
   - Option 2: Import the full ABI from the compiled artifact file: `import PredictionMarketABI from '../../artifacts/contracts/PredictionMarket.sol/PredictionMarket.json'` and use `PredictionMarketABI.abi` instead of the hardcoded array

### Step 6: Run the Frontend

```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:3000`

### Step 7: Connect Your Wallet

**Supported Wallets:**

- **MiniPay** (Recommended for mobile) - Built into Opera browser or standalone app
- **MetaMask** - Browser extension
- **Celo Wallet** - Celo-specific wallet extension

**For MiniPay (Mobile):**

1. Install [MiniPay](https://www.opera.com/crypto/minipay) on your mobile device
2. Open the dApp in MiniPay's browser
3. Click "Connect MiniPay" - it will automatically connect to Celo Sepolia

**For MetaMask/Celo Wallet (Desktop):**

1. Install [MetaMask](https://metamask.io/) or [Celo Wallet](https://celo.org/developers/wallet)
2. Add Celo Sepolia testnet to your wallet:
   - Network Name: Celo Sepolia
   - RPC URL: https://forno.celo-sepolia.celo-testnet.org
   - Chain ID: 11142220
   - Currency Symbol: CELO
   - Block Explorer: https://celo-sepolia.blockscout.com
3. Get testnet CELO from the [faucet](https://faucet.celo.org/)
4. Click "Connect Wallet" in the app

**Note:** The app automatically detects which wallet you're using and provides an optimized experience. See [MINIPAY_INTEGRATION.md](./MINIPAY_INTEGRATION.md) for more details on MiniPay integration.

## 🎯 How to Use

### Creating a Market

1. Connect your wallet
2. Enter a date (e.g., "December 25, 2024")
3. Set the duration (number of days the market will be active)
4. Click "Create Market"

### Placing Bets

1. Browse active markets
2. Enter the amount you want to bet (in CELO)
3. Click "Bet YES" or "Bet NO"
4. Confirm the transaction in your wallet

### Resolving Markets

1. Wait for the market end time
2. If you're the market creator, you'll see resolve buttons
3. Click "YES Won" or "NO Won" based on the actual outcome
4. Confirm the transaction

### Claiming Winnings

1. After a market is resolved, winners can claim their winnings
2. Click "Claim Winnings" on markets where you bet on the winning side
3. Your proportional share of the pool (minus fees) will be sent to your wallet

## 🔧 Smart Contract Features

- **Market Creation**: Anyone can create a prediction market
- **Betting**: Users can bet YES or NO on any active market
- **Resolution**: Market creators can resolve markets after the end time
- **Winnings Distribution**: Winners receive proportional shares of the pool
- **Fee System**: 2% fee on total pool (configurable by owner)

## 🧪 Testing

Run the test suite:

```bash
npm test
```

## 📝 Contract Functions

### Public Functions

- `createMarket(string _question, uint256 _durationInDays)` - Create a new market
- `placeBet(uint256 _marketId, bool _side)` - Place a bet (YES=true, NO=false)
- `resolveMarket(uint256 _marketId, bool _outcome)` - Resolve a market
- `claimWinnings(uint256 _marketId)` - Claim winnings from a resolved market
- `getMarket(uint256 _marketId)` - Get market details
- `getUserBet(uint256 _marketId, address _user)` - Get user's bets on a market

### Owner Functions

- `setFeePercentage(uint256 _feePercentage)` - Set the fee percentage (max 10%)
- `withdrawFees()` - Withdraw accumulated fees

## 🌐 Network Information

### Celo Sepolia Testnet

- Chain ID: 11142220
- RPC URL: https://forno.celo-sepolia.celo-testnet.org
- Block Explorer: https://celo-sepolia.blockscout.com
- Faucet: https://faucet.celo.org/

## 🛠️ Troubleshooting

### "Insufficient funds" error

- Make sure you have CELO tokens in your wallet
- Get testnet tokens from the faucet

### "Contract not deployed" error

- Verify the contract address in `frontend/.env.local`
- Make sure you deployed to Sepolia testnet

### "Transaction failed" error

- Check that you have enough CELO for gas
- Verify the market hasn't ended or been resolved
- Check browser console for detailed error messages

## 🚀 Deployment

### Quick Deploy

**Smart Contract (already deployed)**:

```bash
npm run deploy:sepolia
```

**Frontend to Vercel** (Recommended):

```bash
cd frontend
npm run build
vercel --prod
```

**Or deploy to Netlify**:

```bash
cd frontend
npm run build
netlify deploy --prod
```

### Environment Variables for Production

Set these in your hosting platform (Vercel/Netlify):

```
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
NEXT_PUBLIC_NETWORK=sepolia
NEXT_PUBLIC_RPC_URL=https://forno.celo-sepolia.celo-testnet.org
```

**📖 For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

## 📚 Additional Resources

- [Celo Documentation](https://docs.celo.org/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Ethers.js Documentation](https://docs.ethers.io/)
- [Vercel Deployment](https://vercel.com/docs)

## 📄 License

MIT

## 🤝 Contributing

Feel free to submit issues and enhancement requests!
