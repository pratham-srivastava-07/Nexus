import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useWallet } from '@/contexts/WalletContext';
import { colors, typography } from '@/constants/colors';
import { spacing } from '@/constants/layout';
import { truncateAddress, formatCurrency } from '@/utils/solana';
import { Copy, ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';

export default function WalletScreen() {
  const { wallet, isConnecting, refreshBalance, disconnectWallet } = useWallet();

  useEffect(() => {
    if (wallet?.connected) {
      refreshBalance();
    }
  }, []);

  const handleCopyAddress = async () => {
    if (wallet?.address) {
      await Clipboard.setStringAsync(wallet.address);
    }
  };

  const handleRefresh = async () => {
    await refreshBalance();
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  if (isConnecting) {
    return <LoadingSpinner fullScreen message="Connecting wallet..." />;
  }

  if (!wallet?.connected) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Wallet Connected</Text>
          <Text style={styles.emptyText}>
            Connect your wallet to view your balance and tokens
          </Text>
          <Button
            title="Connect Wallet"
            onPress={() => router.push('/modals/wallet-selector')}
            variant="primary"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Wallet</Text>
          <TouchableOpacity onPress={handleRefresh}>
            <RefreshCw size={24} color={colors.accent.primary} />
          </TouchableOpacity>
        </View>

        <Card style={styles.balanceCard}>
          <View style={styles.addressContainer}>
            <Text style={styles.addressLabel}>Address</Text>
            <TouchableOpacity
              style={styles.addressRow}
              onPress={handleCopyAddress}
            >
              <Text style={styles.address}>{truncateAddress(wallet.address, 8)}</Text>
              <Copy size={16} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balance}>{formatCurrency(wallet.balance)} SOL</Text>
            <Text style={styles.balanceUsd}>
              ≈ ${formatCurrency(wallet.balance * 100, 2)} USD
            </Text>
          </View>

          <View style={styles.actions}>
            <Button
              title="Send"
              onPress={() => {}}
              variant="primary"
              icon={<ArrowUpRight size={20} color={colors.text.primary} />}
              style={styles.actionButton}
            />
            <Button
              title="Receive"
              onPress={() => {}}
              variant="outline"
              icon={<ArrowDownLeft size={20} color={colors.accent.primary} />}
              style={styles.actionButton}
            />
          </View>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tokens</Text>
          <Card>
            <View style={styles.tokenItem}>
              <View style={styles.tokenIcon} />
              <View style={styles.tokenInfo}>
                <Text style={styles.tokenName}>Solana</Text>
                <Text style={styles.tokenSymbol}>SOL</Text>
              </View>
              <View style={styles.tokenBalance}>
                <Text style={styles.tokenAmount}>{formatCurrency(wallet.balance)}</Text>
                <Text style={styles.tokenValue}>
                  ${formatCurrency(wallet.balance * 100, 2)}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <Button
            title="Change Wallet"
            onPress={() => router.push('/modals/wallet-selector')}
            variant="outline"
            fullWidth
          />
          <Button
            title="Disconnect"
            onPress={handleDisconnect}
            variant="danger"
            fullWidth
            style={styles.disconnectButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
  },
  title: {
    ...typography.h1,
  },
  balanceCard: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  addressContainer: {
    marginBottom: spacing.lg,
  },
  addressLabel: {
    ...typography.caption,
    color: colors.text.muted,
    marginBottom: spacing.xs,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  address: {
    ...typography.body,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  balanceContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border.default,
    marginBottom: spacing.lg,
  },
  balanceLabel: {
    ...typography.caption,
    color: colors.text.muted,
    marginBottom: spacing.sm,
  },
  balance: {
    ...typography.h1,
    fontSize: 40,
    color: colors.accent.primary,
    marginBottom: spacing.xs,
  },
  balanceUsd: {
    ...typography.body,
    color: colors.text.secondary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  section: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  tokenItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  tokenIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent.primary,
  },
  tokenInfo: {
    flex: 1,
  },
  tokenName: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  tokenSymbol: {
    ...typography.caption,
    color: colors.text.muted,
  },
  tokenBalance: {
    alignItems: 'flex-end',
  },
  tokenAmount: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  tokenValue: {
    ...typography.caption,
    color: colors.text.muted,
  },
  disconnectButton: {
    marginTop: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.lg,
  },
  emptyTitle: {
    ...typography.h2,
  },
  emptyText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
