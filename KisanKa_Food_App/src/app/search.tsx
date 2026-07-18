import { useRouter } from "expo-router";
import { Search, SearchX, X } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState, ProductCard, ScreenHeader, Skeleton } from "@/components/ui";
import { Radius, Shadows, Spacing } from "@/constants/theme";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useTheme } from "@/hooks/use-theme";
import { getProducts } from "@/services/shopify";

export default function SearchScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isFavourite } = useWishlist();

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    const data = await getProducts();
    setProducts(data);
  }, []);

  useEffect(() => {
    loadProducts().finally(() => setLoading(false));
  }, [loadProducts]);

  const filteredProducts = useMemo(() => {
    if (search.trim() === "") return products;
    return products.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, products]);

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
      <ScreenHeader title="Search" />

      <View style={[styles.searchBox, { backgroundColor: theme.surface }, Shadows.card]}>
        <Search size={20} color={theme.textMuted} />
        <TextInput
          placeholder="Search for products..."
          placeholderTextColor={theme.textMuted}
          value={search}
          onChangeText={setSearch}
          autoFocus
          returnKeyType="search"
          style={[styles.input, { color: theme.text }]}
          accessibilityLabel="Search for products"
        />
        {search.length > 0 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            hitSlop={8}
            onPress={() => setSearch("")}>
            <X size={18} color={theme.textMuted} />
          </Pressable>
        ) : null}
      </View>

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
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={6}
          windowSize={7}
          removeClippedSubviews
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
            search.trim() !== "" ? (
              <EmptyState
                icon={SearchX}
                title="No Products Found"
                message="Try searching with another keyword."
              />
            ) : (
              <EmptyState
                icon={SearchX}
                title="No products to show"
                message="Please check your connection and try again."
                actionLabel="Retry"
                onAction={() => {
                  setLoading(true);
                  loadProducts().finally(() => setLoading(false));
                }}
              />
            )
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
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginHorizontal: Spacing.three,
    marginBottom: Spacing.three,
    paddingHorizontal: Spacing.three,
    minHeight: 48,
    borderRadius: Radius.lg,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: Spacing.two,
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
