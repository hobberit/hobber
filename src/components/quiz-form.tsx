import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { quizSteps } from "@/features/onboarding/quizConfig";
import type { OnboardingAnswers } from "@/services/onboarding";

type Answers = Record<string, string | string[]>;

interface QuizFormProps {
  /** Called with the completed answers once the user finishes the last step. */
  onSubmit: (answers: OnboardingAnswers) => Promise<void>;
  finishLabel?: string;
}

export function QuizForm({ onSubmit, finishLabel = "Finish" }: QuizFormProps) {
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
      const existing = Array.isArray(prev[step.id]) ? (prev[step.id] as string[]) : [];
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

    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(answers as unknown as OnboardingAnswers);
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.progressBlock}>
            <View style={styles.headerRow}>
              {stepIndex > 0 ? (
                <Pressable onPress={handleBack} hitSlop={8}>
                  <SymbolView
                    name={{ ios: "chevron.left", android: "chevron_left", web: "chevron_left" }}
                    size={20}
                    tintColor="#000000"
                  />
                </Pressable>
              ) : (
                <View style={styles.headerSpacer} />
              )}
              <Text style={styles.progressLabel}>
                QUESTION {stepIndex + 1} OF {quizSteps.length}
              </Text>
              <View style={styles.headerSpacer} />
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${((stepIndex + 1) / quizSteps.length) * 100}%` },
                ]}
              />
            </View>
          </View>

          <View style={styles.questionBlock}>
            <Text style={styles.question}>{step.question}</Text>
            {step.helperText && <Text style={styles.helperText}>{step.helperText}</Text>}
          </View>

          <View style={styles.options}>
            {step.options.map((option) => {
              const selected =
                step.type === "multi-select"
                  ? Array.isArray(currentAnswer) && currentAnswer.includes(option.value)
                  : currentAnswer === option.value;

              return (
                <Pressable
                  key={option.value}
                  onPress={() =>
                    step.type === "multi-select"
                      ? toggleMulti(option.value)
                      : selectSingle(option.value)
                  }>
                  <View style={[styles.option, selected && styles.optionSelected]}>
                    {step.type === "multi-select" ? (
                      <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                        {selected && (
                          <SymbolView
                            name={{ ios: "checkmark", android: "check", web: "check" }}
                            size={12}
                            tintColor="#ffffff"
                          />
                        )}
                      </View>
                    ) : (
                      <View style={[styles.radio, selected && styles.radioSelected]}>
                        {selected && <View style={styles.radioDot} />}
                      </View>
                    )}
                    <Text style={styles.optionLabel}>{option.label}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {error && <Text style={styles.error}>{error}</Text>}
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            disabled={!canAdvance || isSubmitting}
            onPress={handleNext}
            style={[styles.nextButton, !canAdvance && styles.nextButtonDisabled]}>
            <Text style={styles.nextButtonLabel}>
              {isSubmitting ? "Saving..." : isLastStep ? finishLabel : "Continue"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  progressBlock: {
    gap: 16,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerSpacer: {
    width: 20,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#888888",
    letterSpacing: 0.26,
    lineHeight: 16,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "#EEEEEE",
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "#000000",
  },
  questionBlock: {
    gap: 8,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 28,
  },
  question: {
    fontSize: 26,
    fontWeight: "700",
    lineHeight: 32,
    letterSpacing: -0.26,
    color: "#000000",
  },
  helperText: {
    fontSize: 15,
    lineHeight: 21,
    color: "#666666",
  },
  options: {
    gap: 12,
    paddingHorizontal: 24,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 18,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
  },
  optionSelected: {
    borderColor: "#000000",
    backgroundColor: "#F7F7F7",
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#CCCCCC",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  radioSelected: {
    borderColor: "#000000",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#000000",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#CCCCCC",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  checkboxSelected: {
    borderColor: "#000000",
    backgroundColor: "#000000",
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 20,
    color: "#000000",
  },
  error: {
    marginTop: 12,
    marginHorizontal: 24,
    fontSize: 14,
    color: "#e0463f",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 16,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  nextButton: {
    height: 54,
    borderRadius: 27,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});
