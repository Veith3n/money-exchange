import React, { useState } from 'react';
import { Button, StyleSheet } from 'react-native';

import { NavigationProp } from '@react-navigation/native';
import { ThemedText, ThemedTextInput } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import CurrencyExchangeApiService from '@/common/api/currency-exchange-api.service';

interface RegisterScreenProps {
  navigation: NavigationProp<any>;
}

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const currencyExchangeApiService = CurrencyExchangeApiService.getInstance();
  const router = useRouter();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      await currencyExchangeApiService.register(email, password);

      router.push('/HomeScreen');
      // navigation.navigate('HomeScreen');
    } catch (error: unknown) {
      setErrorMessage('Registration failed. Please try again.');

      console.error('Registration failed', error.response?.data);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedTextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <ThemedTextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <ThemedTextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      {errorMessage && <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>}

      <Button title="Register" onPress={handleRegister} />

      <ThemedText onPress={() => router.push('/login')} style={styles.switchText}>
        Already have an account? Login
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
