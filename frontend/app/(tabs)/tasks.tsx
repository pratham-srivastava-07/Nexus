import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { BountyCard } from '@/components/bounty/BountyCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { useBounty } from '@/contexts/BountyContext';
import { BountyStatus } from '@/types';
import { colors, typography } from '@/constants/colors';
import { spacing } from '@/constants/layout';
import { router } from 'expo-router';

export default function TasksScreen() {
  const { bounties, isLoading, fetchBounties } = useBounty();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  const filters = [
    { label: 'All', value: 'all' },
    { label: 'Open', value: BountyStatus.OPEN },
    { label: 'In Progress', value: BountyStatus.IN_PROGRESS },
    { label: 'Submitted', value: BountyStatus.SUBMITTED },
    { label: 'Completed', value: BountyStatus.COMPLETED },
  ];

  const filteredBounties =
    activeFilter === 'all'
      ? bounties
      : bounties.filter((b) => b.status === activeFilter);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBounties();
    setRefreshing(false);
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading tasks..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
      </View>

      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          data={filters}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                activeFilter === item.value && styles.filterChipActive,
              ]}
              onPress={() => setActiveFilter(item.value)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === item.value && styles.filterTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.value}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      <FlatList
        data={filteredBounties}
        renderItem={({ item }) => (
          <View style={styles.bountyItem}>
            <BountyCard bounty={item} />
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tasks found</Text>
            <Button
              title="Create Bounty"
              onPress={() => router.push('/create-bounty/step1')}
              variant="primary"
            />
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    padding: spacing.xl,
  },
  title: {
    ...typography.h1,
  },
  filtersContainer: {
    marginBottom: spacing.lg,
  },
  filtersList: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  filterChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  filterChipActive: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  filterText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  filterTextActive: {
    color: colors.background.primary,
  },
  list: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  bountyItem: {
    marginBottom: spacing.lg,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl * 2,
    gap: spacing.lg,
  },
  emptyText: {
    ...typography.body,
    color: colors.text.muted,
  },
});
