import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { colors, typography } from '@/constants/colors';
import { spacing } from '@/constants/layout';
import { ArrowLeft, Mail, Key, Globe, Trash2 } from 'lucide-react-native';

export default function SettingsScreen() {
  const handleBackupKeypair = () => {
    Alert.alert(
      'Backup Keypair',
      'This will display your private key. Make sure no one can see your screen.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Show', onPress: () => {} },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <Card onPress={() => {}} style={styles.settingItem}>
            <Mail size={20} color={colors.text.secondary} />
            <Text style={styles.settingText}>Change Email</Text>
          </Card>
          <Card onPress={handleBackupKeypair} style={styles.settingItem}>
            <Key size={20} color={colors.text.secondary} />
            <Text style={styles.settingText}>Backup Keypair</Text>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Network</Text>
          <Card onPress={() => {}} style={styles.settingItem}>
            <Globe size={20} color={colors.text.secondary} />
            <View style={styles.settingContent}>
              <Text style={styles.settingText}>Network</Text>
              <Text style={styles.settingValue}>Devnet</Text>
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <Card onPress={handleDeleteAccount} style={styles.settingItemDanger}>
            <Trash2 size={20} color={colors.status.error} />
            <Text style={styles.settingTextDanger}>Delete Account</Text>
          </Card>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.xl,
  },
  title: {
    ...typography.h2,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  section: {
    marginBottom: spacing.xxl,
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    fontSize: 14,
    color: colors.text.muted,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  settingContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  settingValue: {
    ...typography.caption,
    color: colors.text.muted,
  },
  settingItemDanger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderColor: colors.status.error,
  },
  settingTextDanger: {
    ...typography.body,
    color: colors.status.error,
  },
});
