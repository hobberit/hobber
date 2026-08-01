import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { ThemedView } from '@/components/themed-view';
import { AuthProvider, useAuth } from '@/features/auth/AuthProvider';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { session, profile, isLoading } = useAuth();

  // Keep the background themed (rather than returning null) so there's no
  // flash of blank content if this outlasts the splash overlay's animation.
  if (isLoading) return <ThemedView style={{ flex: 1 }} />;

  const isSignedIn = !!session;
  const isOnboarded = !!profile?.onboarding_completed_at;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={isSignedIn && !isOnboarded}>
        <Stack.Screen name="(onboarding)" />
      </Stack.Protected>
      <Stack.Protected guard={isSignedIn && isOnboarded}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="generate" options={{ headerShown: false }} />
        <Stack.Screen
          name="hobby/[id]"
          options={{ headerShown: true, title: "Hobby Guide" }}
        />
        <Stack.Screen
          name="tracker/[userHobbyId]/index"
          options={{ headerShown: true, title: "Progress" }}
        />
        <Stack.Screen
          name="tracker/[userHobbyId]/log-activity"
          options={{ headerShown: true, title: "Log An Activity" }}
        />
        <Stack.Screen
          name="retake-quiz"
          options={{ headerShown: true, title: "Retake Quiz" }}
        />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}
