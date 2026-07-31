import { useRouter } from "expo-router";
import { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HobbyCardImage } from "@/components/hobby-card-image";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, Spacing } from "@/constants/theme";
import {
  acceptHobby,
  generateHobbySuggestion,
  saveHobbyForLater,
  skipHobby,
  type GeneratedSuggestion,
  type GeneratorMode,
} from "@/services";

const MODES: { mode: GeneratorMode; label: string; blurb: string }[] = [
  {
    mode: "might_like",
    label: "Something I Might Like",
    blurb: "A personalized match based on your quiz answers.",
  },
  {
    mode: "left_field",
    label: "Something Out of Left Field",
    blurb: "An unexpected pick that stretches your taste, not your budget.",
  },
  {
    mode: "surprise_me",
    label: "Surprise Me",
    blurb: "A total wildcard from the catalog.",
  },
];

type ScreenState =
  | { kind: "idle" }
  | { kind: "loading"; mode: GeneratorMode }
  | { kind: "result"; mode: GeneratorMode; suggestion: GeneratedSuggestion }
  | { kind: "confirmed"; message: string }
  | { kind: "error"; message: string };

export default function GenerateScreen() {
  const router = useRouter();
  const [state, setState] = useState<ScreenState>({ kind: "idle" });
  const [excludeHobbyIds, setExcludeHobbyIds] = useState<string[]>([]);

  async function runGenerate(mode: GeneratorMode, exclude: string[]) {
    setState({ kind: "loading", mode });
    try {
      const suggestion = await generateHobbySuggestion(mode, exclude);
      setState({ kind: "result", mode, suggestion });
    } catch (e) {
      setState({
        kind: "error",
        message: e instanceof Error ? e.message : "Something went wrong.",
      });
    }
  }

  function handlePickMode(mode: GeneratorMode) {
    setExcludeHobbyIds([]);
    runGenerate(mode, []);
  }

  async function handleAccept() {
    if (state.kind !== "result") return;
    try {
      await acceptHobby(state.suggestion.userHobby.id);
      setState({
        kind: "confirmed",
        message: `${state.suggestion.hobby.name} is now active — check it out on your Home tab.`,
      });
    } catch (e) {
      setState({
        kind: "error",
        message: e instanceof Error ? e.message : "Something went wrong.",
      });
    }
  }

  async function handleSkip() {
    if (state.kind !== "result") return;
    try {
      await skipHobby(state.suggestion.userHobby.id);
      setState({ kind: "idle" });
    } catch (e) {
      setState({
        kind: "error",
        message: e instanceof Error ? e.message : "Something went wrong.",
      });
    }
  }

  async function handleSaveForLater() {
    if (state.kind !== "result") return;
    try {
      await saveHobbyForLater(state.suggestion.userHobby.id);
      setState({
        kind: "confirmed",
        message: `Saved ${state.suggestion.hobby.name} for later.`,
      });
    } catch (e) {
      setState({
        kind: "error",
        message: e instanceof Error ? e.message : "Something went wrong.",
      });
    }
  }

  async function handleGenerateAnother() {
    if (state.kind !== "result") return;
    const { mode, suggestion } = state;
    try {
      await skipHobby(suggestion.userHobby.id);
    } catch (e) {
      setState({
        kind: "error",
        message: e instanceof Error ? e.message : "Something went wrong.",
      });
      return;
    }
    const nextExclude = [...excludeHobbyIds, suggestion.hobby.id];
    setExcludeHobbyIds(nextExclude);
    runGenerate(mode, nextExclude);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: BottomTabInset + Spacing.four },
          ]}>
          <ThemedText type="title" style={styles.heading}>
            Hobby Generator
          </ThemedText>

          {(state.kind === "idle" || state.kind === "error") && (
            <>
              {state.kind === "error" && (
                <ThemedText style={styles.error}>{state.message}</ThemedText>
              )}
              <ThemedText themeColor="textSecondary" style={styles.subheading}>
                Pick a mode to get a suggestion.
              </ThemedText>
              <ThemedView style={styles.modeList}>
                {MODES.map((m) => (
                  <Pressable key={m.mode} onPress={() => handlePickMode(m.mode)}>
                    <ThemedView type="backgroundElement" style={styles.modeCard}>
                      <ThemedText type="smallBold">{m.label}</ThemedText>
                      <ThemedText
                        themeColor="textSecondary"
                        type="small"
                        style={styles.modeBlurb}>
                        {m.blurb}
                      </ThemedText>
                    </ThemedView>
                  </Pressable>
                ))}
              </ThemedView>
            </>
          )}

          {state.kind === "loading" && (
            <ThemedText themeColor="textSecondary" style={styles.subheading}>
              Thinking of something for you...
            </ThemedText>
          )}

          {state.kind === "confirmed" && (
            <ThemedView style={styles.confirmedBox}>
              <ThemedText style={styles.subheading}>{state.message}</ThemedText>
              <Pressable
                style={styles.primaryButton}
                onPress={() => setState({ kind: "idle" })}>
                <ThemedText style={styles.primaryButtonLabel}>
                  Generate another
                </ThemedText>
              </Pressable>
            </ThemedView>
          )}

          {state.kind === "result" && (
            <ThemedView style={styles.resultCard}>
              <ThemedText themeColor="textSecondary" type="small">
                {MODES.find((m) => m.mode === state.mode)?.label}
              </ThemedText>
              <HobbyCardImage hobby={state.suggestion.hobby} />
              <ThemedText style={styles.description}>
                {state.suggestion.hobby.description}
              </ThemedText>

              <ThemedView style={styles.metaRow}>
                <MetaPill
                  label={`${capitalize(state.suggestion.hobby.cost_tier)} cost`}
                />
                <MetaPill
                  label={`$${state.suggestion.hobby.cost_min}-$${state.suggestion.hobby.cost_max}`}
                />
                <MetaPill
                  label={`~${state.suggestion.hobby.time_beginner_hrs_week} hrs/wk`}
                />
                <MetaPill label={capitalize(state.suggestion.hobby.indoor_outdoor)} />
              </ThemedView>

              <ThemedView type="backgroundElement" style={styles.rationaleBox}>
                <ThemedText type="small">{state.suggestion.rationale}</ThemedText>
              </ThemedView>

              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/hobby/[id]",
                    params: { id: state.suggestion.hobby.id },
                  })
                }>
                <ThemedText type="linkPrimary">View full starter guide →</ThemedText>
              </Pressable>

              <ThemedView style={styles.actionsRow}>
                <Pressable style={styles.primaryButton} onPress={handleAccept}>
                  <ThemedText style={styles.primaryButtonLabel}>Accept</ThemedText>
                </Pressable>
                <Pressable style={styles.secondaryButton} onPress={handleSkip}>
                  <ThemedText>Skip</ThemedText>
                </Pressable>
              </ThemedView>
              <ThemedView style={styles.actionsRow}>
                <Pressable style={styles.secondaryButton} onPress={handleGenerateAnother}>
                  <ThemedText>Generate Another</ThemedText>
                </Pressable>
                <Pressable style={styles.secondaryButton} onPress={handleSaveForLater}>
                  <ThemedText>Save for Later</ThemedText>
                </Pressable>
              </ThemedView>
            </ThemedView>
          )}
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

