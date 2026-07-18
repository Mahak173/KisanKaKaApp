import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ComingSoon, ScreenHeader } from "@/components/ui";
import { useTheme } from "@/hooks/use-theme";

/** Generic placeholder for features whose APIs are not integrated yet. */
export default function ComingSoonScreen() {
  const theme = useTheme();
  const { title } = useLocalSearchParams<{ title?: string }>();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={["top"]}>
      <ScreenHeader title={title || "Coming Soon"} />
      <ComingSoon />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
});
