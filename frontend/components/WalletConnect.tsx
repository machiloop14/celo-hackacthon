'use client'

interface WalletConnectProps {
  account: string | null
  connectWallet: () => void
}

export default function WalletConnect({ account, connectWallet }: WalletConnectProps) {
  return (
    <div className="mb-6 flex justify-end">
      {account ? (
        <div className="bg-white rounded-lg shadow-md px-6 py-3">
          <span className="text-sm text-gray-600">Connected: </span>
          <span className="text-sm font-mono text-celo-green">
            {account.slice(0, 6)}...{account.slice(-4)}
          </span>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-celo-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-celo-green/90 transition-colors shadow-md"
        >
          Connect Wallet
        </button>
      )}
    </div>
  )
}




