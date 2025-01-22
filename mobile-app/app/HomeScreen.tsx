import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { Button, StyleSheet } from 'react-native';
import { useSession } from './ctx';
import AuthWrapper from '@/components/AuthWrapper';

export default function HomeScreen() {
  const { signOut, session } = useSession();

  return (
    <AuthWrapper>
      <ThemedView style={styles.container}>
        <ThemedText>Welcome to the Home Screen! session: {session?.email}</ThemedText>
        <Button title="Logout" onPress={signOut} />
      </ThemedView>
    </AuthWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
