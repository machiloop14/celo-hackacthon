import { ethers } from "ethers";
import { isMiniPayAvailable } from "./walletDetection";

/**
 * Send a transaction optimized for MiniPay
 * MiniPay requires specific transaction format and handles fee currency automatically
 */
export async function sendMiniPayTransaction(
  contract: ethers.Contract,
  methodName: string,
  args: any[],
  cusdAddress: string
): Promise<ethers.ContractTransaction> {
  const signer = contract.signer as ethers.Signer;
  const provider = signer.provider as ethers.providers.Web3Provider;

  // Populate the transaction
  const populatedTx = await contract.populateTransaction[methodName](...args);
  const fromAddress = await signer.getAddress();

  // Build transaction request for MiniPay
  const txRequest: any = {
    from: fromAddress,
    to: populatedTx.to,
    data: populatedTx.data,
    value: populatedTx.value ? ethers.utils.hexlify(populatedTx.value) : "0x0",
    feeCurrency: cusdAddress, // MiniPay will use cUSD for gas
  };

  // For MiniPay, let the wallet estimate gas automatically
  // Don't set manual gas limits as it can cause crashes

  // Use window.ethereum.request directly for MiniPay compatibility
  if (typeof window !== "undefined" && window.ethereum) {
    try {
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [txRequest],
      });

      // Return transaction object
      return provider.getTransaction(txHash);
    } catch (error: any) {
      console.error("MiniPay transaction error:", error);
      throw error;
    }
  } else {
    throw new Error("No wallet provider available");
  }
}

/**
 * Send a standard transaction (for non-MiniPay wallets)
 */
export async function sendStandardTransaction(
  contract: ethers.Contract,
  methodName: string,
  args: any[],
  overrides?: ethers.Overrides
): Promise<ethers.ContractTransaction> {
  const method = contract[methodName];
  return await method(...args, overrides);
}

/**
 * Universal transaction sender that detects MiniPay and uses appropriate method
 */
export async function sendTransaction(
  contract: ethers.Contract,
  methodName: string,
  args: any[],
  cusdAddress: string,
  overrides?: ethers.Overrides
): Promise<ethers.ContractTransaction> {
  // Check if we're using MiniPay
  if (isMiniPayAvailable()) {
    // Use MiniPay-optimized transaction
    return await sendMiniPayTransaction(contract, methodName, args, cusdAddress);
  } else {
    // Use standard transaction for other wallets
    return await sendStandardTransaction(contract, methodName, args, overrides);
  }
}

