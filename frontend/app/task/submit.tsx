import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useBounty } from '@/contexts/BountyContext';
import { useWallet } from '@/contexts/WalletContext';
import { SubmissionStatus } from '@/types';
import { colors, typography } from '@/constants/colors';
import { spacing } from '@/constants/layout';
import { validateDescription } from '@/utils/validation';
import { ArrowLeft, Upload, X } from 'lucide-react-native';

export default function SubmitWorkScreen() {
  const { bountyId } = useLocalSearchParams<{ bountyId: string }>();
  const { submitWork, getBountyById } = useBounty();
  const { wallet } = useWallet();
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [files, setFiles] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bounty = getBountyById(bountyId || '');

  const handleSubmit = async () => {
    setDescriptionError('');

    if (!validateDescription(description, 50)) {
      setDescriptionError('Description must be at least 50 characters');
      return;
    }

    if (!wallet?.address) {
      return;
    }

    setIsSubmitting(true);
    try {
      await submitWork(bountyId || '', {
        bountyId: bountyId || '',
        hunterAddress: wallet.address,
        description,
        files,
        status: SubmissionStatus.PENDING,
      });

      router.back();
    } catch (error) {
      console.error('Error submitting work:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <Button
            title=""
            onPress={() => router.back()}
            variant="text"
            icon={<ArrowLeft size={24} color={colors.text.primary} />}
          />
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.title}>Submit Work</Text>
          {bounty && (
            <Text style={styles.subtitle}>
              Bounty: {bounty.title}
            </Text>
          )}

          <View style={styles.form}>
            <Input
              label="Submission Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your work and how it fulfills the bounty requirements..."
              multiline
              numberOfLines={8}
              error={descriptionError}
            />

            <View style={styles.fileSection}>
              <Text style={styles.label}>Attachments</Text>
              <Card style={styles.uploadCard}>
                <Upload size={32} color={colors.text.muted} />
                <Text style={styles.uploadText}>
                  Upload files or documents
                </Text>
                <Button
                  title="Choose Files"
                  onPress={() => {}}
                  variant="outline"
                />
              </Card>

              {files.length > 0 && (
                <View style={styles.filesList}>
                  {files.map((file, index) => (
                    <Card key={index} style={styles.fileItem}>
                      <Text style={styles.fileName}>{file.name}</Text>
                      <TouchableOpacity onPress={() => {}}>
                        <X size={20} color={colors.text.muted} />
                      </TouchableOpacity>
                    </Card>
                  ))}
                </View>
              )}
            </View>

            <Card style={styles.infoCard}>
              <Text style={styles.infoText}>
                Make sure your submission clearly demonstrates how you've completed the bounty requirements. Include relevant links, screenshots, or documents.
              </Text>
            </Card>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="outline"
            fullWidth
          />
          <Button
            title="Submit"
            onPress={handleSubmit}
            variant="primary"
            fullWidth
            loading={isSubmitting}
            disabled={!description || description.length < 50}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.xxl,
  },
  form: {
    gap: spacing.xl,
  },
  fileSection: {
    gap: spacing.md,
  },
  label: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  uploadCard: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.md,
    borderStyle: 'dashed',
  },
  uploadText: {
    ...typography.body,
    color: colors.text.muted,
  },
  filesList: {
    gap: spacing.sm,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fileName: {
    ...typography.body,
    color: colors.text.secondary,
  },
  infoCard: {
    backgroundColor: colors.background.secondary,
  },
  infoText: {
    ...typography.caption,
    color: colors.text.muted,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.xl,
    borderTopWidth: 1,
    borderColor: colors.border.default,
    gap: spacing.md,
  },
});
