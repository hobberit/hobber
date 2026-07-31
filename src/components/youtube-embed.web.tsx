import { StyleSheet, View } from "react-native";

const iframeStyle = { width: "100%", height: "100%", borderWidth: 0 };

export function YouTubeEmbed({ videoId }: { videoId: string }) {
  return (
    <View style={styles.container}>
      <iframe
        style={iframeStyle}
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: "hidden",
  },
});
