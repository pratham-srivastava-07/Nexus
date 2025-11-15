import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/components/ui/Card';
import { BountyCategory } from '@/types';
import { colors, typography } from '@/constants/colors';
import { spacing } from '@/constants/layout';
import { Code, Palette, Megaphone, FileText, Grid } from 'lucide-react-native';

interface CategoryCardProps {
  category: BountyCategory;
  count: number;
  onPress: () => void;
}

export function CategoryCard({ category, count, onPress }: CategoryCardProps) {
  const getIcon = () => {
    const iconSize = 32;
    const iconColor = colors.accent.primary;

    switch (category) {
      case BountyCategory.DEVELOPMENT:
        return <Code size={iconSize} color={iconColor} />;
      case BountyCategory.DESIGN:
        return <Palette size={iconSize} color={iconColor} />;
      case BountyCategory.MARKETING:
        return <Megaphone size={iconSize} color={iconColor} />;
      case BountyCategory.CONTENT:
        return <FileText size={iconSize} color={iconColor} />;
      default:
        return <Grid size={iconSize} color={iconColor} />;
    }
  };

  const getCategoryLabel = () => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <Card onPress={onPress} variant="elevated" style={styles.card}>
      <View style={styles.iconContainer}>{getIcon()}</View>
      <Text style={styles.label}>{getCategoryLabel()}</Text>
      <Text style={styles.count}>{count} bounties</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  iconContainer: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.h3,
    fontSize: 16,
    marginBottom: spacing.xs,
  },
  count: {
    ...typography.caption,
    color: colors.text.muted,
  },
});
