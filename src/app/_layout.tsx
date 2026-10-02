import { Figtree_400Regular, Figtree_500Medium, Figtree_600SemiBold } from '@expo-google-fonts/figtree';
import { JosefinSans_300Light, JosefinSans_400Regular, JosefinSans_600SemiBold } from '@expo-google-fonts/josefin-sans';
import { useFonts } from 'expo-font';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { MyPlantsProvider } from '@/lib/my-plants';
import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    JosefinSans_300Light,
    JosefinSans_400Regular,
    JosefinSans_600SemiBold,
    Figtree_400Regular,
    Figtree_500Medium,
    Figtree_600SemiBold,
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <MyPlantsProvider>
      <StatusBar style="auto" />
      <NativeTabs tintColor={colors.pine} backgroundColor={colors.paper}>
        <NativeTabs.Trigger name="index">
          <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" />
          <NativeTabs.Trigger.Label>Greenhouse</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="plants">
          <NativeTabs.Trigger.Icon sf={{ default: 'leaf', selected: 'leaf.fill' }} md="potted_plant" />
          <NativeTabs.Trigger.Label>My Plants</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </MyPlantsProvider>
  );
}
