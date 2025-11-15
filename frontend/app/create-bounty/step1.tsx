import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BountyCategory } from '@/types';
import { colors, typography } from '@/constants/colors';
import { spacing } from '@/constants/layout';
import { validateTitle, validateDescription } from '@/utils/validation';
import { ArrowLeft } from 'lucide-react-native';

export default function CreateBountyStep1() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<BountyCategory>(BountyCategory.DEVELOPMENT);
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  const handleNext = () => {
    setTitleError('');
    setDescriptionError('');

    if (!validateTitle(title)) {
      setTitleError('Title must be between 3 and 100 characters');
      return;
    }

    if (!validateDescription(description)) {
      setDescriptionError('Description must be at least 20 characters');
      return;
    }

    router.push({
      pathname: '/create-bounty/step2',
      params: { title, description, category },
    });
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
          <Text style={styles.progress}>Step 1 of 3</Text>
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.title}>Create Bounty</Text>
          <Text style={styles.subtitle}>
            Let's start with the basic details
          </Text>

          <View style={styles.form}>
            <Input
              label="Bounty Title"
              value={title}
              onChangeText={setTitle}
              placeholder="e.g., Design a landing page"
              error={titleError}
            />

            <Input
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Describe the bounty requirements in detail..."
              multiline
              numberOfLines={6}
              error={descriptionError}
            />

            <View style={styles.categorySection}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryButtons}>
                {Object.values(BountyCategory).map((cat) => (
                  <Button
                    key={cat}
                    title={cat.charAt(0).toUpperCase() + cat.slice(1)}
                    onPress={() => setCategory(cat)}
                    variant={category === cat ? 'primary' : 'outline'}
                    style={styles.categoryButton}
                  />
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Next"
            onPress={handleNext}
            variant="primary"
            fullWidth
            disabled={!title || !description}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  progress: {
    ...typography.caption,
    color: colors.text.muted,
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
    gap: spacing.lg,
  },
  categorySection: {
    gap: spacing.md,
  },
  label: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryButton: {
    paddingHorizontal: spacing.lg,
  },
  footer: {
    padding: spacing.xl,
    borderTopWidth: 1,
    borderColor: colors.border.default,
  },
});
