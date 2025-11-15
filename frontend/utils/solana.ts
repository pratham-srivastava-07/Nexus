import {
  Connection,
  PublicKey,
  Keypair,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import * as SecureStore from 'expo-secure-store';

export const CLUSTER = 'devnet';
export const connection = new Connection(clusterApiUrl(CLUSTER), 'confirmed');

export async function getWalletBalance(publicKey: PublicKey): Promise<number> {
  try {
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    throw error;
  }
}

export async function getTokenBalance(
  walletAddress: PublicKey,
  mintAddress: PublicKey
): Promise<number> {
  try {
    const tokenAccount = await getAssociatedTokenAddress(
      mintAddress,
      walletAddress
    );
    const balance = await connection.getTokenAccountBalance(tokenAccount);
    return parseFloat(balance.value.amount) / Math.pow(10, balance.value.decimals);
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return 0;
  }
}

export async function generateKeypair(): Promise<Keypair> {
  return Keypair.generate();
}

export async function storeKeypair(keypair: Keypair): Promise<void> {
  try {
    const secretKey = JSON.stringify(Array.from(keypair.secretKey));
    await SecureStore.setItemAsync('wallet_secret_key', secretKey);
  } catch (error) {
    console.error('Error storing keypair:', error);
    throw error;
  }
}

export async function loadKeypair(): Promise<Keypair | null> {
  try {
    const secretKeyString = await SecureStore.getItemAsync('wallet_secret_key');
    if (!secretKeyString) {
      return null;
    }
    const secretKey = new Uint8Array(JSON.parse(secretKeyString));
    return Keypair.fromSecretKey(secretKey);
  } catch (error) {
    console.error('Error loading keypair:', error);
    return null;
  }
}

export async function deleteKeypair(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync('wallet_secret_key');
  } catch (error) {
    console.error('Error deleting keypair:', error);
    throw error;
  }
}

export function truncateAddress(address: string, chars: number = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function formatCurrency(amount: number, decimals: number = 2): string {
  return amount.toFixed(decimals);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function getTimeRemaining(deadline: Date): string {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();

  if (diff <= 0) {
    return 'Expired';
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) {
    return `${days}d ${hours}h remaining`;
  }

  return `${hours}h remaining`;
}

export async function requestAirdrop(publicKey: PublicKey, amount: number = 1): Promise<string> {
  try {
    const signature = await connection.requestAirdrop(
      publicKey,
      amount * LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(signature);
    return signature;
  } catch (error) {
    console.error('Error requesting airdrop:', error);
    throw error;
  }
}

export function getExplorerUrl(signature: string, cluster: string = CLUSTER): string {
  return `https://explorer.solana.com/tx/${signature}?cluster=${cluster}`;
}
