import React from 'react';
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
import { colors, typography } from '@/constants/colors';
import { spacing } from '@/constants/layout';
import { formatDate, truncateAddress } from '@/utils/solana';
import { ArrowLeft, User, Calendar } from 'lucide-react-native';

export default function SubmissionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <Card style={styles.mainCard}>
          <View style={styles.headerRow}>
            <View style={styles.hunterInfo}>
              <User size={20} color={colors.text.secondary} />
              <Text style={styles.hunterText}>Hunter Address</Text>
            </View>
            <Badge label="PENDING" variant="warning" />
          </View>

          <Text style={styles.description}>
            Submission description will be displayed here...
          </Text>

          <View style={styles.dateInfo}>
            <Calendar size={16} color={colors.text.muted} />
            <Text style={styles.dateText}>Submitted on {formatDate(new Date())}</Text>
          </View>
        </Card>

        <View style={styles.filesSection}>
          <Text style={styles.sectionTitle}>Attached Files</Text>
          <Card>
            <Text style={styles.noFilesText}>No files attached</Text>
          </Card>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Approve"
          onPress={() => {}}
          variant="primary"
          style={styles.footerButton}
        />
        <Button
          title="Reject"
          onPress={() => {}}
          variant="danger"
          style={styles.footerButton}
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
    padding: spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  mainCard: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  hunterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  hunterText: {
    ...typography.body,
    fontWeight: '600',
  },
  description: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: spacing.lg,
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
  filesSection: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.lg,
  },
  noFilesText: {
    ...typography.body,
    color: colors.text.muted,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.xl,
    borderTopWidth: 1,
    borderColor: colors.border.default,
    gap: spacing.md,
  },
  footerButton: {
    flex: 1,
  },
});
