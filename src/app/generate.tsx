import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Path, Rect } from "react-native-svg";

import { HobbyCardImage } from "@/components/hobby-card-image";
import { BottomTabInset } from "@/constants/theme";
import {
  acceptHobby,
  generateHobbySuggestion,
  saveHobbyForLater,
  skipHobby,
  type GeneratedSuggestion,
  type GeneratorMode,
} from "@/services";

const MODES: {
  mode: GeneratorMode;
  label: string;
  blurb: string;
  icon: (props: { size: number }) => React.ReactNode;
}[] = [
  {
    mode: "might_like",
    label: "Something I Might Like",
    blurb: "A personalized match based on your quiz answers.",
    icon: ({ size }) => (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 21s-7.5-4.6-10-9.3C.5 8 2.3 4.5 6 4c2.2-.3 4.2.9 6 3 1.8-2.1 3.8-3.3 6-3 3.7.5 5.5 4 4 7.7-2.5 4.7-10 9.3-10 9.3z"
          fill="#ffffff"
        />
      </Svg>
    ),
  },
  {
    mode: "left_field",
    label: "Something Out of Left Field",
    blurb: "An unexpected pick that stretches your taste, not your budget.",
    icon: ({ size }) => (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="9" stroke="#ffffff" strokeWidth={1.6} />
        <Path d="M15.5 8.5l-2 5-5 2 2-5z" fill="#ffffff" />
      </Svg>
    ),
  },
  {
    mode: "surprise_me",
    label: "Surprise Me",
    blurb: "A total wildcard from the catalog.",
    icon: ({ size }) => (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect x="4" y="4" width="16" height="16" rx="4" stroke="#ffffff" strokeWidth={1.6} />
        <Circle cx="8.5" cy="8.5" r="1.3" fill="#ffffff" />
        <Circle cx="15.5" cy="8.5" r="1.3" fill="#ffffff" />
        <Circle cx="12" cy="12" r="1.3" fill="#ffffff" />
        <Circle cx="8.5" cy="15.5" r="1.3" fill="#ffffff" />
        <Circle cx="15.5" cy="15.5" r="1.3" fill="#ffffff" />
      </Svg>
    ),
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: BottomTabInset + 24 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <SymbolView
              name={{ ios: "chevron.left", android: "chevron_left", web: "chevron_left" }}
              size={20}
              tintColor="#000000"
            />
          </Pressable>
          <Text style={styles.title}>Generate</Text>
          {(state.kind === "idle" || state.kind === "error") && (
            <Text style={styles.subtitle}>
              Pick a mode to get a personalized hobby suggestion.
            </Text>
          )}
          {state.kind === "loading" && (
            <Text style={styles.subtitle}>Thinking of something for you...</Text>
          )}
        </View>

        {(state.kind === "idle" || state.kind === "error") && (
          <>
            {state.kind === "error" && <Text style={styles.error}>{state.message}</Text>}

            <View style={styles.modeList}>
              {MODES.map((m) => (
                <Pressable key={m.mode} onPress={() => handlePickMode(m.mode)}>
                  <View style={styles.modeCard}>
                    <View style={styles.modeIcon}>{m.icon({ size: 20 })}</View>
                    <View style={styles.modeText}>
                      <Text style={styles.modeLabel}>{m.label}</Text>
                      <Text style={styles.modeBlurb}>{m.blurb}</Text>
                    </View>
                    <SymbolView
                      name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" }}
                      size={14}
                      tintColor="#CCCCCC"
                    />
                  </View>
                </Pressable>
              ))}
            </View>

            <Pressable onPress={() => router.push("/retake-quiz")} style={styles.retakeQuizLink}>
              <Text style={styles.retakeQuizTitle}>Retake the quiz</Text>
              <Text style={styles.retakeQuizBlurb}>
                Updates your interests, budget, and time so future suggestions fit better.
              </Text>
            </Pressable>
          </>
        )}

        {state.kind === "confirmed" && (
          <View style={styles.confirmedBox}>
            <Text style={styles.subtitle}>{state.message}</Text>
            <Pressable style={styles.primaryButton} onPress={() => setState({ kind: "idle" })}>
              <Text style={styles.primaryButtonLabel}>Generate another</Text>
            </Pressable>
          </View>
        )}

        {state.kind === "result" && (
          <View style={styles.resultCard}>
            <Text style={styles.resultModeLabel}>
              {MODES.find((m) => m.mode === state.mode)?.label}
            </Text>
            <HobbyCardImage hobby={state.suggestion.hobby} />
            <Text style={styles.description}>{state.suggestion.hobby.description}</Text>

            <View style={styles.metaRow}>
              <MetaPill label={`${capitalize(state.suggestion.hobby.cost_tier)} cost`} />
              <MetaPill
                label={`$${state.suggestion.hobby.cost_min}-$${state.suggestion.hobby.cost_max}`}
              />
              <MetaPill label={`~${state.suggestion.hobby.time_beginner_hrs_week} hrs/wk`} />
              <MetaPill label={capitalize(state.suggestion.hobby.indoor_outdoor)} />
            </View>

            <View style={styles.rationaleBox}>
              <Text style={styles.rationaleText}>{state.suggestion.rationale}</Text>
            </View>

            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/hobby/[id]",
                  params: { id: state.suggestion.hobby.id },
                })
              }>
              <Text style={styles.starterGuideLink}>View full starter guide →</Text>
            </Pressable>

            <View style={styles.actionsRow}>
              <Pressable style={styles.primaryButton} onPress={handleAccept}>
                <Text style={styles.primaryButtonLabel}>Accept</Text>
              </Pressable>
              <Pressable style={styles.secondaryButton} onPress={handleSkip}>
                <Text style={styles.secondaryButtonLabel}>Skip</Text>
              </Pressable>
            </View>
            <View style={styles.actionsRow}>
              <Pressable style={styles.secondaryButton} onPress={handleGenerateAnother}>
                <Text style={styles.secondaryButtonLabel}>Generate Another</Text>
              </Pressable>
              <Pressable style={styles.secondaryButton} onPress={handleSaveForLater}>
                <Text style={styles.secondaryButtonLabel}>Save for Later</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function MetaPill({ label }: { label: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillLabel}>{label}</Text>
    </View>
  );
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    gap: 8,
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: -0.32,
    lineHeight: 40,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#666666",
    lineHeight: 21,
  },
  error: {
    marginHorizontal: 24,
    marginBottom: 16,
    fontSize: 14,
    color: "#e0463f",
  },
  modeList: {
    gap: 12,
    paddingHorizontal: 24,
  },
  modeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 16,
  },
  modeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  modeText: {
    flex: 1,
    gap: 3,
  },
  modeLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    lineHeight: 20,
  },
  modeBlurb: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666666",
    lineHeight: 16,
  },
  retakeQuizLink: {
    gap: 4,
    marginHorizontal: 24,
    marginTop: 28,
    marginBottom: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  retakeQuizTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000000",
    lineHeight: 18,
  },
  retakeQuizBlurb: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666666",
    lineHeight: 16,
  },
  confirmedBox: {
    gap: 16,
    paddingHorizontal: 24,
  },
  resultCard: {
    gap: 8,
    paddingHorizontal: 24,
  },
  resultModeLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666666",
  },
  description: {
    marginTop: 4,
    fontSize: 15,
    lineHeight: 21,
    color: "#000000",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#F0F0F3",
  },
  pillLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000000",
  },
  rationaleBox: {
    padding: 16,
    borderRadius: 14,
    marginTop: 8,
    backgroundColor: "#F0F0F3",
  },
  rationaleText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#000000",
  },
  starterGuideLink: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#000000",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryButtonLabel: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
  },
  secondaryButtonLabel: {
    color: "#000000",
    fontWeight: "600",
    fontSize: 15,
  },
});
