import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/ui/Button';
import { colors, typography } from '@/constants/colors';
import { spacing } from '@/constants/layout';
import { Rocket, Zap, Shield } from 'lucide-react-native';

export default function OnboardingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.background.primary, colors.background.secondary]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.heroSection}>
            <View style={styles.iconContainer}>
              <Rocket size={64} color={colors.accent.primary} />
            </View>
            <Text style={styles.title}>Nexus</Text>
            <Text style={styles.subtitle}>
              Decentralized marketplace for bounties on Solana
            </Text>
          </View>

          <View style={styles.featuresSection}>
            <View style={styles.feature}>
              <Zap size={24} color={colors.accent.primary} />
              <Text style={styles.featureText}>Fast & Secure</Text>
            </View>
            <View style={styles.feature}>
              <Shield size={24} color={colors.accent.primary} />
              <Text style={styles.featureText}>Trustless Escrow</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Login"
              onPress={() => router.push('/(auth)/login')}
              variant="primary"
              fullWidth
            />
            <Button
              title="Continue with Wallet"
              onPress={() => router.push('/modals/wallet-selector')}
              variant="gradient"
              fullWidth
              style={styles.walletButton}
            />
            <Button
              title="Learn How It Works"
              onPress={() => {}}
              variant="text"
              fullWidth
            />
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'space-between',
    paddingVertical: spacing.xxl * 2,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: spacing.xxl * 2,
  },
  iconContainer: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    fontSize: 48,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    fontSize: 18,
    textAlign: 'center',
    color: colors.text.secondary,
    maxWidth: 300,
  },
  featuresSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.xxl,
  },
  feature: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  buttonContainer: {
    gap: spacing.lg,
  },
  walletButton: {
    marginTop: spacing.sm,
  },
});
