'use client'

import { useEffect, useState } from 'react'
import { detectWallets, isMiniPayAvailable } from '@/utils/walletDetection'

interface WalletConnectProps {
  account: string | null
  connectWallet: () => void
}

export default function WalletConnect({ account, connectWallet }: WalletConnectProps) {
  const [wallets, setWallets] = useState<ReturnType<typeof detectWallets>>([])
  const [isMiniPay, setIsMiniPay] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setWallets(detectWallets())
    setIsMiniPay(isMiniPayAvailable())
  }, [])

  const primaryWallet = wallets.find(w => w.isInstalled)
  
  // Prevent hydration mismatch by using consistent structure
  const showWalletSpecificUI = mounted && primaryWallet

  if (account) {
    return (
      <div className="mb-6 flex justify-end items-center gap-3">
        {isMiniPay && (
          <div className="bg-celo-gold/20 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
            🟢 MiniPay
          </div>
        )}
        <div className="bg-white rounded-lg shadow-md px-6 py-3">
          <span className="text-sm text-gray-600">Connected: </span>
          <span className="text-sm font-mono text-celo-green">
            {account.slice(0, 6)}...{account.slice(-4)}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-6">
      <div className="flex justify-end items-center gap-3">
        {showWalletSpecificUI ? (
          <button
            onClick={connectWallet}
            className={`${
              isMiniPay
                ? 'bg-celo-gold text-gray-900 hover:bg-celo-gold/90'
                : 'bg-celo-green text-white hover:bg-celo-green/90'
            } px-6 py-3 rounded-lg font-semibold transition-colors shadow-md flex items-center gap-2`}
          >
            {isMiniPay && <span>📱</span>}
            Connect {primaryWallet?.name || 'Wallet'}
          </button>
        ) : (
          <>
            {mounted ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md">
                <p className="text-sm text-yellow-800 mb-2">
                  <strong>No wallet detected</strong>
                </p>
                <p className="text-xs text-yellow-700 mb-3">
                  For the best experience, use MiniPay on mobile or install a Celo-compatible wallet.
                </p>
                <div className="flex flex-col gap-2">
                  <a
                    href="https://www.opera.com/crypto/minipay"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-celo-gold text-gray-900 px-3 py-2 rounded font-medium text-center hover:bg-celo-gold/90 transition-colors"
                  >
                    📱 Get MiniPay (Mobile)
                  </a>
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-gray-200 text-gray-800 px-3 py-2 rounded font-medium text-center hover:bg-gray-300 transition-colors"
                  >
                    🦊 Get MetaMask
                  </a>
                </div>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="bg-celo-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-celo-green/90 transition-colors shadow-md"
              >
                Connect Wallet
              </button>
            )}
          </>
        )}
      </div>
      {mounted && isMiniPay && (
        <div className="mt-3 text-right">
          <p className="text-xs text-gray-500">
            💡 Using MiniPay - Fast, low-cost transactions on Celo
          </p>
        </div>
      )}
    </div>
  )
}