function MetaPill({ label }: { label: string }) {
  return (
    <ThemedView type="backgroundElement" style={styles.pill}>
      <ThemedText type="small">{label}</ThemedText>
    </ThemedView>
  );
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.four,
  },
  scrollContent: {
    paddingTop: Platform.select({ web: Spacing.six, default: Spacing.four }),
  },
  heading: {
    marginBottom: Spacing.three,
  },
  subheading: {
    marginBottom: Spacing.three,
  },
  error: {
    color: "#e0463f",
    marginBottom: Spacing.three,
  },
  modeList: {
    gap: Spacing.two,
  },
  modeCard: {
    padding: Spacing.three,
    borderRadius: 12,
    gap: Spacing.half,
  },
  modeBlurb: {
    marginTop: Spacing.half,
  },
  confirmedBox: {
    gap: Spacing.three,
  },
  resultCard: {
    gap: Spacing.two,
  },
  description: {
    marginTop: Spacing.one,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.one,
    marginTop: Spacing.two,
  },
  pill: {
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.two,
    borderRadius: 999,
  },
  rationaleBox: {
    padding: Spacing.three,
    borderRadius: 12,
    marginTop: Spacing.two,
  },
  actionsRow: {
    flexDirection: "row",
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#3c87f7",
    borderRadius: 8,
    paddingVertical: Spacing.three,
    alignItems: "center",
  },
  primaryButtonLabel: {
    color: "#ffffff",
    fontWeight: "600",
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: Spacing.three,
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#8888",
  },
});
