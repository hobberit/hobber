import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import type { Hobby } from "@/types";

interface HobbyCardImageProps {
  hobby: Hobby;
  height?: number;
}

/** Photo banner used at the top of hobby cards — Tracker's hobby lists and the
 * Generate/Home "accept a suggestion" cards all share this same visual. */
export function HobbyCardImage({ hobby, height = 140 }: HobbyCardImageProps) {
  if (!hobby.image_url) {
    return (
      <ThemedView type="backgroundElement" style={[styles.fallback, { height }]}>
        <ThemedText type="subtitle" style={styles.fallbackName}>
          {hobby.name}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ImageBackground
      source={{ uri: hobby.image_url }}
      style={[styles.container, { height }]}
      imageStyle={styles.image}>
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.75)"]}
        style={styles.gradient}
        pointerEvents="none"
      />
      <ThemedText type="subtitle" style={styles.name}>
        {hobby.name}
      </ThemedText>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "flex-end",
    padding: Spacing.three,
    overflow: "hidden",
  },
  image: {
    borderRadius: 12,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "70%",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  name: {
    color: "#ffffff",
    fontSize: 22,
    lineHeight: 26,
  },
  fallback: {
    width: "100%",
    justifyContent: "flex-end",
    padding: Spacing.three,
    borderRadius: 12,
  },
  fallbackName: {
    marginTop: Spacing.one,
  },
});
