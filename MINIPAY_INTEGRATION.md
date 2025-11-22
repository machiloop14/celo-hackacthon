# Celo MiniPay Integration Guide

This guide explains how Celo MiniPay is integrated into the prediction market dApp and how to use it.

## What is Celo MiniPay?

Celo MiniPay is a non-custodial mobile wallet built by Opera that enables fast, low-cost transactions on the Celo blockchain. It's designed for mobile-first experiences and supports stablecoins like cUSD, USDC, and USDT.

## Integration Features

### 1. Automatic Detection

The app automatically detects when MiniPay is available and provides a tailored experience:

- **MiniPay Badge**: Shows a green "MiniPay" indicator when connected
- **Mobile-Optimized UI**: The interface adapts for mobile devices
- **Simplified Connection**: One-tap wallet connection

### 2. Wallet Detection

The app uses a utility (`frontend/utils/walletDetection.ts`) that:

- Detects MiniPay, MetaMask, Celo Wallet, and other Web3 wallets
- Provides appropriate connection options based on available wallets
- Shows download links if no wallet is detected

### 3. Seamless Transactions

MiniPay works seamlessly with the existing ethers.js integration:

- All contract interactions work the same way
- Transactions are optimized for Celo's low fees
- Fast confirmation times

## How to Use MiniPay

### For End Users

1. **Install MiniPay**:
   - Download the Opera browser with MiniPay on iOS or Android
   - Or download the standalone MiniPay app from the app store

2. **Access the dApp**:
   - Open the dApp URL in Opera browser (with MiniPay)
   - Or use the MiniPay standalone app's browser

3. **Connect**:
   - Click "Connect MiniPay" button
   - Approve the connection request
   - Start using the prediction market!

### For Developers

#### Testing with MiniPay

1. **Enable Developer Mode**:
   - Open MiniPay app
   - Go to Settings → About
   - Tap the version number 7 times
   - Developer mode will be enabled

2. **Test Locally**:
   - Start your local dev server: `npm run dev` (in frontend directory)
   - Use ngrok to expose it: `ngrok http 3000`
   - Access the ngrok URL from MiniPay browser

3. **Deploy to Testnet**:
   - Deploy your frontend to a public URL (Vercel, Netlify, etc.)
   - Access from MiniPay browser
   - Make sure your contract is deployed to Celo Sepolia

#### Code Structure

```
frontend/
├── utils/
│   └── walletDetection.ts    # Wallet detection utilities
├── components/
│   └── WalletConnect.tsx     # Enhanced wallet connection UI
└── app/
    └── page.tsx              # Main page with MiniPay support
```

## Technical Details

### Detection Method

MiniPay is detected through multiple methods:

```typescript
const isMiniPay =
  window.ethereum?.isMiniPay === true ||
  window.ethereum?.isOpera === true ||
  navigator.userAgent.includes("OPR") ||
  navigator.userAgent.includes("Opera");
```

### Provider Usage

MiniPay exposes `window.ethereum` just like MetaMask, so the existing ethers.js code works without modification:

```typescript
const provider = new ethers.providers.Web3Provider(window.ethereum);
```

### Network Configuration

Make sure MiniPay is connected to Celo Sepolia:

- **Chain ID**: 11142220
- **RPC URL**: https://forno.celo-sepolia.celo-testnet.org
- **Currency Symbol**: CELO

MiniPay should automatically connect to the correct network, but users can switch networks in MiniPay settings if needed.

## Benefits of MiniPay Integration

1. **Mobile-First**: Optimized for mobile users
2. **Low Fees**: Celo's low transaction costs
3. **Fast Transactions**: Quick confirmation times
4. **User-Friendly**: Simple, intuitive interface
5. **Stablecoin Support**: Native support for cUSD, USDC, USDT

## Troubleshooting

### MiniPay Not Detected

- Make sure you're using Opera browser with MiniPay enabled
- Or use the standalone MiniPay app
- Check that MiniPay is unlocked

### Connection Fails

- Ensure MiniPay is unlocked
- Check that you're on the correct network (Celo Sepolia)
- Try refreshing the page

### Transactions Fail

- Verify you have enough CELO for gas fees
- Check that the contract address is correct
- Ensure you're connected to Celo Sepolia testnet

## Resources

- [MiniPay Official Site](https://www.opera.com/crypto/minipay)
- [Celo MiniPay Documentation](https://docs.celo.org/build/build-on-minipay)
- [Celo Sepolia Testnet](https://docs.celo.org/tooling/testnets/celo-sepolia)

## Future Enhancements

Potential improvements for MiniPay integration:

- [ ] QR code scanning for desktop-to-mobile connection
- [ ] MiniPay-specific transaction optimizations
- [ ] Push notifications for market updates
- [ ] Offline transaction queuing
- [ ] MiniPay payment links integration
