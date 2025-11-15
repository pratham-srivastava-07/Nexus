import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { colors, typography } from '@/constants/colors';
import { spacing } from '@/constants/layout';
import { X, Upload } from 'lucide-react-native';

export default function FileUploadModal() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Upload File</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <X size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.uploadArea}>
          <Upload size={48} color={colors.text.muted} />
          <Text style={styles.uploadText}>Choose a file to upload</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Choose from Device"
            onPress={() => {}}
            variant="primary"
            fullWidth
          />
          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="outline"
            fullWidth
          />
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
    justifyContent: 'space-between',
    paddingBottom: spacing.xl,
  },
  uploadArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border.default,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: spacing.xxl,
  },
  uploadText: {
    ...typography.body,
    color: colors.text.muted,
    marginTop: spacing.lg,
  },
  buttonContainer: {
    gap: spacing.md,
  },
});
