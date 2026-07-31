import { StyleSheet, View } from "react-native";
import WebView from "react-native-webview";

export function YouTubeEmbed({ videoId }: { videoId: string }) {
  return (
    <View style={styles.container}>
      <WebView
        style={styles.webview}
        source={{ uri: `https://www.youtube.com/embed/${videoId}` }}
        allowsFullscreenVideo
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
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
