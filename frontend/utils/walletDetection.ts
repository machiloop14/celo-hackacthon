/**
 * Utility functions for wallet detection and connection
 */

export interface WalletInfo {
  name: string;
  isInstalled: boolean;
  isMiniPay?: boolean;
  downloadUrl?: string;
}

/**
 * Detect which wallets are available
 */
export function detectWallets(): WalletInfo[] {
  const wallets: WalletInfo[] = [];

  if (typeof window === "undefined") {
    return wallets;
  }

  // Check for MiniPay (Opera's Celo wallet)
  const isMiniPay =
    (window as any).ethereum?.isMiniPay === true ||
    (window as any).ethereum?.isOpera === true ||
    navigator.userAgent.includes("OPR") ||
    navigator.userAgent.includes("Opera");

  // Check for MetaMask
  const isMetaMask = (window as any).ethereum?.isMetaMask === true;

  // Check for Celo Wallet Extension
  const isCeloWallet = (window as any).celo !== undefined;

  // Generic ethereum provider
  const hasEthereum = typeof (window as any).ethereum !== "undefined";

  if (isMiniPay) {
    wallets.push({
      name: "MiniPay",
      isInstalled: true,
      isMiniPay: true,
    });
  }

  if (isMetaMask && !isMiniPay) {
    wallets.push({
      name: "MetaMask",
      isInstalled: true,
      downloadUrl: "https://metamask.io/download/",
    });
  }

  if (isCeloWallet) {
    wallets.push({
      name: "Celo Wallet",
      isInstalled: true,
      downloadUrl: "https://celo.org/developers/wallet",
    });
  }

  if (hasEthereum && !isMiniPay && !isMetaMask && !isCeloWallet) {
    wallets.push({
      name: "Web3 Wallet",
      isInstalled: true,
    });
  }

  // Add MiniPay as recommended if not installed
  if (!isMiniPay) {
    wallets.push({
      name: "MiniPay",
      isInstalled: false,
      isMiniPay: true,
      downloadUrl: "https://www.opera.com/crypto/minipay",
    });
  }

  return wallets;
}

/**
 * Get the primary wallet to use
 */
export function getPrimaryWallet(): WalletInfo | null {
  const wallets = detectWallets();
  return wallets.find((w) => w.isInstalled) || null;
}

/**
 * Check if MiniPay is available
 */
export function isMiniPayAvailable(): boolean {
  if (typeof window === "undefined") return false;
  return (
    (window as any).ethereum?.isMiniPay === true ||
    (window as any).ethereum?.isOpera === true ||
    navigator.userAgent.includes("OPR") ||
    navigator.userAgent.includes("Opera")
  );
}
