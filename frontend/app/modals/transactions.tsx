import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { colors, typography } from '@/constants/colors';
import { spacing } from '@/constants/layout';
import { X, CheckCircle } from 'lucide-react-native';

export default function TransactionModal() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transaction</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <X size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.successIcon}>
          <CheckCircle size={64} color={colors.status.success} />
        </View>

        <Text style={styles.successTitle}>Transaction Successful!</Text>
        <Text style={styles.successMessage}>
          Your transaction has been confirmed on the blockchain
        </Text>

        <Card style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction Signature</Text>
            <Text style={styles.detailValue}>abc...xyz</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status</Text>
            <Text style={styles.detailValue}>Confirmed</Text>
          </View>
        </Card>

        <Button
          title="View on Explorer"
          onPress={() => {}}
          variant="outline"
          fullWidth
        />
        <Button
          title="Done"
          onPress={() => router.back()}
          variant="primary"
          fullWidth
          style={styles.doneButton}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIcon: {
    marginBottom: spacing.xl,
  },
  successTitle: {
    ...typography.h2,
    marginBottom: spacing.sm,
  },
  successMessage: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  detailsCard: {
    width: '100%',
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    ...typography.caption,
    color: colors.text.muted,
  },
  detailValue: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  doneButton: {
    marginTop: spacing.sm,
  },
});
