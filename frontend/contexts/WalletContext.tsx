import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Keypair, PublicKey } from '@solana/web3.js';
import { WalletInfo, WalletProvider as WalletProviderType, TokenBalance } from '@/types';
import {
  generateKeypair,
  storeKeypair,
  loadKeypair,
  deleteKeypair,
  getWalletBalance,
} from '@/utils/solana';
import { useAuth } from './AuthContext';

interface WalletContextType {
  wallet: WalletInfo | null;
  isConnecting: boolean;
  connectWallet: (provider: WalletProviderType) => Promise<void>;
  disconnectWallet: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  getPublicKey: () => PublicKey | null;
  getKeypair: () => Promise<Keypair | null>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [keypair, setKeypair] = useState<Keypair | null>(null);
  const { updateUser } = useAuth();

  useEffect(() => {
    loadExistingWallet();
  }, []);

  const loadExistingWallet = async () => {
    try {
      const existingKeypair = await loadKeypair();
      if (existingKeypair) {
        setKeypair(existingKeypair);
        await updateWalletInfo(existingKeypair, 'local' as WalletProviderType);
      }
    } catch (error) {
      console.error('Error loading existing wallet:', error);
    }
  };

  const connectWallet = async (provider: WalletProviderType) => {
    setIsConnecting(true);
    try {
      let newKeypair: Keypair;

      if (provider === 'local') {
        const existingKeypair = await loadKeypair();
        if (existingKeypair) {
          newKeypair = existingKeypair;
        } else {
          newKeypair = await generateKeypair();
          await storeKeypair(newKeypair);
        }
      } else {
        throw new Error('External wallet providers not yet implemented');
      }

      setKeypair(newKeypair);
      await updateWalletInfo(newKeypair, provider);
      updateUser({ walletAddress: newKeypair.publicKey.toBase58() });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await deleteKeypair();
      setWallet(null);
      setKeypair(null);
      updateUser({ walletAddress: '' });
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      throw error;
    }
  };

  const updateWalletInfo = async (kp: Keypair, provider: WalletProviderType) => {
    try {
      const balance = await getWalletBalance(kp.publicKey);

      const walletInfo: WalletInfo = {
        address: kp.publicKey.toBase58(),
        balance,
        tokens: [],
        connected: true,
        provider,
      };

      setWallet(walletInfo);
    } catch (error) {
      console.error('Error updating wallet info:', error);
      throw error;
    }
  };

  const refreshBalance = async () => {
    if (!keypair) return;

    try {
      const balance = await getWalletBalance(keypair.publicKey);
      setWallet((prev) =>
        prev ? { ...prev, balance } : null
      );
    } catch (error) {
      console.error('Error refreshing balance:', error);
    }
  };

  const getPublicKey = (): PublicKey | null => {
    return keypair ? keypair.publicKey : null;
  };

  const getKeypair = async (): Promise<Keypair | null> => {
    return keypair;
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        isConnecting,
        connectWallet,
        disconnectWallet,
        refreshBalance,
        getPublicKey,
        getKeypair,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
