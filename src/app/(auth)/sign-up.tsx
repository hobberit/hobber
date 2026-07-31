import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedTextInput } from "@/components/themed-text-input";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useAuth } from "@/features/auth/AuthProvider";

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignUp() {
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setIsSubmitting(true);
    try {
      const { needsEmailConfirmation } = await signUp(email.trim(), password);
      if (needsEmailConfirmation) setConfirmationSent(true);
      // Otherwise the root layout's Stack.Protected guards pick up the new
      // session automatically and route into onboarding.
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (confirmationSent) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title">Check your email</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.subtitle}>
          We sent a confirmation link to {email}. Follow it to finish setting
          up your account.
        </ThemedText>
        <Link href="/sign-in" style={styles.link}>
          <ThemedText type="link" themeColor="textSecondary">
            Back to sign in
          </ThemedText>
        </Link>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Get started</ThemedText>
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
        autoComplete="new-password"
        value={password}
        onChangeText={setPassword}
      />
      <ThemedTextInput
        placeholder="Confirm password"
        secureTextEntry
        autoComplete="new-password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {error && (
        <ThemedText themeColor="text" style={styles.error}>
          {error}
        </ThemedText>
      )}

      <Pressable
        style={styles.button}
        disabled={isSubmitting || !email || !password || !confirmPassword}
        onPress={handleSignUp}>
        <ThemedText style={styles.buttonLabel}>
          {isSubmitting ? "Creating account..." : "Sign up"}
        </ThemedText>
      </Pressable>

      <Link href="/sign-in" style={styles.link}>
        <ThemedText type="link" themeColor="textSecondary">
          Already have an account? Sign in
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
