import { DarkTheme, DefaultTheme, router, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SymbolView } from 'expo-symbols';
import { Platform, Pressable, StyleSheet, useColorScheme, View } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { ThemedView } from '@/components/themed-view';
import { AuthProvider, useAuth } from '@/features/auth/AuthProvider';

function HeaderBackButton() {
  return (
    <Pressable
      onPress={() => (router.canGoBack() ? router.back() : router.push('/(tabs)/tracker'))}
      hitSlop={8}
      style={{ paddingRight: 12 }}>
      <SymbolView
        name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
        size={20}
        tintColor="#000000"
      />
    </Pressable>
  );
}

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
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="tracker/[userHobbyId]/index"
          options={{ headerShown: true, title: "Progress", headerLeft: () => <HeaderBackButton /> }}
        />
        <Stack.Screen
          name="tracker/[userHobbyId]/log-activity"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="tracker/[userHobbyId]/activity/[logId]"
          options={{ headerShown: false }}
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
  const content = (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </ThemeProvider>
  );

  if (Platform.OS !== 'web') return content;

  // On web, letterbox the app into a fixed phone-width frame instead of
  // stretching the mobile-only layouts across the full browser window.
  return (
    <View style={webStyles.letterbox}>
      <View style={webStyles.frame}>{content}</View>
    </View>
  );
}

const webStyles = StyleSheet.create({
  letterbox: {
    flex: 1,
    minHeight: '100vh' as unknown as number,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E5E5E8',
  },
  frame: {
    width: 430,
    maxWidth: '100%',
    height: '100vh' as unknown as number,
    maxHeight: 932,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    boxShadow: '0 0 0 1px rgba(0,0,0,0.06), 0 20px 60px rgba(0,0,0,0.18)',
  },
});
