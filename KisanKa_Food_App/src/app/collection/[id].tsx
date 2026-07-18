import { useLocalSearchParams, useRouter } from "expo-router";
import { PackageSearch } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  EmptyState,
  ErrorState,
  ProductCard,
  ScreenHeader,
  Skeleton,
} from "@/components/ui";
import { Radius, Spacing } from "@/constants/theme";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useTheme } from "@/hooks/use-theme";
import { getCollectionProducts } from "@/services/shopify";
import { titleCase } from "@/utils/format";

export default function CollectionScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id, title } = useLocalSearchParams<{ id: string; title?: string }>();
  const { addToCart } = useCart();
  const { toggleWishlist, isFavourite } = useWishlist();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const screenTitle = title || titleCase(String(id ?? ""));

  const loadProducts = useCallback(async () => {
    try {
      setError(false);
      const data = await getCollectionProducts(String(id));
      setProducts(data);
    } catch {
      setError(true);
    }
  }, [id]);

  useEffect(() => {
    loadProducts().finally(() => setLoading(false));
  }, [loadProducts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  }, [loadProducts]);

  const retry = () => {
    setLoading(true);
    loadProducts().finally(() => setLoading(false));
  };

  const handleQuickAdd = useCallback(
    (item: any) => {
      const variant = item.variants?.[0];
      if (!variant) return;
      addToCart({
        id: `gid://shopify/Product/${item.id}`,
        variantId: `gid://shopify/ProductVariant/${variant.id}`,
        title: item.title,
        image: item.images?.[0]?.src,
        price: variant.price,
        quantity: 1,
        size: variant.title,
      });
    },
    [addToCart],
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={["top"]}>
      <ScreenHeader title={screenTitle} />

      {loading ? (
        <View style={styles.skeletonGrid}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={styles.skeletonCard}>
              <Skeleton height={150} radius={Radius.lg} />
              <Skeleton width="80%" height={14} style={{ marginTop: Spacing.two }} />
              <Skeleton width="40%" height={14} style={{ marginTop: Spacing.one }} />
            </View>
          ))}
        </View>
      ) : error ? (
        <ErrorState onRetry={retry} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={6}
          windowSize={7}
          removeClippedSubviews
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
          }
          renderItem={({ item }) => {
            const variant = item.variants?.[0];
            return (
              <ProductCard
                title={item.title}
                imageUrl={item.images?.[0]?.src}
                price={variant?.price}
                compareAtPrice={variant?.compare_at_price}
                unit={variant?.title !== "Default Title" ? variant?.title : undefined}
                onPress={() => router.push(`/product/${item.id}`)}
                onAddToCart={variant ? () => handleQuickAdd(item) : undefined}
                isFavourite={isFavourite(String(item.id))}
                onToggleFavourite={() =>
                  toggleWishlist({
                    id: String(item.id),
                    variantId: variant?.id,
                    title: item.title,
                    price: variant?.price,
                    image: item.images?.[0]?.src,
                  })
                }
                style={styles.card}
              />
            );
          }}
          ListEmptyComponent={
            <EmptyState
              icon={PackageSearch}
              title="No Products Found"
              message="This category doesn't have any products yet."
              actionLabel="Browse Categories"
              onAction={() => router.push("/categories")}
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
  listContent: {
    padding: Spacing.three,
    flexGrow: 1,
  },
  columnWrapper: {
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  card: {
    flex: 1,
    maxWidth: "48.5%",
  },
  skeletonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: Spacing.three,
    gap: Spacing.three,
  },
  skeletonCard: {
    flexBasis: "47%",
    flexGrow: 1,
  },
});
