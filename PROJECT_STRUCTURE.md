# Project Structure Overview

## Directory Structure

```
celo/
├── contracts/                    # Solidity smart contracts
│   └── PredictionMarket.sol     # Main prediction market contract
│
├── scripts/                      # Deployment and utility scripts
│   ├── deploy.js                # Deploy contract to network
│   ├── export-abi.js            # Export contract ABI for frontend
│   └── verify-deployment.js     # Verify deployment info
│
├── test/                         # Hardhat tests
│   └── PredictionMarket.test.js # Contract tests
│
├── frontend/                     # Next.js frontend application
│   ├── app/                     # Next.js 13+ app directory
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Main page component
│   │   └── globals.css          # Global styles
│   │
│   ├── components/              # React components
│   │   ├── WalletConnect.tsx    # Wallet connection component
│   │   ├── CreateMarket.tsx     # Market creation form
│   │   ├── MarketList.tsx       # List of all markets
│   │   └── MarketCard.tsx       # Individual market card
│   │
│   ├── types/                   # TypeScript type definitions
│   │   └── ethereum.d.ts        # Window.ethereum types
│   │
│   ├── package.json             # Frontend dependencies
│   ├── next.config.js           # Next.js configuration
│   ├── tailwind.config.js       # Tailwind CSS config
│   └── tsconfig.json            # TypeScript config
│
├── deployments/                  # Deployment artifacts (auto-generated)
│   └── alfajores.json           # Deployment info for Alfajores
│
├── artifacts/                    # Compiled contracts (auto-generated)
│   └── contracts/
│       └── PredictionMarket.sol/
│           └── PredictionMarket.json
│
├── cache/                        # Hardhat cache (auto-generated)
│
├── hardhat.config.js            # Hardhat configuration
├── package.json                 # Root dependencies
├── .gitignore                   # Git ignore rules
├── README.md                    # Main documentation
├── SETUP_GUIDE.md              # Detailed setup instructions
├── QUICK_START.md              # Quick start guide
└── PROJECT_STRUCTURE.md        # This file
```

## Key Files Explained

### Smart Contracts

**`contracts/PredictionMarket.sol`**
- Main prediction market smart contract
- Handles market creation, betting, resolution, and winnings distribution
- Written in Solidity 0.8.19
- Key functions:
  - `createMarket()` - Create a new prediction market
  - `placeBet()` - Place a bet on a market
  - `resolveMarket()` - Resolve a market with outcome
  - `claimWinnings()` - Claim winnings from resolved market

### Frontend Components

**`frontend/app/page.tsx`**
- Main page component
- Manages wallet connection
- Loads and displays markets
- Coordinates between components

**`frontend/components/WalletConnect.tsx`**
- Handles wallet connection UI
- Displays connected wallet address

**`frontend/components/CreateMarket.tsx`**
- Form for creating new markets
- Handles market creation transactions

**`frontend/components/MarketList.tsx`**
- Container for displaying all markets
- Maps markets to MarketCard components

**`frontend/components/MarketCard.tsx`**
- Individual market display
- Shows market details, betting options
- Handles betting, resolution, and claiming

### Configuration Files

**`hardhat.config.js`**
- Hardhat configuration
- Network settings for Celo Alfajores
- Solidity compiler settings

**`frontend/next.config.js`**
- Next.js configuration
- Webpack config for ethers.js compatibility

**`frontend/tailwind.config.js`**
- Tailwind CSS configuration
- Custom Celo brand colors

## Data Flow

1. **User connects wallet** → `WalletConnect.tsx` → `page.tsx`
2. **User creates market** → `CreateMarket.tsx` → Smart contract → Event emitted
3. **User places bet** → `MarketCard.tsx` → Smart contract → Event emitted
4. **Market resolved** → `MarketCard.tsx` → Smart contract → Event emitted
5. **User claims winnings** → `MarketCard.tsx` → Smart contract → Transfer

## Smart Contract Architecture

```
PredictionMarket Contract
├── State Variables
│   ├── markets (mapping)        # All markets by ID
│   ├── marketCount              # Total number of markets
│   ├── feePercentage            # Platform fee (2%)
│   └── owner                    # Contract owner
│
├── Market Struct
│   ├── id                       # Market identifier
│   ├── question                 # Prediction question
│   ├── endTime                  # Market end timestamp
│   ├── resolved                 # Resolution status
│   ├── yesVotes                 # Total YES bets
│   ├── noVotes                  # Total NO bets
│   ├── totalStaked              # Total amount staked
│   ├── creator                  # Market creator address
│   ├── yesBets (mapping)        # YES bets per user
│   ├── noBets (mapping)         # NO bets per user
│   └── hasClaimed (mapping)     # Claim status per user
│
└── Functions
    ├── createMarket()           # Public: Create market
    ├── placeBet()               # Public: Place bet
    ├── resolveMarket()          # Public: Resolve market
    ├── claimWinnings()          # Public: Claim winnings
    ├── getMarket()              # View: Get market info
    ├── getUserBet()             # View: Get user bets
    ├── setFeePercentage()       # Owner: Set fee
    └── withdrawFees()           # Owner: Withdraw fees
```

## Frontend Architecture

```
Next.js App (App Router)
├── Layout
│   └── Root Layout (layout.tsx)
│
├── Pages
│   └── Home Page (page.tsx)
│       ├── Wallet Connection State
│       ├── Contract Instance
│       └── Markets State
│
└── Components
    ├── WalletConnect
    │   └── Connection UI
    │
    ├── CreateMarket
    │   └── Market Creation Form
    │
    └── MarketList
        └── MarketCard (multiple)
            ├── Market Display
            ├── Betting Interface
            ├── Resolution Interface
            └── Claiming Interface
```

## Technology Stack

### Backend (Smart Contracts)
- **Solidity** 0.8.19
- **Hardhat** - Development framework
- **Ethers.js** - Ethereum library
- **Celo ContractKit** - Celo-specific tools

### Frontend
- **Next.js** 14 - React framework
- **React** 18 - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Ethers.js** - Blockchain interaction
- **date-fns** - Date formatting

### Network
- **Celo Alfajores** - Testnet
- **CELO** - Native token

## Development Workflow

1. **Write/Modify Contract** → `contracts/PredictionMarket.sol`
2. **Compile** → `npm run compile`
3. **Test** → `npm test`
4. **Deploy** → `npm run deploy:alfajores`
5. **Update Frontend** → Update `frontend/.env.local` with new address
6. **Run Frontend** → `cd frontend && npm run dev`
7. **Test in Browser** → http://localhost:3000

## Important Notes

- Contract address must be updated in `frontend/.env.local` after each deployment
- Always test on Alfajores before mainnet
- Keep private keys secure and never commit them
- Market creators are responsible for resolving markets fairly
- Fees are collected in the contract and can be withdrawn by owner




