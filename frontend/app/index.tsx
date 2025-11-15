import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Buffer } from 'buffer';

// @ts-ignore
global.Buffer = global.Buffer || Buffer;

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/onboarding');
      }
    }
  }, [isAuthenticated, isLoading]);

  return <LoadingSpinner fullScreen />;
}
