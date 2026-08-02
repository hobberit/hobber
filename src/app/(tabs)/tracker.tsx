import { useFocusEffect, useRouter } from "expo-router";
import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import { useCallback, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HobbyCardImage } from "@/components/hobby-card-image";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, Spacing } from "@/constants/theme";
import { useAuth } from "@/features/auth/AuthProvider";
import { useTheme } from "@/hooks/use-theme";
import { listActiveHobbies, listFinishedHobbies, withProgressSummary, type ActiveHobbyProgress } from "@/services";

type ScreenState =
  | { kind: "loading" }
  | {
      kind: "loaded";
      activeHobbies: ActiveHobbyProgress[];
      finishedHobbies: ActiveHobbyProgress[];
    }
  | { kind: "error"; message: string };

function progressCaption(h: ActiveHobbyProgress): string {
  const sessions = `${h.sessionsLogged} session${h.sessionsLogged === 1 ? "" : "s"} logged`;
  if (h.milestonesTotal === 0) return sessions;
  const milestones = `${h.milestonesAchieved} Milestone${h.milestonesAchieved === 1 ? "" : "s"} Reached`;
  return `${milestones} · ${sessions}`;
}

export default function TrackerScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const theme = useTheme();
  const [state, setState] = useState<ScreenState>({ kind: "loading" });

  const load = useCallback(async () => {
    if (!session?.user) return;
    const userId = session.user.id;

    try {
      const [active, finished] = await Promise.all([
        listActiveHobbies(userId),
        listFinishedHobbies(userId),
      ]);
      const [activeHobbies, finishedHobbies] = await Promise.all([
        withProgressSummary(active),
        withProgressSummary(finished),
      ]);
      setState({ kind: "loaded", activeHobbies, finishedHobbies });
    } catch (e) {
      setState({
        kind: "error",
        message: e instanceof Error ? e.message : "Something went wrong.",
      });
    }
  }, [session?.user]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: BottomTabInset + Spacing.four },
          ]}
          showsVerticalScrollIndicator={false}>
          <ThemedView style={styles.headerRow}>
            <ThemedText type="title" style={styles.title}>
              My Hobbies
            </ThemedText>
            <Pressable
              onPress={() => router.push("/generate")}
              hitSlop={8}
              accessibilityLabel="Generate a new hobby">
              <ThemedView type="backgroundElement" style={styles.addButton}>
                <SymbolView
                  name={{ ios: "plus", android: "add", web: "add" }}
                  size={18}
                  tintColor={theme.text}
                />
              </ThemedView>
            </Pressable>
          </ThemedView>

          {state.kind === "loading" && (
            <ThemedText themeColor="textSecondary" style={styles.sectionTitle}>
              Loading...
            </ThemedText>
          )}

          {state.kind === "error" && (
            <ThemedText style={styles.error}>{state.message}</ThemedText>
          )}

          {state.kind === "loaded" && (
            <ThemedView>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Current Hobbies
              </ThemedText>
              {state.activeHobbies.length === 0 ? (
                <ThemedText themeColor="textSecondary">
                  Nothing active yet — tap the + above to generate a suggestion
                  and start tracking it here.
                </ThemedText>
              ) : (
                <ThemedView style={styles.list}>
                  {state.activeHobbies.map((activeHobby) => (
                    <Pressable
                      key={activeHobby.userHobby.id}
                      onPress={() =>
                        router.push({
                          pathname: "/tracker/[userHobbyId]",
                          params: { userHobbyId: activeHobby.userHobby.id },
                        })
                      }>
                      <ThemedView type="backgroundElement" style={styles.imageCard}>
                        <HobbyCardImage hobby={activeHobby.hobby} height={88} />
                        <ThemedView style={styles.imageCardBody}>
                          <ThemedText themeColor="textSecondary" type="small">
                            {progressCaption(activeHobby)}
                          </ThemedText>
                        </ThemedView>
                      </ThemedView>
                    </Pressable>
                  ))}
                </ThemedView>
              )}
            </ThemedView>
          )}

          {state.kind === "loaded" && state.finishedHobbies.length > 0 && (
            <ThemedView style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Finished Hobbies
              </ThemedText>
              <ThemedView style={styles.list}>
                {state.finishedHobbies.map(({ userHobby, hobby }) => (
                  <Pressable
                    key={userHobby.id}
                    onPress={() =>
                      router.push({
                        pathname: "/tracker/[userHobbyId]",
                        params: { userHobbyId: userHobby.id },
                      })
                    }>
                    <ThemedView type="backgroundElement" style={styles.finishedRow}>
                      {hobby.image_url ? (
                        <Image source={{ uri: hobby.image_url }} style={styles.finishedThumb} />
                      ) : (
                        <ThemedView type="backgroundSelected" style={styles.finishedThumb} />
                      )}
                      <ThemedView style={styles.finishedText}>
                        <ThemedText type="smallBold">{hobby.name}</ThemedText>
                        <ThemedText themeColor="textSecondary" type="small">
                          Date Finished: {new Date(userHobby.updated_at).toLocaleDateString()}
                        </ThemedText>
                      </ThemedView>
                      <SymbolView
                        name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" }}
                        size={14}
                        tintColor={theme.textSecondary}
                      />
                    </ThemedView>
                  </Pressable>
                ))}
              </ThemedView>
            </ThemedView>
          )}
        </ScrollView>
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
    paddingTop: Platform.select({ web: Spacing.six, default: Spacing.four }),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.three,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    color: "#e0463f",
  },
  list: {
    gap: Spacing.two,
  },
  imageCard: {
    borderRadius: 16,
    overflow: "hidden",
  },
  imageCardBody: {
    padding: Spacing.three,
    paddingTop: Spacing.two,
    backgroundColor: "transparent",
  },
  section: {
    marginTop: Spacing.four,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 22,
    marginBottom: Spacing.two,
  },
  finishedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.two + 4,
    borderRadius: 12,
  },
  finishedThumb: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  finishedText: {
    flex: 1,
    gap: 2,
    backgroundColor: "transparent",
  },
});
