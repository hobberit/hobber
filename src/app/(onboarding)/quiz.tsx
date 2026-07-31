import { useState } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useAuth } from "@/features/auth/AuthProvider";
import { quizSteps } from "@/features/onboarding/quizConfig";
import { completeOnboarding, type OnboardingAnswers } from "@/services/onboarding";

type Answers = Record<string, string | string[]>;

export default function QuizScreen() {
  const { session, refreshProfile } = useAuth();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const step = quizSteps[stepIndex];
  const isLastStep = stepIndex === quizSteps.length - 1;
  const currentAnswer = answers[step.id];

  const canAdvance =
    step.type === "multi-select"
      ? true
      : typeof currentAnswer === "string" && currentAnswer.length > 0;

  function selectSingle(value: string) {
    setAnswers((prev) => ({ ...prev, [step.id]: value }));
  }

  function toggleMulti(value: string) {
    setAnswers((prev) => {
      const existing = Array.isArray(prev[step.id])
        ? (prev[step.id] as string[])
        : [];
      const next = existing.includes(value)
        ? existing.filter((v) => v !== value)
        : [...existing, value];
      return { ...prev, [step.id]: next };
    });
  }

  async function handleNext() {
    if (!isLastStep) {
      setStepIndex((i) => i + 1);
      return;
    }
    if (!session?.user) return;

    setError(null);
    setIsSubmitting(true);
    try {
      await completeOnboarding(session.user.id, answers as unknown as OnboardingAnswers);
      await refreshProfile();
      // Root layout's Stack.Protected guards react to the updated profile
      // (onboarding_completed_at) automatically and route into (tabs).
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleBack() {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <ThemedText themeColor="textSecondary" style={styles.progress}>
            Step {stepIndex + 1} of {quizSteps.length}
          </ThemedText>

          <ThemedText type="subtitle" style={styles.question}>
            {step.question}
          </ThemedText>
          {step.helperText && (
            <ThemedText themeColor="textSecondary" style={styles.helperText}>
              {step.helperText}
            </ThemedText>
          )}

          <ThemedView style={styles.options}>
            {step.options.map((option) => {
              const selected =
                step.type === "multi-select"
                  ? Array.isArray(currentAnswer) &&
                    currentAnswer.includes(option.value)
                  : currentAnswer === option.value;

              return (
                <Pressable
                  key={option.value}
                  onPress={() =>
                    step.type === "multi-select"
                      ? toggleMulti(option.value)
                      : selectSingle(option.value)
                  }>
                  <ThemedView
                    type={selected ? "backgroundSelected" : "backgroundElement"}
                    style={styles.option}>
                    <ThemedText>{option.label}</ThemedText>
                  </ThemedView>
                </Pressable>
              );
            })}
          </ThemedView>
        </ScrollView>

        {error && <ThemedText style={styles.error}>{error}</ThemedText>}

        <ThemedView style={styles.footer}>
          {stepIndex > 0 && (
            <Pressable onPress={handleBack} style={styles.backButton}>
              <ThemedText themeColor="textSecondary">Back</ThemedText>
            </Pressable>
          )}
          <Pressable
            disabled={!canAdvance || isSubmitting}
            onPress={handleNext}
            style={[styles.nextButton, !canAdvance && styles.nextButtonDisabled]}>
            <ThemedText style={styles.nextButtonLabel}>
              {isSubmitting ? "Saving..." : isLastStep ? "Finish" : "Next"}
            </ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.four,
  },
  scrollContent: {
    paddingTop: Spacing.four,
    paddingBottom: Spacing.three,
  },
  progress: {
    marginBottom: Spacing.three,
  },
  question: {
    marginBottom: Spacing.one,
  },
  helperText: {
    marginBottom: Spacing.three,
  },
  options: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  option: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: 8,
  },
  error: {
    color: "#e0463f",
    marginTop: Spacing.three,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Spacing.two,
    marginBottom: Spacing.four,
    gap: Spacing.three,
  },
  backButton: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
  },
  nextButton: {
    flex: 1,
    backgroundColor: "#3c87f7",
    borderRadius: 8,
    paddingVertical: Spacing.three,
    alignItems: "center",
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonLabel: {
    color: "#ffffff",
    fontWeight: "600",
  },
});
