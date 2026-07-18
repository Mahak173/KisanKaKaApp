import { useRouter } from "expo-router";
import { ChevronRight, LayoutGrid } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppImage, EmptyState, ScreenHeader, Skeleton } from "@/components/ui";
import { Radius, Shadows, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { getCollections } from "@/services/shopify";

export default function CategoriesScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadCollections = useCallback(async () => {
    const data = await getCollections();
    setCollections(data);
  }, []);

  useEffect(() => {
    loadCollections().finally(() => setLoading(false));
  }, [loadCollections]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCollections();
    setRefreshing(false);
  }, [loadCollections]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={["top"]}>
      <ScreenHeader title="Categories" showBack={false} />

      {loading ? (
        <View style={styles.skeletons}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} height={84} radius={Radius.lg} />
          ))}
        </View>
      ) : (
        <FlatList
          data={collections}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
          }
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Browse ${item.title}`}
              onPress={() =>
                router.push({
                  pathname: "/collection/[id]",
                  params: { id: item.handle, title: item.title },
                })
              }
              style={({ pressed }) => [
                styles.row,
                { backgroundColor: theme.surface },
                Shadows.card,
                pressed && { opacity: 0.85 },
              ]}>
              <AppImage
                source={item.image?.src ? { uri: item.image.src } : undefined}
                style={styles.image}
                accessibilityIgnoresInvertColors
              />
              <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
                {item.title}
              </Text>
              <ChevronRight size={20} color={theme.textMuted} />
            </Pressable>
          )}
          ListEmptyComponent={
            <EmptyState
              icon={LayoutGrid}
              title="No Categories Available"
              message="Please check your connection and try again."
              actionLabel="Retry"
              onAction={() => {
                setLoading(true);
                loadCollections().finally(() => setLoading(false));
              }}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  skeletons: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  listContent: {
    padding: Spacing.three,
    gap: Spacing.three,
    flexGrow: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    borderRadius: Radius.lg,
    padding: Spacing.three,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: Radius.md,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
  },
});
