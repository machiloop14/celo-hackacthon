# Quick Start Guide

Get up and running in 5 minutes!

## 1. Install Dependencies

```bash
npm install
cd frontend && npm install && cd ..
```

## 2. Set Up Environment

Create `.env` in root:
```
PRIVATE_KEY=your_private_key
```

## 3. Compile & Deploy

```bash
npm run compile
npm run deploy:alfajores
```

Copy the contract address from output.

## 4. Configure Frontend

Create `frontend/.env.local`:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
NEXT_PUBLIC_NETWORK=alfajores
NEXT_PUBLIC_RPC_URL=https://alfajores-forno.celo-testnet.org
```

## 5. Run Frontend

```bash
cd frontend
npm run dev
```

Open http://localhost:3000

## 6. Connect Wallet

1. Install MetaMask/Celo Wallet
2. Add Celo Alfajores network (Chain ID: 44787)
3. Get testnet CELO from [faucet](https://faucet.celo.org/alfajores)
4. Click "Connect Wallet" in the app

## Done! 🎉

You can now create markets and place bets!

For detailed instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)




