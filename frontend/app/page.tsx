'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import MarketList from '@/components/MarketList'
import CreateMarket from '@/components/CreateMarket'
import WalletConnect from '@/components/WalletConnect'
import { formatDistance } from 'date-fns'
import { isMiniPayAvailable } from '@/utils/walletDetection'

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ''
const CONTRACT_ABI = [
  "function createMarket(string memory _question, uint256 _durationInDays) external returns (uint256)",
  "function placeBet(uint256 _marketId, bool _side) external payable",
  "function resolveMarket(uint256 _marketId, bool _outcome) external",
  "function claimWinnings(uint256 _marketId) external",
  "function getMarket(uint256 _marketId) external view returns (uint256 id, string memory question, uint256 endTime, bool resolved, uint256 yesVotes, uint256 noVotes, uint256 totalStaked, address creator)",
  "function getUserBet(uint256 _marketId, address _user) external view returns (uint256 yesBet, uint256 noBet)",
  "function marketCount() external view returns (uint256)",
  "event MarketCreated(uint256 indexed marketId, string question, uint256 endTime, address creator)",
  "event BetPlaced(uint256 indexed marketId, address indexed bettor, bool side, uint256 amount)",
  "event MarketResolved(uint256 indexed marketId, bool outcome)",
  "event WinningsClaimed(uint256 indexed marketId, address indexed winner, uint256 amount)"
]

export default function Home() {
  const [account, setAccount] = useState<string | null>(null)
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [markets, setMarkets] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      checkConnection()
    }
  }, [])

  useEffect(() => {
    if (contract && account) {
      loadMarkets()
      // Listen for events
      contract.on('MarketCreated', loadMarkets)
      contract.on('BetPlaced', loadMarkets)
      contract.on('MarketResolved', loadMarkets)

      return () => {
        contract.removeAllListeners()
      }
    }
  }, [contract, account])

  const checkConnection = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const accounts = await provider.listAccounts()
      if (accounts.length > 0) {
        setAccount(accounts[0])
        setProvider(provider)
        const signer = provider.getSigner()
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
        setContract(contractInstance)
      }
    } catch (error) {
      console.error('Error checking connection:', error)
    }
  }

  const connectWallet = async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send('eth_requestAccounts', [])
        const signer = provider.getSigner()
        const address = await signer.getAddress()
        setAccount(address)
        setProvider(provider)
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
        setContract(contractInstance)
        
        // Log wallet type for debugging
        if (isMiniPayAvailable()) {
          console.log('Connected via MiniPay')
        }
      } else {
        const isMiniPay = isMiniPayAvailable()
        if (isMiniPay) {
          alert('MiniPay detected but connection failed. Please make sure MiniPay is unlocked.')
        } else {
          alert('Please install MiniPay, MetaMask, or a Celo-compatible wallet!')
        }
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error)
      if (error.code === 4001) {
        alert('Connection rejected. Please approve the connection request.')
      } else {
        alert(`Error: ${error.message || 'Failed to connect wallet'}`)
      }
    }
  }

  const loadMarkets = async () => {
    if (!contract) return
    try {
      setLoading(true)
      const count = await contract.marketCount()
      const marketArray = []
      
      for (let i = 1; i <= count.toNumber(); i++) {
        try {
          const market = await contract.getMarket(i)
          marketArray.push({
            id: market.id.toNumber(),
            question: market.question,
            endTime: market.endTime.toNumber() * 1000,
            resolved: market.resolved,
            yesVotes: ethers.utils.formatEther(market.yesVotes),
            noVotes: ethers.utils.formatEther(market.noVotes),
            totalStaked: ethers.utils.formatEther(market.totalStaked),
            creator: market.creator,
          })
        } catch (error) {
          console.error(`Error loading market ${i}:`, error)
        }
      }
      
      setMarkets(marketArray.reverse()) // Show newest first
    } catch (error) {
      console.error('Error loading markets:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-celo-green/10 to-celo-gold/10">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ⚡ UI Electrical Fault Prediction Market
          </h1>
          <p className="text-gray-600">
            Predict daily electrical faults at University of Ibadan on Celo
          </p>
        </div>

        <WalletConnect
          account={account}
          connectWallet={connectWallet}
        />

        {account && contract && (
          <>
            <CreateMarket
              contract={contract}
              onMarketCreated={loadMarkets}
            />

            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Active Markets</h2>
              {loading ? (
                <div className="text-center py-8">Loading markets...</div>
              ) : markets.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No markets yet. Create the first one!
                </div>
              ) : (
                <MarketList
                  markets={markets}
                  contract={contract}
                  account={account}
                  onUpdate={loadMarkets}
                />
              )}
            </div>
          </>
        )}

        {!account && (
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Connect your wallet to start predicting electrical faults
            </p>
          </div>
        )}
      </div>
    </main>
  )
}




