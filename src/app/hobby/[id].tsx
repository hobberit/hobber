import { useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ExternalLink } from "@/components/external-link";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { extractYouTubeVideoId } from "@/lib/youtube";
import { getHobbyGuide, type HobbyGuide } from "@/services";
import type { ResourceCategory } from "@/types";

const RESOURCE_CATEGORY_LABELS: Record<ResourceCategory, string> = {
  first_30_minutes: "First 30 Minutes",
  first_week: "First Week",
  beginner_mistakes: "Beginner Mistakes",
  progression_story: "Progression Stories",
};

const RESOURCE_CATEGORY_ORDER: ResourceCategory[] = [
  "first_30_minutes",
  "first_week",
  "beginner_mistakes",
  "progression_story",
];

type ScreenState =
  | { kind: "loading" }
  | { kind: "loaded"; guide: HobbyGuide }
  | { kind: "not_found" }
  | { kind: "error"; message: string };

export default function HobbyGuideScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const [state, setState] = useState<ScreenState>({ kind: "loading" });

  useEffect(() => {
    let isMounted = true;
    setState({ kind: "loading" });

    getHobbyGuide(id)
      .then((guide) => {
        if (!isMounted) return;
        setState(guide ? { kind: "loaded", guide } : { kind: "not_found" });
      })
      .catch((e) => {
        if (!isMounted) return;
        setState({
          kind: "error",
          message: e instanceof Error ? e.message : "Something went wrong.",
        });
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const header = (
    <ThemedView style={styles.header}>
      <Pressable onPress={() => router.back()} hitSlop={8}>
        <SymbolView
          name={{ ios: "chevron.left", android: "chevron_left", web: "chevron_left" }}
          size={20}
          tintColor="#000000"
        />
      </Pressable>
    </ThemedView>
  );

  if (state.kind === "loading") {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        {header}
        <ThemedView style={styles.centered}>
          <ThemedText themeColor="textSecondary">Loading...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (state.kind === "not_found") {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        {header}
        <ThemedView style={styles.centered}>
          <ThemedText themeColor="textSecondary">Hobby not found.</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (state.kind === "error") {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        {header}
        <ThemedView style={styles.centered}>
          <ThemedText style={styles.error}>{state.message}</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  const { hobby, equipment, roadmap, resources } = state.guide;
  const resourcesByCategory = RESOURCE_CATEGORY_ORDER.map((category) => ({
    category,
    items: resources.filter((r) => r.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {header}
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <ThemedText type="title" style={styles.title}>{hobby.name}</ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.category}>
        {capitalize(hobby.category)}
      </ThemedText>
      <ThemedText style={styles.description}>{hobby.description}</ThemedText>

      <Section title="Beginner Equipment">
        {equipment.length === 0 ? (
          <EmptyNote text="Equipment list coming soon for this hobby." />
        ) : (
          <ThemedView style={styles.list}>
            {equipment.map((item) => (
              <ThemedView key={item.id} type="backgroundElement" style={styles.card}>
                <ThemedView style={styles.equipmentHeader}>
                  <ThemedText type="smallBold">{item.name}</ThemedText>
                  <ThemedText type="smallBold">
                    ${item.cost_min}-${item.cost_max}
                  </ThemedText>
                </ThemedView>
                {(!item.is_essential || item.alt_note) && (
                  <ThemedText themeColor="textSecondary" type="small">
                    {!item.is_essential ? "optional" : ""}
                    {!item.is_essential && item.alt_note ? " · " : ""}
                    {item.alt_note}
                  </ThemedText>
                )}
                {item.product_link && (
                  <ExternalLink href={item.product_link as `${string}:${string}`}>
                    <ThemedText type="linkPrimary">Find one →</ThemedText>
                  </ExternalLink>
                )}
              </ThemedView>
            ))}
          </ThemedView>
        )}
      </Section>

      <Section title="4-Week Starter Roadmap">
        {roadmap.length === 0 ? (
          <EmptyNote text="Starter roadmap coming soon for this hobby." />
        ) : (
          <ThemedView style={styles.list}>
            {roadmap.map((week) => (
              <ThemedView key={week.id} type="backgroundElement" style={styles.card}>
                <ThemedText type="smallBold">
                  Week {week.week_number}: {week.title}
                </ThemedText>
                <ThemedText themeColor="textSecondary" type="small" style={styles.weekDescription}>
                  {week.description}
                </ThemedText>
                {week.goals.map((goal, i) => (
                  <ThemedText key={i} type="small" style={styles.goal}>
                    • {goal}
                  </ThemedText>
                ))}
              </ThemedView>
            ))}
          </ThemedView>
        )}
      </Section>

      <Section title="Learning Resources">
        {resourcesByCategory.length === 0 ? (
          <EmptyNote text="Curated resources coming soon for this hobby." />
        ) : (
          <ThemedView style={styles.list}>
            {resourcesByCategory.map((group) => (
              <ThemedView key={group.category}>
                <ResourceGroupLabel>{RESOURCE_CATEGORY_LABELS[group.category]}</ResourceGroupLabel>
                {group.items.map((resource) => {
                  const videoId = extractYouTubeVideoId(resource.url);
                  return (
                    <ThemedView key={resource.id} style={styles.resourceLink}>
                      {videoId && (
                        <ThemedView style={styles.embedWrapper}>
                          <YouTubeEmbed videoId={videoId} />
                        </ThemedView>
                      )}
                      <ExternalLink href={resource.url as `${string}:${string}`}>
                        <ThemedText type="linkPrimary">{resource.title}</ThemedText>
                      </ExternalLink>
                    </ThemedView>
                  );
                })}
              </ThemedView>
            ))}
          </ThemedView>
        )}
      </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <ThemedView style={styles.section}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        {title}
      </ThemedText>
      {children}
    </ThemedView>
  );
}

function ResourceGroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <ThemedText themeColor="textSecondary" style={styles.resourceGroupTitle}>
      {children}
    </ThemedText>
  );
}

function EmptyNote({ text }: { text: string }) {
  return (
    <ThemedText themeColor="textSecondary" type="small">
      {text}
    </ThemedText>
  );
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.one,
    paddingBottom: Spacing.two,
  },
  container: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    gap: Spacing.four,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.four,
  },
  error: {
    color: "#e0463f",
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
  },
  category: {
    marginTop: Spacing.half,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  description: {
    marginTop: Spacing.two,
  },
  section: {
    gap: Spacing.two,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 22,
    marginBottom: Spacing.one,
  },
  list: {
    gap: Spacing.two,
  },
  card: {
    padding: Spacing.three,
    borderRadius: 12,
    gap: Spacing.half,
  },
  equipmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  weekDescription: {
    marginTop: Spacing.half,
  },
  goal: {
    marginLeft: Spacing.one,
  },
  resourceGroupTitle: {
    marginBottom: Spacing.one,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  resourceLink: {
    marginBottom: Spacing.three,
    gap: Spacing.one,
  },
  embedWrapper: {
    marginBottom: Spacing.one,
    width: "100%",
    maxWidth: 480,
  },
});
