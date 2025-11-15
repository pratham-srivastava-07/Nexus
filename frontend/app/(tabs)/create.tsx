import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { colors, typography } from '@/constants/colors';
import { spacing } from '@/constants/layout';
import { Plus, FileText } from 'lucide-react-native';

export default function CreateScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Create</Text>
          <Text style={styles.subtitle}>
            Choose what you'd like to create
          </Text>
        </View>

        <View style={styles.options}>
          <View style={styles.option}>
            <View style={styles.iconContainer}>
              <Plus size={48} color={colors.accent.primary} />
            </View>
            <Text style={styles.optionTitle}>Create Bounty</Text>
            <Text style={styles.optionDescription}>
              Post a new bounty and find talented contributors
            </Text>
            <Button
              title="Get Started"
              onPress={() => router.push('/create-bounty/step1')}
              variant="primary"
              fullWidth
            />
          </View>

          <View style={styles.option}>
            <View style={styles.iconContainer}>
              <FileText size={48} color={colors.accent.secondary} />
            </View>
            <Text style={styles.optionTitle}>Submit Work</Text>
            <Text style={styles.optionDescription}>
              Browse open bounties and submit your work
            </Text>
            <Button
              title="View Bounties"
              onPress={() => router.push('/(tabs)/tasks')}
              variant="outline"
              fullWidth
            />
          </View>
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
  content: {
    flex: 1,
    padding: spacing.xl,
  },
  header: {
    marginBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
  },
  options: {
    flex: 1,
    gap: spacing.xl,
  },
  option: {
    backgroundColor: colors.background.card,
    padding: spacing.xl,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  iconContainer: {
    marginBottom: spacing.lg,
  },
  optionTitle: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  optionDescription: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
});
