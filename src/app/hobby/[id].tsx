import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

import { ExternalLink } from "@/components/external-link";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { Spacing } from "@/constants/theme";
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

  if (state.kind === "loading") {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText themeColor="textSecondary">Loading...</ThemedText>
      </ThemedView>
    );
  }

  if (state.kind === "not_found") {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText themeColor="textSecondary">Hobby not found.</ThemedText>
      </ThemedView>
    );
  }

  if (state.kind === "error") {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.error}>{state.message}</ThemedText>
      </ThemedView>
    );
  }

  const { hobby, equipment, roadmap, resources, milestones } = state.guide;
  const resourcesByCategory = RESOURCE_CATEGORY_ORDER.map((category) => ({
    category,
    items: resources.filter((r) => r.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText type="title">{hobby.name}</ThemedText>
      <ThemedText themeColor="textSecondary" type="small" style={styles.category}>
        {capitalize(hobby.category)}
      </ThemedText>
      <ThemedText style={styles.description}>{hobby.description}</ThemedText>

      <Section title="Cost & Time Commitment">
        <ThemedView style={styles.metaRow}>
          <MetaPill label={`${capitalize(hobby.cost_tier)} cost`} />
          <MetaPill label={`$${hobby.cost_min}-$${hobby.cost_max} to start`} />
          <MetaPill label={`${hobby.time_beginner_hrs_week} hrs/wk beginner`} />
          <MetaPill label={`${hobby.time_intermediate_hrs_week} hrs/wk intermediate`} />
        </ThemedView>
      </Section>

      <Section title="Beginner Equipment">
        {equipment.length === 0 ? (
          <EmptyNote text="Equipment list coming soon for this hobby." />
        ) : (
          <ThemedView style={styles.list}>
            {equipment.map((item) => (
              <ThemedView key={item.id} type="backgroundElement" style={styles.card}>
                <ThemedView style={styles.equipmentHeader}>
                  <ThemedText type="smallBold">{item.name}</ThemedText>
                  {!item.is_essential && (
                    <ThemedText themeColor="textSecondary" type="small">
                      optional
                    </ThemedText>
                  )}
                </ThemedView>
                <ThemedText themeColor="textSecondary" type="small">
                  ${item.cost_min}-${item.cost_max}
                  {item.alt_note ? ` · ${item.alt_note}` : ""}
                </ThemedText>
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
                <ThemedText type="smallBold" style={styles.resourceGroupTitle}>
                  {RESOURCE_CATEGORY_LABELS[group.category]}
                </ThemedText>
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
                      {resource.source && (
                        <ThemedText themeColor="textSecondary" type="small">
                          {resource.source}
                        </ThemedText>
                      )}
                    </ThemedView>
                  );
                })}
              </ThemedView>
            ))}
          </ThemedView>
        )}
      </Section>

      <Section title="What to Expect Over Time">
        {milestones.length === 0 ? (
          <EmptyNote text="Milestone timeline coming soon for this hobby." />
        ) : (
          <ThemedView style={styles.list}>
            {milestones.map((milestone) => (
              <ThemedView key={milestone.id} type="backgroundElement" style={styles.card}>
                <ThemedText themeColor="textSecondary" type="small">
                  {milestone.typical_timeframe}
                </ThemedText>
                <ThemedText type="smallBold">{milestone.title}</ThemedText>
                <ThemedText type="small">{milestone.description}</ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        )}
      </Section>
    </ScrollView>
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

function MetaPill({ label }: { label: string }) {
  return (
    <ThemedView type="backgroundElement" style={styles.pill}>
      <ThemedText type="small">{label}</ThemedText>
    </ThemedView>
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
  container: {
    padding: Spacing.four,
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
  category: {
    marginTop: Spacing.half,
  },
  description: {
    marginTop: Spacing.two,
  },
  section: {
    gap: Spacing.two,
  },
  sectionTitle: {
    marginBottom: Spacing.one,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.one,
  },
  pill: {
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.two,
    borderRadius: 999,
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
  },
  weekDescription: {
    marginTop: Spacing.half,
  },
  goal: {
    marginLeft: Spacing.one,
  },
  resourceGroupTitle: {
    marginBottom: Spacing.one,
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
