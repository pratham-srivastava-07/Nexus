  import React from 'react';
  import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    View,
    ViewStyle,
    TextStyle,
  } from 'react-native';
  import { LinearGradient } from 'expo-linear-gradient';
  import { colors, typography } from '@/constants/colors';
  import { spacing, borderRadius } from '@/constants/layout';
  
  interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'gradient' | 'text';
    disabled?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    fullWidth?: boolean;
    style?: ViewStyle;
  }
  
  export function Button({
    title,
    onPress,
    variant = 'primary',
    disabled = false,
    loading = false,
    icon,
    fullWidth = false,
    style,
  }: ButtonProps) {
    const isDisabled = disabled || loading;
  
    const buttonContent = (
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={colors.text.primary} size="small" />
        ) : (
          <>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={[styles.text, getTextStyle(variant)]}>{title}</Text>
          </>
        )}
      </View>
    );
  
    if (variant === 'gradient' && !isDisabled) {
      return (
        <TouchableOpacity
          onPress={onPress}
          disabled={isDisabled}
          style={[styles.button, fullWidth && styles.fullWidth, style]}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.accent.gradient[0], colors.accent.gradient[1]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            {buttonContent}
          </LinearGradient>
        </TouchableOpacity>
      );
    }
  
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        style={[
          styles.button,
          getButtonStyle(variant),
          isDisabled && styles.disabled,
          fullWidth && styles.fullWidth,
          style,
        ]}
        activeOpacity={0.8}
      >
        {buttonContent}
      </TouchableOpacity>
    );
  }
  
  function getButtonStyle(variant: string): ViewStyle {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.accent.primary,
        };
      case 'secondary':
        return {
          backgroundColor: colors.accent.secondary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: colors.accent.primary,
        };
      case 'danger':
        return {
          backgroundColor: colors.status.error,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
        };
      default:
        return {
          backgroundColor: colors.accent.primary,
        };
    }
  }
  
  function getTextStyle(variant: string): TextStyle {
    if (variant === 'outline' || variant === 'text') {
      return { color: colors.accent.primary };
    }
    return {};
  }
  
  const styles = StyleSheet.create({
    button: {
      height: 48,
      borderRadius: borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
    },
    gradient: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: borderRadius.md,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      ...typography.button,
      color: colors.text.primary,
    },
    iconContainer: {
      marginRight: spacing.sm,
    },
    disabled: {
      opacity: 0.5,
    },
    fullWidth: {
      width: '100%',
    },
  });
