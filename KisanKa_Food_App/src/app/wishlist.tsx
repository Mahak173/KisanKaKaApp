import { useRouter } from "expo-router";
import { Heart } from "lucide-react-native";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppImage, EmptyState, ScreenHeader } from "@/components/ui";
import { Radius, Shadows, Spacing } from "@/constants/theme";
import { useWishlist } from "@/context/WishlistContext";
import { useTheme } from "@/hooks/use-theme";
import { formatPrice } from "@/utils/format";

export default function WishlistScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { wishlist, toggleWishlist } = useWishlist();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={["top"]}>
      <ScreenHeader title="My Wishlist" />

      {wishlist.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          message="Tap the heart on any product to save it here."
          actionLabel="Browse Products"
          onAction={() => router.push("/")}
        />
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={item.title}
              onPress={() => router.push(`/product/${String(item.id).split("/").pop()}`)}
              style={({ pressed }) => [
                styles.row,
                { backgroundColor: theme.surface },
                Shadows.card,
                pressed && { opacity: 0.9 },
              ]}>
              <AppImage
                source={item.image ? { uri: item.image } : undefined}
                style={styles.image}
                accessibilityIgnoresInvertColors
              />
              <View style={styles.details}>
                <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={[styles.price, { color: theme.primary }]}>
                  {formatPrice(item.price)}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Remove ${item.title} from wishlist`}
                hitSlop={8}
                onPress={() => toggleWishlist(item)}
                style={({ pressed }) => [styles.heart, pressed && { opacity: 0.6 }]}>
                <Heart size={22} fill={theme.danger} color={theme.danger} />
              </Pressable>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  listContent: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    borderRadius: Radius.lg,
    padding: Spacing.three,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: Radius.md,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
  },
  price: {
    fontSize: 15,
    fontWeight: "800",
    marginTop: 4,
  },
  heart: {
    padding: Spacing.two,
  },
});
