import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Submission } from '@/types';
import { colors, typography } from '@/constants/colors';
import { spacing } from '@/constants/layout';
import { truncateAddress } from '@/utils/solana';
import { formatDate } from '@/utils/validation';
import { User, Calendar, Paperclip } from 'lucide-react-native';

interface SubmissionCardProps {
  submission: Submission;
  onPress: () => void;
}

export function SubmissionCard({ submission, onPress }: SubmissionCardProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <Card onPress={onPress} variant="elevated">
      <View style={styles.header}>
        <View style={styles.hunterInfo}>
          <User size={16} color={colors.text.secondary} />
          <Text style={styles.hunterText}>
            {truncateAddress(submission.hunterAddress)}
          </Text>
        </View>
        <Badge
          label={submission.status.toUpperCase()}
          variant={getStatusVariant(submission.status)}
        />
      </View>

      <Text style={styles.description} numberOfLines={3}>
        {submission.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.dateInfo}>
          <Calendar size={14} color={colors.text.muted} />
          <Text style={styles.dateText}>
            {formatDate(submission.submittedAt)}
          </Text>
        </View>

        {submission.files.length > 0 && (
          <View style={styles.filesInfo}>
            <Paperclip size={14} color={colors.text.muted} />
            <Text style={styles.filesText}>
              {submission.files.length} file{submission.files.length > 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  hunterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  hunterText: {
    ...typography.body,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  description: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dateText: {
    ...typography.caption,
    color: colors.text.muted,
  },
  filesInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  filesText: {
    ...typography.caption,
    color: colors.text.muted,
  },
});
