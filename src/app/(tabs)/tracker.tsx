import { useFocusEffect, useRouter } from "expo-router";
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
import { listActiveHobbies, listFinishedHobbies, type ActiveHobby } from "@/services";

type ScreenState =
  | { kind: "loading" }
  | {
      kind: "loaded";
      activeHobbies: ActiveHobby[];
      finishedHobbies: ActiveHobby[];
    }
  | { kind: "error"; message: string };

export default function TrackerScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const theme = useTheme();
  const [state, setState] = useState<ScreenState>({ kind: "loading" });

  const load = useCallback(async () => {
    if (!session?.user) return;
    const userId = session.user.id;

    try {
      const [activeHobbies, finishedHobbies] = await Promise.all([
        listActiveHobbies(userId),
        listFinishedHobbies(userId),
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
          ]}>
          <ThemedView style={styles.headerRow}>
            <ThemedText type="title">My Hobbies</ThemedText>
            <Pressable
              onPress={() => router.push("/generate")}
              hitSlop={8}
              accessibilityLabel="Generate a new hobby">
              <SymbolView
                name={{ ios: "plus", android: "add", web: "add" }}
                size={24}
                tintColor={theme.text}
              />
            </Pressable>
          </ThemedView>
          <ThemedText themeColor="textSecondary" style={styles.subheading}>
            Hobbies you're working on, and ones you've finished but could pick back up.
          </ThemedText>

          {state.kind === "loading" && (
            <ThemedText themeColor="textSecondary">Loading...</ThemedText>
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
                  {state.activeHobbies.map(({ userHobby, hobby }) => (
                    <ThemedView key={userHobby.id} type="backgroundElement" style={styles.imageCard}>
                      <Pressable
                        onPress={() =>
                          router.push({
                            pathname: "/tracker/[userHobbyId]",
                            params: { userHobbyId: userHobby.id },
                          })
                        }>
                        <HobbyCardImage hobby={hobby} />
                      </Pressable>
                      <ThemedView style={styles.imageCardBody}>
                        <ThemedText themeColor="textSecondary" type="small">
                          Started{" "}
                          {userHobby.started_at
                            ? new Date(userHobby.started_at).toLocaleDateString()
                            : "recently"}
                        </ThemedText>
                        <Pressable
                          onPress={() =>
                            router.push({ pathname: "/hobby/[id]", params: { id: hobby.id } })
                          }>
                          <ThemedText type="linkPrimary" style={styles.starterGuideLink}>
                            View Starter Guide
                          </ThemedText>
                        </Pressable>
                      </ThemedView>
                    </ThemedView>
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
                  <ThemedView key={userHobby.id} type="backgroundElement" style={styles.imageCard}>
                    <Pressable
                      onPress={() =>
                        router.push({
                          pathname: "/tracker/[userHobbyId]",
                          params: { userHobbyId: userHobby.id },
                        })
                      }>
                      <HobbyCardImage hobby={hobby} height={100} />
                    </Pressable>
                    <ThemedView style={styles.imageCardBody}>
                      <ThemedText themeColor="textSecondary" type="small">
                        Finished {new Date(userHobby.updated_at).toLocaleDateString()}
                        {userHobby.feedback_enjoyed === true ? " · enjoyed it" : ""}
                        {userHobby.feedback_enjoyed === false ? " · not for them" : ""}
                      </ThemedText>
                      <Pressable
                        onPress={() =>
                          router.push({ pathname: "/hobby/[id]", params: { id: hobby.id } })
                        }>
                        <ThemedText type="linkPrimary" style={styles.starterGuideLink}>
                          View Starter Guide
                        </ThemedText>
                      </Pressable>
                    </ThemedView>
                  </ThemedView>
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
  },
  subheading: {
    marginTop: Spacing.half,
    marginBottom: Spacing.three,
  },
  error: {
    color: "#e0463f",
  },
  list: {
    gap: Spacing.two,
  },
  imageCard: {
    borderRadius: 12,
    overflow: "hidden",
  },
  imageCardBody: {
    padding: Spacing.three,
    gap: Spacing.half,
  },
  section: {
    marginTop: Spacing.four,
  },
  sectionTitle: {
    marginBottom: Spacing.one,
  },
  starterGuideLink: {
    marginTop: Spacing.one,
  },
});
