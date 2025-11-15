import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography } from '@/constants/colors';
import { spacing, borderRadius } from '@/constants/layout';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'error' | 'warning' | 'info' | 'default';
  style?: ViewStyle;
}

export function Badge({ label, variant = 'default', style }: BadgeProps) {
  return (
    <View style={[styles.badge, getBadgeStyle(variant), style]}>
      <Text style={[styles.text, getTextStyle(variant)]}>{label}</Text>
    </View>
  );
}

function getBadgeStyle(variant: string): ViewStyle {
  switch (variant) {
    case 'success':
      return { backgroundColor: `${colors.status.success}20`, borderColor: colors.status.success };
    case 'error':
      return { backgroundColor: `${colors.status.error}20`, borderColor: colors.status.error };
    case 'warning':
      return { backgroundColor: `${colors.status.warning}20`, borderColor: colors.status.warning };
    case 'info':
      return { backgroundColor: `${colors.status.info}20`, borderColor: colors.status.info };
    default:
      return { backgroundColor: `${colors.accent.primary}20`, borderColor: colors.accent.primary };
  }
}

function getTextStyle(variant: string) {
  switch (variant) {
    case 'success':
      return { color: colors.status.success };
    case 'error':
      return { color: colors.status.error };
    case 'warning':
      return { color: colors.status.warning };
    case 'info':
      return { color: colors.status.info };
    default:
      return { color: colors.accent.primary };
  }
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '600',
  },
});
