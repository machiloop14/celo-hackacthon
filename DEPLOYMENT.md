# Deployment Guide

This guide covers deploying both the smart contract and the frontend application.

## Prerequisites

- Smart contract deployed to Celo Sepolia (or mainnet)
- Contract address from deployment
- Frontend code ready for production
- Environment variables configured

## Part 1: Smart Contract Deployment

### Deploy to Celo Sepolia (Testnet)

1. **Ensure you have testnet CELO**:
   - Get testnet tokens from [Celo Faucet](https://faucet.celo.org/)

2. **Configure environment**:
   ```bash
   # .env file in root directory
   PRIVATE_KEY=your_private_key_here
   ```

3. **Deploy the contract**:
   ```bash
   npm run compile
   npm run deploy:sepolia
   ```

4. **Save the contract address**:
   - The deployment script saves it to `deployments/sepolia.json`
   - Copy the contract address for frontend configuration

### Deploy to Celo Mainnet (Production)

⚠️ **Warning**: Only deploy to mainnet after thorough testing on testnet!

1. **Add mainnet network to `hardhat.config.js`**:
   ```javascript
   networks: {
     sepolia: {
       url: "https://forno.celo-sepolia.celo-testnet.org",
       accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
       chainId: 11142220,
     },
     mainnet: {
       url: "https://forno.celo.org",
       accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
       chainId: 42220,
     },
   }
   ```

2. **Add deployment script**:
   ```bash
   # In package.json
   "deploy:mainnet": "hardhat run scripts/deploy.js --network mainnet"
   ```

3. **Deploy**:
   ```bash
   npm run deploy:mainnet
   ```

## Part 2: Frontend Deployment

### Option 1: Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

#### Step 1: Prepare for Deployment

1. **Build the frontend locally to test**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Verify the build works**:
   ```bash
   npm start
   ```

#### Step 2: Deploy to Vercel

1. **Install Vercel CLI** (optional, can use web interface):
   ```bash
   npm i -g vercel
   ```

2. **Deploy from frontend directory**:
   ```bash
   cd frontend
   vercel
   ```

   Or use the web interface:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your repository
   - Set root directory to `frontend`

3. **Configure Environment Variables**:
   In Vercel dashboard → Project Settings → Environment Variables:
   ```
   NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
   NEXT_PUBLIC_NETWORK=sepolia
   NEXT_PUBLIC_RPC_URL=https://forno.celo-sepolia.celo-testnet.org
   ```

4. **Redeploy** after adding environment variables

#### Step 3: Custom Domain (Optional)

- Go to Project Settings → Domains
- Add your custom domain
- Follow DNS configuration instructions

### Option 2: Deploy to Netlify

1. **Build command**:
   ```bash
   cd frontend && npm run build
   ```

2. **Publish directory**: `frontend/.next`

3. **Environment variables** (in Netlify dashboard):
   ```
   NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
   NEXT_PUBLIC_NETWORK=sepolia
   NEXT_PUBLIC_RPC_URL=https://forno.celo-sepolia.celo-testnet.org
   ```

4. **Deploy**:
   - Connect GitHub repository
   - Set build settings
   - Deploy

### Option 3: Deploy to Traditional Hosting

For VPS, AWS, or other traditional hosting:

1. **Build the application**:
   ```bash
   cd frontend
   npm run build
   npm run start
   ```

2. **Use PM2 for process management**:
   ```bash
   npm install -g pm2
   pm2 start npm --name "prediction-market" -- start
   pm2 save
   pm2 startup
   ```

3. **Configure reverse proxy** (Nginx example):
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Part 3: Environment Configuration

### Frontend Environment Variables

Create `frontend/.env.production` (or set in hosting platform):

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContractAddress
NEXT_PUBLIC_NETWORK=sepolia
NEXT_PUBLIC_RPC_URL=https://forno.celo-sepolia.celo-testnet.org
```

**Important Notes**:
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Never put private keys in frontend environment variables
- Update these when deploying to mainnet

### For Mainnet Deployment

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourMainnetContractAddress
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_RPC_URL=https://forno.celo.org
```

## Part 4: Post-Deployment Checklist

### Smart Contract

- [ ] Contract deployed and verified
- [ ] Contract address saved
- [ ] Contract functions tested on testnet
- [ ] Gas costs estimated
- [ ] Owner functions tested (if applicable)

### Frontend

- [ ] Environment variables configured
- [ ] Contract address updated in frontend
- [ ] Build completes without errors
- [ ] Application loads correctly
- [ ] Wallet connection works
- [ ] All features tested:
  - [ ] Create market
  - [ ] Place bet
  - [ ] Resolve market
  - [ ] Claim winnings

### Testing

- [ ] Test on testnet first
- [ ] Test with MiniPay
- [ ] Test with MetaMask
- [ ] Test on mobile devices
- [ ] Test all user flows
- [ ] Check error handling

## Part 5: Continuous Deployment (CI/CD)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]
    paths:
      - 'frontend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd frontend
          npm install
      
      - name: Build
        run: |
          cd frontend
          npm run build
        env:
          NEXT_PUBLIC_CONTRACT_ADDRESS: ${{ secrets.CONTRACT_ADDRESS }}
          NEXT_PUBLIC_NETWORK: ${{ secrets.NETWORK }}
          NEXT_PUBLIC_RPC_URL: ${{ secrets.RPC_URL }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./frontend
```

## Part 6: Monitoring and Maintenance

### Monitoring

1. **Set up error tracking**:
   - Consider adding Sentry or similar
   - Monitor console errors
   - Track failed transactions

2. **Analytics**:
   - Add Google Analytics or similar
   - Track user interactions
   - Monitor wallet connections

3. **Uptime monitoring**:
   - Use services like UptimeRobot
   - Monitor API endpoints
   - Check RPC node availability

### Maintenance

1. **Regular updates**:
   - Keep dependencies updated
   - Monitor security advisories
   - Update contract if needed

2. **Backup**:
   - Keep deployment artifacts
   - Document contract addresses
   - Save environment configurations

## Troubleshooting

### Build Fails

- Check Node.js version (should be 16+)
- Clear `node_modules` and reinstall
- Check for TypeScript errors
- Verify environment variables

### Contract Not Found

- Verify contract address is correct
- Check network (Sepolia vs Mainnet)
- Ensure contract is deployed
- Check RPC URL is correct

### Wallet Connection Issues

- Verify network configuration
- Check RPC endpoint is accessible
- Ensure wallet is on correct network
- Clear browser cache

## Resources

- [Vercel Deployment Docs](https://vercel.com/docs)
- [Netlify Deployment Docs](https://docs.netlify.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Celo Mainnet Info](https://docs.celo.org/network)

## Quick Deploy Commands

```bash
# Deploy contract to Sepolia
npm run deploy:sepolia

# Build frontend
cd frontend && npm run build

# Deploy to Vercel
cd frontend && vercel --prod

# Or deploy to Netlify
cd frontend && netlify deploy --prod
```

