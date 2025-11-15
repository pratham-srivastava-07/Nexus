import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SubmissionCard } from '@/components/bounty/SubmissionCard';
import { useBounty } from '@/contexts/BountyContext';
import { useWallet } from '@/contexts/WalletContext';
import { colors, typography } from '@/constants/colors';
import { spacing } from '@/constants/layout';
import { formatCurrency, formatDate, getTimeRemaining, truncateAddress } from '@/utils/solana';
import { ArrowLeft, Clock, User, ChevronDown, ChevronUp, Send } from 'lucide-react-native';

export default function BountyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getBountyById, approveBounty } = useBounty();
  const { wallet } = useWallet();
  const [showMetadata, setShowMetadata] = useState(false);

  const bounty = getBountyById(id || '');

  if (!bounty) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Bounty not found</Text>
          <Button title="Go Back" onPress={() => router.back()} variant="primary" />
        </View>
      </SafeAreaView>
    );
  }

  const isCreator = wallet?.address === bounty.creatorAddress;
  const hasSubmissions = bounty.submissions.length > 0;

  const handleSubmitWork = () => {
    router.push({
      pathname: '/task/submit',
      params: { bountyId: bounty.id },
    });
  };

  const handleApproveSubmission = async (submissionId: string) => {
    try {
      await approveBounty(bounty.id, submissionId);
    } catch (error) {
      console.error('Error approving submission:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <Card style={styles.mainCard}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{bounty.title}</Text>
            <Badge label={bounty.status.toUpperCase()} variant="success" />
          </View>

          <Text style={styles.description}>{bounty.description}</Text>

          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Bounty Amount</Text>
            <Text style={styles.amount}>{formatCurrency(bounty.bountyAmount)} SOL</Text>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <User size={16} color={colors.text.muted} />
              <View>
                <Text style={styles.infoLabel}>Creator</Text>
                <Text style={styles.infoValue}>
                  {truncateAddress(bounty.creatorAddress)}
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Clock size={16} color={colors.text.muted} />
              <View>
                <Text style={styles.infoLabel}>Deadline</Text>
                <Text style={styles.infoValue}>
                  {getTimeRemaining(bounty.deadline)}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.metadataToggle}
            onPress={() => setShowMetadata(!showMetadata)}
          >
            <Text style={styles.metadataLabel}>On-Chain Metadata</Text>
            {showMetadata ? (
              <ChevronUp size={20} color={colors.text.secondary} />
            ) : (
              <ChevronDown size={20} color={colors.text.secondary} />
            )}
          </TouchableOpacity>

          {showMetadata && (
            <View style={styles.metadata}>
              <View style={styles.metadataRow}>
                <Text style={styles.metadataKey}>Bounty Mint:</Text>
                <Text style={styles.metadataValue}>
                  {truncateAddress(bounty.bountyMint, 6)}
                </Text>
              </View>
              <View style={styles.metadataRow}>
                <Text style={styles.metadataKey}>Vault Address:</Text>
                <Text style={styles.metadataValue}>
                  {truncateAddress(bounty.vaultAddress, 6)}
                </Text>
              </View>
              <View style={styles.metadataRow}>
                <Text style={styles.metadataKey}>Created:</Text>
                <Text style={styles.metadataValue}>
                  {formatDate(bounty.createdAt)}
                </Text>
              </View>
            </View>
          )}
        </Card>

        {!isCreator && bounty.status === 'open' && (
          <View style={styles.actionsContainer}>
            <Button
              title="Submit Work"
              onPress={handleSubmitWork}
              variant="primary"
              fullWidth
              icon={<Send size={20} color={colors.text.primary} />}
            />
          </View>
        )}

        {hasSubmissions && (
          <View style={styles.submissionsSection}>
            <Text style={styles.sectionTitle}>
              Submissions ({bounty.submissions.length})
            </Text>
            {bounty.submissions.map((submission) => (
              <View key={submission.id} style={styles.submissionItem}>
                <SubmissionCard
                  submission={submission}
                  onPress={() => router.push(`/submission/${submission.id}`)}
                />
                {isCreator && submission.status === 'pending' && (
                  <View style={styles.submissionActions}>
                    <Button
                      title="Approve"
                      onPress={() => handleApproveSubmission(submission.id)}
                      variant="primary"
                      style={styles.submissionButton}
                    />
                    <Button
                      title="Reject"
                      onPress={() => {}}
                      variant="danger"
                      style={styles.submissionButton}
                    />
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
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
    padding: spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  mainCard: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    flex: 1,
    marginRight: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  amountContainer: {
    backgroundColor: colors.background.secondary,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  amountLabel: {
    ...typography.caption,
    color: colors.text.muted,
    marginBottom: spacing.xs,
  },
  amount: {
    ...typography.h1,
    color: colors.accent.primary,
  },
  infoGrid: {
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  infoLabel: {
    ...typography.caption,
    color: colors.text.muted,
  },
  infoValue: {
    ...typography.body,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  metadataToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderColor: colors.border.default,
  },
  metadataLabel: {
    ...typography.body,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  metadata: {
    gap: spacing.md,
    paddingTop: spacing.md,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metadataKey: {
    ...typography.caption,
    color: colors.text.muted,
  },
  metadataValue: {
    ...typography.caption,
    color: colors.text.secondary,
    fontFamily: 'monospace',
  },
  actionsContainer: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  submissionsSection: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.lg,
  },
  submissionItem: {
    marginBottom: spacing.lg,
  },
  submissionActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  submissionButton: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.lg,
  },
  errorText: {
    ...typography.h2,
    color: colors.text.secondary,
  },
});
