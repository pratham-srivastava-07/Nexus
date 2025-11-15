import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { BountyCard } from '@/components/bounty/BountyCard';
import { CategoryCard } from '@/components/bounty/CategoryCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useBounty } from '@/contexts/BountyContext';
import { useWallet } from '@/contexts/WalletContext';
import { useAuth } from '@/contexts/AuthContext';
import { BountyCategory } from '@/types';
import { colors, typography } from '@/constants/colors';
import { spacing } from '@/constants/layout';
import { formatCurrency, truncateAddress } from '@/utils/solana';
import { Plus } from 'lucide-react-native';
import { Buffer } from 'buffer';

// @ts-ignore
global.Buffer = global.Buffer || Buffer;

export default function HomeScreen() {
  const { bounties, isLoading, fetchBounties } = useBounty();
  const { wallet } = useWallet();
  const { user } = useAuth();

  useEffect(() => {
    fetchBounties();
  }, []);

  const featuredBounties = bounties.slice(0, 3);
  const categories = [
    { category: BountyCategory.DESIGN, count: 12 },
    { category: BountyCategory.DEVELOPMENT, count: 24 },
    { category: BountyCategory.MARKETING, count: 8 },
    { category: BountyCategory.CONTENT, count: 15 },
  ];

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading bounties..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back!</Text>
            <Text style={styles.username}>{user?.username || 'Guest'}</Text>
          </View>
          {wallet?.connected && (
            <View style={styles.balanceChip}>
              <Text style={styles.balanceLabel}>Balance</Text>
              <Text style={styles.balanceAmount}>
                {formatCurrency(wallet.balance)} SOL
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nexus Bounties</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {featuredBounties.map((bounty) => (
              <View key={bounty.id} style={styles.featuredCard}>
                <BountyCard bounty={bounty} />
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesGrid}>
            {categories.map(({ category, count }) => (
              <View key={category} style={styles.categoryItem}>
                <CategoryCard
                  category={category}
                  count={count}
                  onPress={() => router.push('/(tabs)/tasks')}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended For You</Text>
          <FlatList
            data={bounties}
            renderItem={({ item }) => (
              <View style={styles.bountyItem}>
                <BountyCard bounty={item} />
              </View>
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No bounties available</Text>
            }
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/create-bounty/step1')}
      >
        <Plus size={24} color={colors.text.primary} />
      </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
  },
  greeting: {
    ...typography.body,
    color: colors.text.secondary,
  },
  username: {
    ...typography.h2,
    marginTop: spacing.xs,
  },
  balanceChip: {
    backgroundColor: colors.background.card,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  balanceLabel: {
    ...typography.caption,
    color: colors.text.muted,
    fontSize: 10,
  },
  balanceAmount: {
    ...typography.body,
    color: colors.accent.primary,
    fontWeight: '700',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  horizontalScroll: {
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  featuredCard: {
    width: 300,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.xl - spacing.sm,
  },
  categoryItem: {
    width: '50%',
    padding: spacing.sm,
  },
  bountyItem: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  emptyText: {
    ...typography.body,
    color: colors.text.muted,
    textAlign: 'center',
    paddingVertical: spacing.xxl,
  },
  fab: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.accent.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
