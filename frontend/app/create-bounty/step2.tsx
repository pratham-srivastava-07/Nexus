import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useWallet } from '@/contexts/WalletContext';
import { colors, typography } from '@/constants/colors';
import { spacing } from '@/constants/layout';
import { validateBountyAmount, formatCurrency } from '@/utils/validation';
import { ArrowLeft } from 'lucide-react-native';

export default function CreateBountyStep2() {
  const params = useLocalSearchParams();
  const { wallet } = useWallet();
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');

  const handleNext = () => {
    setAmountError('');

    const numAmount = parseFloat(amount);
    if (!validateBountyAmount(numAmount)) {
      setAmountError('Please enter a valid bounty amount');
      return;
    }

    if (wallet && numAmount > wallet.balance) {
      setAmountError('Insufficient balance');
      return;
    }

    router.push({
      pathname: '/create-bounty/step3',
      params: { ...params, bountyAmount: amount, mintAddress: 'So11111111111111111111111111111111111111112' },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button
          // style={{textAlign: "start"}}
          title=""
          onPress={() => router.back()}
          variant="text"
          icon={<ArrowLeft size={24} color={colors.text.primary} />}
        />
        <Text style={styles.progress}>Step 2 of 3</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Set Reward</Text>
        <Text style={styles.subtitle}>
          How much will you pay for this bounty?
        </Text>

        {wallet?.connected && (
          <Card style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balance}>
              {formatCurrency(wallet.balance)} SOL
            </Text>
          </Card>
        )}

        <View style={styles.form}>
          <Input
            label="Bounty Amount (SOL)"
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            keyboardType="numeric"
            error={amountError}
          />

          <Card style={styles.infoCard}>
            <Text style={styles.infoTitle}>Network Fees</Text>
            <Text style={styles.infoText}>
              Estimated transaction fee: ~0.000005 SOL
            </Text>
          </Card>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={handleNext}
          variant="primary"
          fullWidth
          disabled={!amount || !wallet?.connected}
        />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    marginTop: 20
  },
  progress: {
    ...typography.caption,
    color: colors.text.muted,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
  },
  balanceCard: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  balanceLabel: {
    ...typography.caption,
    color: colors.text.muted,
    marginBottom: spacing.xs,
  },
  balance: {
    ...typography.h2,
    color: colors.accent.primary,
  },
  form: {
    gap: spacing.lg,
  },
  infoCard: {
    backgroundColor: colors.background.secondary,
  },
  infoTitle: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  infoText: {
    ...typography.caption,
    color: colors.text.muted,
  },
  footer: {
    padding: spacing.xl,
    borderTopWidth: 1,
    borderColor: colors.border.default,
  },
});
