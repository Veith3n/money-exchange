import { NavigationProp } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Button, StyleSheet } from 'react-native';

import { ThemedText, ThemedTextInput } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { ROUTES } from './_layout';
import { useSession } from './ctx';

interface LoginScreenProps {
  navigation: NavigationProp<any>;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { signIn } = useSession();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signIn(username, password);

      router.push(ROUTES.TABS);
      // navigation.navigate('HomeScreen');
    } catch (error) {
      setErrorMessage(
        'Login failed. Please check your credentials and try again.',
      );
      console.error('Login failed', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedTextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <ThemedTextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errorMessage && (
        <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
      )}
      <Button title="Login" onPress={handleLogin} />
      <ThemedText
        onPress={() => router.push(ROUTES.REGISTER)}
        style={styles.switchText}
      >
        Don't have an account? Register
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
  },
  switchText: {
    color: 'blue',
    marginTop: 12,
    textAlign: 'center',
  },
});
