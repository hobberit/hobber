import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedTextInput } from "@/components/themed-text-input";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useAuth } from "@/features/auth/AuthProvider";

export default function SignInScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignIn() {
    setError(null);
    setIsSubmitting(true);
    try {
      await signIn(email.trim(), password);
      // On success, the root layout's Stack.Protected guards react to the
      // new session automatically — no manual navigation needed.
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Welcome back</ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.subtitle}>
        Bored? Just hobber it.
      </ThemedText>

      <ThemedTextInput
        placeholder="Email"
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <ThemedTextInput
        placeholder="Password"
        secureTextEntry
        autoComplete="password"
        value={password}
        onChangeText={setPassword}
      />

      {error && (
        <ThemedText themeColor="text" style={styles.error}>
          {error}
        </ThemedText>
      )}

      <Pressable
        style={styles.button}
        disabled={isSubmitting || !email || !password}
        onPress={handleSignIn}>
        <ThemedText style={styles.buttonLabel}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </ThemedText>
      </Pressable>

      <Link href="/sign-up" style={styles.link}>
        <ThemedText type="link" themeColor="textSecondary">
          Don&apos;t have an account? Sign up
        </ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  subtitle: {
    marginBottom: Spacing.four,
  },
  button: {
    backgroundColor: "#3c87f7",
    borderRadius: 8,
    paddingVertical: Spacing.three,
    alignItems: "center",
    marginTop: Spacing.two,
  },
  buttonLabel: {
    color: "#ffffff",
    fontWeight: "600",
  },
  error: {
    color: "#e0463f",
  },
  link: {
    marginTop: Spacing.four,
    alignSelf: "center",
  },
});
