'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { formatDistance } from 'date-fns'

interface Market {
  id: number
  question: string
  endTime: number
  resolved: boolean
  yesVotes: string
  noVotes: string
  totalStaked: string
  creator: string
}

interface MarketCardProps {
  market: Market
  contract: ethers.Contract
  account: string
  onUpdate: () => void
  cusdToken: ethers.Contract
  cusdAddress: string
}

export default function MarketCard({ market, contract, account, onUpdate, cusdToken, cusdAddress }: MarketCardProps) {
  const [betAmount, setBetAmount] = useState('')
  const [userYesBet, setUserYesBet] = useState('0')
  const [userNoBet, setUserNoBet] = useState('0')
  const [loading, setLoading] = useState(false)
  const [resolving, setResolving] = useState(false)
  const [claiming, setClaiming] = useState(false)

  const isEnded = Date.now() > market.endTime
  const isCreator = market.creator.toLowerCase() === account.toLowerCase()
  const outcome = parseFloat(market.yesVotes) > parseFloat(market.noVotes)
  const userWon = (outcome && parseFloat(userYesBet) > 0) || (!outcome && parseFloat(userNoBet) > 0)

  useEffect(() => {
    loadUserBets()
  }, [market.id, account])

  const loadUserBets = async () => {
    try {
      const bets = await contract.getUserBet(market.id, account)
      setUserYesBet(ethers.utils.formatEther(bets.yesBet))
      setUserNoBet(ethers.utils.formatEther(bets.noBet))
    } catch (error) {
      console.error('Error loading user bets:', error)
    }
  }

  const placeBet = async (side: boolean) => {
    if (!betAmount || parseFloat(betAmount) <= 0) {
      alert('Please enter a valid bet amount')
      return
    }

    try {
      setLoading(true)
      const amount = ethers.utils.parseEther(betAmount)
      
      // Check and approve token allowance
      const contractAddress = contract.address
      const allowance = await cusdToken.allowance(account, contractAddress)
      
      if (allowance.lt(amount)) {
        // Need to approve
        const approveTx = await cusdToken.approve(contractAddress, ethers.constants.MaxUint256)
        await approveTx.wait()
      }

      // Place the bet
      const tx = await contract.placeBet(market.id, side, amount)
      await tx.wait()
      setBetAmount('')
      loadUserBets()
      onUpdate()
      alert('Bet placed successfully!')
    } catch (error: any) {
      console.error('Error placing bet:', error)
      alert(`Error: ${error.message || 'Failed to place bet'}`)
    } finally {
      setLoading(false)
    }
  }

  const resolveMarket = async (outcome: boolean) => {
    try {
      setResolving(true)
      const tx = await contract.resolveMarket(market.id, outcome)
      await tx.wait()
      onUpdate()
      alert('Market resolved successfully!')
    } catch (error: any) {
      console.error('Error resolving market:', error)
      alert(`Error: ${error.message || 'Failed to resolve market'}`)
    } finally {
      setResolving(false)
    }
  }

  const claimWinnings = async () => {
    try {
      setClaiming(true)
      const tx = await contract.claimWinnings(market.id)
      await tx.wait()
      loadUserBets()
      onUpdate()
      alert('Winnings claimed successfully!')
    } catch (error: any) {
      console.error('Error claiming winnings:', error)
      alert(`Error: ${error.message || 'Failed to claim winnings'}`)
    } finally {
      setClaiming(false)
    }
  }

  const yesPercentage = parseFloat(market.totalStaked) > 0
    ? (parseFloat(market.yesVotes) / parseFloat(market.totalStaked)) * 100
    : 50
  const noPercentage = 100 - yesPercentage

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold mb-2">{market.question}</h3>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Status:</span>
          <span className={market.resolved ? 'text-green-600' : isEnded ? 'text-orange-600' : 'text-blue-600'}>
            {market.resolved ? 'Resolved' : isEnded ? 'Ended' : 'Active'}
          </span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Ends:</span>
          <span>{formatDistance(new Date(market.endTime), new Date(), { addSuffix: true })}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">YES</span>
          <span className="text-sm">{parseFloat(market.yesVotes).toFixed(4)} cUSD</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${yesPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">NO</span>
          <span className="text-sm">{parseFloat(market.noVotes).toFixed(4)} cUSD</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-red-500 h-2 rounded-full"
            style={{ width: `${noPercentage}%` }}
          />
        </div>
      </div>

      <div className="text-sm text-gray-600 mb-4">
        Total Staked: <span className="font-semibold">{parseFloat(market.totalStaked).toFixed(4)} cUSD</span>
      </div>

      {(parseFloat(userYesBet) > 0 || parseFloat(userNoBet) > 0) && (
        <div className="mb-4 p-2 bg-gray-50 rounded text-sm">
          <div>Your YES bet: {parseFloat(userYesBet).toFixed(4)} cUSD</div>
          <div>Your NO bet: {parseFloat(userNoBet).toFixed(4)} cUSD</div>
        </div>
      )}

      {!market.resolved && !isEnded && (
        <div className="space-y-2">
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            placeholder="Amount (cUSD)"
            step="0.001"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => placeBet(true)}
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-green-600 disabled:opacity-50"
            >
              Bet YES
            </button>
            <button
              onClick={() => placeBet(false)}
              disabled={loading}
              className="bg-red-500 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-red-600 disabled:opacity-50"
            >
              Bet NO
            </button>
          </div>
        </div>
      )}

      {isEnded && !market.resolved && isCreator && (
        <div className="space-y-2 mt-4">
          <p className="text-sm text-gray-600">Resolve this market:</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => resolveMarket(true)}
              disabled={resolving}
              className="bg-green-500 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-green-600 disabled:opacity-50"
            >
              YES Won
            </button>
            <button
              onClick={() => resolveMarket(false)}
              disabled={resolving}
              className="bg-red-500 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-red-600 disabled:opacity-50"
            >
              NO Won
            </button>
          </div>
        </div>
      )}

      {market.resolved && userWon && (
        <button
          onClick={claimWinnings}
          disabled={claiming}
          className="w-full mt-4 bg-celo-gold text-gray-900 px-4 py-2 rounded font-semibold hover:bg-celo-gold/90 disabled:opacity-50"
        >
          {claiming ? 'Claiming...' : 'Claim Winnings'}
        </button>
      )}

      {market.resolved && (
        <div className="mt-4 p-2 bg-gray-100 rounded text-sm text-center">
          Outcome: <span className="font-semibold">{outcome ? 'YES' : 'NO'}</span>
        </div>
      )}
    </div>
  )
}




