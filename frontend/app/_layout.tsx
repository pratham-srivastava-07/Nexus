import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/contexts/AuthContext';
import { WalletProvider } from '@/contexts/WalletContext';
import { BountyProvider } from '@/contexts/BountyContext';
import 'react-native-url-polyfill/auto';
import { Buffer } from 'buffer';

// @ts-ignore
global.Buffer = global.Buffer || Buffer;

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <WalletProvider>
        <BountyProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="bounty/[id]" />
            <Stack.Screen name="task/[id]" />
            <Stack.Screen name="task/submit" />
            <Stack.Screen name="submission/[id]" />
            <Stack.Screen name="create-bounty" />
            <Stack.Screen name="settings" />
            <Stack.Screen
              name="modals/transaction"
              options={{ presentation: 'modal' }}
            />
            <Stack.Screen
              name="modals/wallet-selector"
              options={{ presentation: 'modal' }}
            />
            <Stack.Screen
              name="modals/file-upload"
              options={{ presentation: 'modal' }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="light" />
        </BountyProvider>
      </WalletProvider>
    </AuthProvider>
  );
}
