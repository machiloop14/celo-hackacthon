'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { formatDistance } from 'date-fns'
import MarketCard from './MarketCard'

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

interface MarketListProps {
  markets: Market[]
  contract: ethers.Contract
  account: string
  onUpdate: () => void
}

export default function MarketList({ markets, contract, account, onUpdate }: MarketListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {markets.map((market) => (
        <MarketCard
          key={market.id}
          market={market}
          contract={contract}
          account={account}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  )
}




