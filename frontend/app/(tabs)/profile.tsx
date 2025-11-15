import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { colors, typography } from '@/constants/colors';
import { spacing } from '@/constants/layout';
import { truncateAddress } from '@/utils/solana';
import { User, Award, Briefcase, DollarSign, Settings, LogOut } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { wallet } = useWallet();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/onboarding');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const stats = [
    { label: 'Bounties Created', value: '0', icon: Briefcase },
    { label: 'Total Earnings', value: '0 SOL', icon: DollarSign },
    { label: 'Completion Rate', value: '0%', icon: Award },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <Card style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User size={48} color={colors.text.primary} />
            </View>
          </View>

          <Text style={styles.username}>{user?.username || 'Guest'}</Text>
          {wallet?.connected && (
            <Text style={styles.address}>
              {truncateAddress(wallet.address, 6)}
            </Text>
          )}

          <View style={styles.reputationContainer}>
            <Text style={styles.reputationLabel}>Reputation Score</Text>
            <Text style={styles.reputationScore}>
              {user?.reputationScore || 0}
            </Text>
          </View>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} style={styles.statCard}>
                  <IconComponent size={24} color={colors.accent.primary} />
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </Card>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Badges</Text>
          <Card>
            <View style={styles.badgesContainer}>
              <Badge label="Early Adopter" variant="success" />
              <Badge label="Verified" variant="info" />
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <Button
            title="My Bounties"
            onPress={() => router.push('/(tabs)/tasks')}
            variant="outline"
            fullWidth
            icon={<Briefcase size={20} color={colors.accent.primary} />}
          />
          <Button
            title="Settings"
            onPress={() => router.push('/settings')}
            variant="outline"
            fullWidth
            icon={<Settings size={20} color={colors.accent.primary} />}
            style={styles.actionButton}
          />
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="danger"
            fullWidth
            icon={<LogOut size={20} color={colors.text.primary} />}
            style={styles.actionButton}
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
    padding: spacing.xl,
  },
  title: {
    ...typography.h1,
  },
  profileCard: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.accent.primary,
  },
  username: {
    ...typography.h2,
    marginBottom: spacing.xs,
  },
  address: {
    ...typography.caption,
    color: colors.text.muted,
    marginBottom: spacing.lg,
  },
  reputationContainer: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderColor: colors.border.default,
    width: '100%',
  },
  reputationLabel: {
    ...typography.caption,
    color: colors.text.muted,
    marginBottom: spacing.xs,
  },
  reputationScore: {
    ...typography.h1,
    color: colors.accent.primary,
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
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  statValue: {
    ...typography.h3,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.muted,
    textAlign: 'center',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionButton: {
    marginTop: spacing.sm,
  },
});
