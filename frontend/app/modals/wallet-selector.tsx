import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useWallet } from '@/contexts/WalletContext';
import { WalletProvider } from '@/types';
import { colors, typography } from '@/constants/colors';
import { spacing } from '@/constants/layout';
import { X, Wallet } from 'lucide-react-native';

export default function WalletSelectorModal() {
  const { connectWallet, isConnecting } = useWallet();
  const [error, setError] = useState('');

  const walletOptions = [
    {
      provider: WalletProvider.LOCAL,
      name: 'In-App Wallet',
      description: 'Use a locally generated wallet',
      available: true,
    },
    {
      provider: WalletProvider.PHANTOM,
      name: 'Phantom',
      description: 'Connect with Phantom wallet',
      available: false,
    },
    {
      provider: WalletProvider.SOLFLARE,
      name: 'Solflare',
      description: 'Connect with Solflare wallet',
      available: false,
    },
    {
      provider: WalletProvider.BACKPACK,
      name: 'Backpack',
      description: 'Connect with Backpack wallet',
      available: false,
    },
  ];

  const handleConnect = async (provider: WalletProvider) => {
    setError('');
    try {
      await connectWallet(provider);
      router.back();
      if (router.canGoBack()) {
        router.replace('/(tabs)');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    }
  };

  if (isConnecting) {
    return <LoadingSpinner fullScreen message="Connecting wallet..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Connect Wallet</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <X size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Choose a wallet to connect to the app
        </Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.walletsList}>
          {walletOptions.map((option) => (
            <View
              key={option.provider}
              style={!option.available && styles.walletCardDisabled}
            >
              <Card
                onPress={
                  option.available ? () => handleConnect(option.provider) : undefined
                }
                style={styles.walletCard}
              >
                <View style={styles.walletIcon}>
                  <Wallet size={32} color={colors.accent.primary} />
                </View>
                <View style={styles.walletInfo}>
                  <Text style={styles.walletName}>{option.name}</Text>
                  <Text style={styles.walletDescription}>
                    {option.available ? option.description : 'Coming soon'}
                  </Text>
                </View>
              </Card>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
  },
  title: {
    ...typography.h2,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
  },
  errorContainer: {
    backgroundColor: `${colors.status.error}20`,
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.status.error,
    marginBottom: spacing.xl,
  },
  errorText: {
    ...typography.body,
    color: colors.status.error,
  },
  walletsList: {
    gap: spacing.md,
  },
  walletCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  walletCardDisabled: {
    opacity: 0.5,
  },
  walletIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  walletInfo: {
    flex: 1,
  },
  walletName: {
    ...typography.h3,
    fontSize: 18,
    marginBottom: spacing.xs,
  },
  walletDescription: {
    ...typography.caption,
    color: colors.text.muted,
  },
});
