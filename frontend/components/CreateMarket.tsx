'use client'

import { useState } from 'react'
import { ethers } from 'ethers'

interface CreateMarketProps {
  contract: ethers.Contract
  onMarketCreated: () => void
}

export default function CreateMarket({ contract, onMarketCreated }: CreateMarketProps) {
  const [question, setQuestion] = useState('')
  const [duration, setDuration] = useState(1)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return

    try {
      setLoading(true)
      const tx = await contract.createMarket(
        `Will there be an electrical fault at University of Ibadan on ${question}?`,
        duration
      )
      await tx.wait()
      setQuestion('')
      setDuration(1)
      onMarketCreated()
      alert('Market created successfully!')
    } catch (error: any) {
      console.error('Error creating market:', error)
      alert(`Error: ${error.message || 'Failed to create market'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Create New Prediction Market</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date (e.g., "December 25, 2024")
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter the date for prediction"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celo-green focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (days)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            min="1"
            max="365"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celo-green focus:border-transparent"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-celo-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-celo-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Market'}
        </button>
      </form>
    </div>
  )
}




