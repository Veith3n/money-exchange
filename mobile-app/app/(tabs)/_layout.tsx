import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import AuthWrapper from '@/components/AuthWrapper';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthWrapper>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
            },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="paperplane.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="wallets"
          options={{
            title: 'Wallets',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="wallet" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="exchange-rate-checker"
          options={{
            title: 'Exchange rate checker',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="currency-exchange" size={28} color={color} />
            ),
          }}
        />
      </Tabs>
    </AuthWrapper>
  );
}
