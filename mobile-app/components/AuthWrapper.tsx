import { Redirect } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { useSession } from '@/app/ctx';

import { ThemedText } from './ThemedText';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { isLoading, session, signOut } = useSession();

  if (isLoading) {
    return <ThemedText>Loading...</ThemedText>;
  }

  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/login" />;
  }

  const logoutTitle = `Logout ${session.email}`;
  return (
    <>
      {children}
      <TouchableOpacity style={styles.button} onPress={signOut}>
        <ThemedText style={styles.buttonText}>{logoutTitle}</ThemedText>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    margin: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AuthWrapper;
