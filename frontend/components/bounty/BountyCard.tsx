import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Bounty } from '@/types';
import { colors, typography } from '@/constants/colors';
import { spacing } from '@/constants/layout';
import { truncateAddress } from '@/utils/solana';
import { getTimeRemaining, formatCurrency } from '@/utils/validation';
import { Clock, User } from 'lucide-react-native';

interface BountyCardProps {
  bounty: Bounty;
}

export function BountyCard({ bounty }: BountyCardProps) {
  const handlePress = () => {
    router.push(`/bounty/${bounty.id}`);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'open':
        return 'success';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'warning';
    }
  };

  return (
    <Card onPress={handlePress} variant="elevated">
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {bounty.title}
        </Text>
        <Badge label={bounty.category} variant="default" />
      </View>

      <Text style={styles.description} numberOfLines={3}>
        {bounty.description}
      </Text>

      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>Bounty</Text>
        <Text style={styles.amount}>
          {formatCurrency(bounty.bountyAmount)} SOL
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.creatorInfo}>
          <User size={14} color={colors.text.muted} />
          <Text style={styles.creatorText}>
            {truncateAddress(bounty.creatorAddress)}
          </Text>
        </View>

        <View style={styles.deadlineInfo}>
          <Clock size={14} color={colors.text.muted} />
          <Text style={styles.deadlineText}>
            {getTimeRemaining(bounty.deadline)}
          </Text>
        </View>
      </View>

      <View style={styles.statusContainer}>
        <Badge label={bounty.status.toUpperCase()} variant={getStatusVariant(bounty.status)} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
    flex: 1,
    marginRight: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  amountContainer: {
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.lg,
  },
  amountLabel: {
    ...typography.caption,
    color: colors.text.muted,
    marginBottom: spacing.xs,
  },
  amount: {
    ...typography.h2,
    color: colors.accent.primary,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  creatorText: {
    ...typography.caption,
    color: colors.text.muted,
  },
  deadlineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  deadlineText: {
    ...typography.caption,
    color: colors.text.muted,
  },
  statusContainer: {
    alignItems: 'flex-start',
  },
});
