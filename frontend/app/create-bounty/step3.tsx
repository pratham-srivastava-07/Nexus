import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useBounty } from '@/contexts/BountyContext';
import { useWallet } from '@/contexts/WalletContext';
import { BountyCategory, BountyStatus } from '@/types';
import { colors, typography } from '@/constants/colors';
import { spacing } from '@/constants/layout';
import { formatCurrency } from '@/utils/validation';
import { ArrowLeft, CheckCircle } from 'lucide-react-native';

export default function CreateBountyStep3() {
  const params = useLocalSearchParams();
  const { createBounty } = useBounty();
  const { wallet } = useWallet();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    setIsCreating(true);
    setError('');

    try {
      const bountyId = await createBounty({
        bountyMint: `bounty_${Date.now()}`,
        vaultAddress: `vault_${Date.now()}`,
        title: params.title as string,
        description: params.description as string,
        category: params.category as BountyCategory,
        bountyAmount: parseFloat(params.bountyAmount as string),
        mintAddress: params.mintAddress as string,
        creatorAddress: wallet?.address || '',
        status: BountyStatus.OPEN,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      });

      router.replace(`/bounty/${bountyId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create bounty');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button
          title=""
          onPress={() => router.back()}
          variant="text"
          icon={<ArrowLeft size={24} color={colors.text.primary} />}
        />
        <Text style={styles.progress}>Step 3 of 3</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Review & Create</Text>
        <Text style={styles.subtitle}>
          Please review your bounty details
        </Text>

        <Card style={styles.reviewCard}>
          <View style={styles.reviewSection}>
            <Text style={styles.sectionLabel}>Title</Text>
            <Text style={styles.sectionValue}>{params.title}</Text>
          </View>

          <View style={styles.reviewSection}>
            <Text style={styles.sectionLabel}>Description</Text>
            <Text style={styles.sectionValue}>{params.description}</Text>
          </View>

          <View style={styles.reviewSection}>
            <Text style={styles.sectionLabel}>Category</Text>
            <Badge
              label={
                params.category
                  ? (params.category as string).toUpperCase()
                  : 'OTHER'
              }
            />
          </View>

          <View style={styles.reviewSection}>
            <Text style={styles.sectionLabel}>Bounty Amount</Text>
            <Text style={styles.amountValue}>
              {formatCurrency(parseFloat(params.bountyAmount as string))} SOL
            </Text>
          </View>
        </Card>

        <Card style={styles.costCard}>
          <Text style={styles.costTitle}>Total Cost Breakdown</Text>
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Bounty Amount</Text>
            <Text style={styles.costValue}>
              {formatCurrency(parseFloat(params.bountyAmount as string))} SOL
            </Text>
          </View>
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Transaction Fee</Text>
            <Text style={styles.costValue}>~0.000005 SOL</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.costRow}>
            <Text style={styles.costTotal}>Total</Text>
            <Text style={styles.costTotal}>
              {formatCurrency(parseFloat(params.bountyAmount as string) + 0.000005)} SOL
            </Text>
          </View>
        </Card>

        {error && (
          <Card style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
          </Card>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Back"
          onPress={() => router.back()}
          variant="outline"
          fullWidth
        />
        <Button
          title="Create Bounty"
          onPress={handleCreate}
          variant="gradient"
          fullWidth
          loading={isCreating}
          icon={!isCreating ? <CheckCircle size={20} color={colors.text.primary} /> : undefined}
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
  reviewCard: {
    marginBottom: spacing.lg,
    gap: spacing.lg,
  },
  reviewSection: {
    gap: spacing.sm,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.text.muted,
  },
  sectionValue: {
    ...typography.body,
    color: colors.text.secondary,
  },
  amountValue: {
    ...typography.h3,
    color: colors.accent.primary,
  },
  costCard: {
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  costTitle: {
    ...typography.h3,
    fontSize: 16,
    marginBottom: spacing.sm,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  costLabel: {
    ...typography.body,
    color: colors.text.secondary,
  },
  costValue: {
    ...typography.body,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.default,
  },
  costTotal: {
    ...typography.h3,
    fontSize: 18,
  },
  errorCard: {
    backgroundColor: `${colors.status.error}20`,
    borderColor: colors.status.error,
  },
  errorText: {
    ...typography.body,
    color: colors.status.error,
  },
  footer: {
    padding: spacing.xl,
    borderTopWidth: 1,
    borderColor: colors.border.default,
    gap: spacing.md,
  },
});
