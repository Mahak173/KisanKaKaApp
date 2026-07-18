import { useRouter } from "expo-router";
import { Bell, FlaskConical, Leaf, Menu, Search, ShoppingCart, Tractor } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SideDrawer from "@/components/SideDrawer";
import {
  AppImage,
  Banner,
  BannerCarousel,
  ErrorState,
  ProductCard,
  SectionHeader,
  Skeleton,
} from "@/components/ui";
import { Radius, Shadows, Spacing } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useTheme } from "@/hooks/use-theme";
import { getBanners, getCollections, getProducts } from "@/services/shopify";

const TRUST_HIGHLIGHTS = [
  { icon: Leaf, label: "100% Organic" },
  { icon: FlaskConical, label: "Lab Tested" },
  { icon: Tractor, label: "Direct from Farmers" },
] as const;

const greetingForNow = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const { cart, addToCart } = useCart();
  const { toggleWishlist, isFavourite } = useWishlist();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const [productData, collectionData, bannerData] = await Promise.all([
      getProducts(),
      getCollections(),
      getBanners(),
    ]);

    setProducts(productData);
    setCollections(collectionData);
    setBanners(
      bannerData
        .map((edge: any) => ({
          id: String(edge?.node?.id ?? ""),
          imageUrl: edge?.node?.images?.edges?.[0]?.node?.url as string | undefined,
          title: edge?.node?.title as string | undefined,
        }))
        .filter((banner: any): banner is Banner => Boolean(banner.id && banner.imageUrl)),
    );
  }, []);

  useEffect(() => {
    loadData().finally(() => setLoading(false));
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

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

  const cartCount = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
  const firstName = user?.displayName?.split(" ")[0];
  const nothingToShow =
    !loading && products.length === 0 && collections.length === 0 && banners.length === 0;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={["top"]}>
      <SideDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open menu"
          hitSlop={8}
          onPress={() => setDrawerVisible(true)}
          style={({ pressed }) => pressed && { opacity: 0.6 }}>
          <Menu size={26} color={theme.text} />
        </Pressable>

        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
          accessibilityLabel="KisanKaka"
        />

        <View style={styles.headerIcons}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            hitSlop={8}
            onPress={() => router.push("/notifications")}
            style={({ pressed }) => pressed && { opacity: 0.6 }}>
            <Bell size={24} color={theme.text} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Cart, ${cartCount} items`}
            hitSlop={8}
            onPress={() => router.push("/cart")}
            style={({ pressed }) => [styles.cartIcon, pressed && { opacity: 0.6 }]}>
            <ShoppingCart size={24} color={theme.text} />
            {cartCount > 0 ? (
              <View style={[styles.badge, { backgroundColor: theme.accent }]}>
                <Text style={styles.badgeText}>{cartCount > 99 ? "99+" : cartCount}</Text>
              </View>
            ) : null}
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
        }>
        {/* Greeting + search */}
        <View style={styles.greetingBlock}>
          <Text style={[styles.greeting, { color: theme.textSecondary }]}>
            {greetingForNow()}
            {firstName ? `, ${firstName}` : ""} 👋
          </Text>
          <Text style={[styles.tagline, { color: theme.text }]}>
            Farm fresh goodness, delivered home
          </Text>
        </View>

        <Pressable
          accessibilityRole="search"
          accessibilityLabel="Search for products"
          onPress={() => router.push("/search")}
          style={({ pressed }) => [
            styles.searchBar,
            { backgroundColor: theme.surface },
            Shadows.card,
            pressed && { opacity: 0.8 },
          ]}>
          <Search size={20} color={theme.textMuted} />
          <Text style={[styles.searchPlaceholder, { color: theme.textMuted }]}>
            Search for products...
          </Text>
        </Pressable>

        {nothingToShow ? (
          <ErrorState
            title="Couldn't load the store"
            message="Please check your connection and try again."
            onRetry={() => {
              setLoading(true);
              loadData().finally(() => setLoading(false));
            }}
          />
        ) : (
          <>
            {/* Hero banners */}
            {loading ? (
              <View style={styles.bannerSkeleton}>
                <Skeleton height={170} radius={Radius.xl} />
              </View>
            ) : (
              banners.length > 0 && (
                <View style={styles.bannerBlock}>
                  <BannerCarousel banners={banners} />
                </View>
              )
            )}

            {/* Trust highlights */}
            <View style={[styles.trustRow, { borderColor: theme.border }]}>
              {TRUST_HIGHLIGHTS.map(({ icon: Icon, label }) => (
                <View key={label} style={styles.trustItem}>
                  <View style={[styles.trustIcon, { backgroundColor: theme.primarySoft }]}>
                    <Icon size={20} color={theme.primary} strokeWidth={1.8} />
                  </View>
                  <Text style={[styles.trustLabel, { color: theme.textSecondary }]}>{label}</Text>
                </View>
              ))}
            </View>

            {/* Categories */}
            {loading ? (
              <View style={styles.categorySkeletonRow}>
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} width={104} height={120} radius={Radius.lg} />
                ))}
              </View>
            ) : (
              collections.length > 0 && (
                <>
                  <SectionHeader title="Shop by Category" onViewAll={() => router.push("/categories")} />
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryRow}>
                    {collections.map((item: any) => (
                      <Pressable
                        key={item.id}
                        accessibilityRole="button"
                        accessibilityLabel={`Shop ${item.title}`}
                        onPress={() =>
                          router.push({
                            pathname: "/collection/[id]",
                            params: { id: item.handle, title: item.title },
                          })
                        }
                        style={({ pressed }) => [
                          styles.categoryCard,
                          { backgroundColor: theme.surface },
                          Shadows.card,
                          pressed && { opacity: 0.85 },
                        ]}>
                        <AppImage
                          source={item.image?.src ? { uri: item.image.src } : undefined}
                          style={styles.categoryImage}
                          accessibilityIgnoresInvertColors
                        />
                        <Text
                          numberOfLines={2}
                          style={[styles.categoryTitle, { color: theme.text }]}>
                          {item.title}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </>
              )
            )}

            {/* Featured products */}
            {loading ? (
              <View style={styles.productSkeletonGrid}>
                {[0, 1, 2, 3].map((i) => (
                  <View key={i} style={styles.productSkeletonCard}>
                    <Skeleton height={150} radius={Radius.lg} />
                    <Skeleton width="80%" height={14} style={{ marginTop: Spacing.two }} />
                    <Skeleton width="40%" height={14} style={{ marginTop: Spacing.one }} />
                  </View>
                ))}
              </View>
            ) : (
              products.length > 0 && (
                <>
                  <SectionHeader title="Featured Products" onViewAll={() => router.push("/search")} />
                  <View style={styles.productGrid}>
                    {products.map((item: any) => {
                      const variant = item.variants?.[0];
                      return (
                        <ProductCard
                          key={item.id}
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
                          style={styles.productCard}
                        />
                      );
                    })}
                  </View>
                </>
              )
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  logo: {
    width: 48,
    height: 48,
    resizeMode: "contain",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  cartIcon: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    right: -8,
    top: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
  scrollContent: {
    paddingBottom: Spacing.five,
  },
  greetingBlock: {
    paddingHorizontal: Spacing.three,
    marginTop: Spacing.one,
  },
  greeting: {
    fontSize: 14,
    fontWeight: "600",
  },
  tagline: {
    fontSize: 20,
    fontWeight: "800",
    marginTop: 2,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginHorizontal: Spacing.three,
    marginTop: Spacing.three,
    marginBottom: Spacing.four,
    paddingHorizontal: Spacing.three,
    minHeight: 48,
    borderRadius: Radius.lg,
  },
  searchPlaceholder: {
    fontSize: 15,
  },
  bannerBlock: {
    marginBottom: Spacing.four,
  },
  bannerSkeleton: {
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.four,
  },
  trustRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: Spacing.three,
    marginHorizontal: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  trustItem: {
    alignItems: "center",
    flex: 1,
    gap: Spacing.one,
  },
  trustIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  trustLabel: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  categoryRow: {
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
  },
  categorySkeletonRow: {
    flexDirection: "row",
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    marginTop: Spacing.four,
  },
  categoryCard: {
    width: 104,
    borderRadius: Radius.lg,
    padding: Spacing.two,
    alignItems: "center",
  },
  categoryImage: {
    width: 88,
    height: 72,
    borderRadius: Radius.md,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    marginTop: Spacing.two,
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
  },
  productCard: {
    flexBasis: "47%",
    flexGrow: 1,
    maxWidth: "48.5%",
  },
  productSkeletonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
    marginTop: Spacing.four,
  },
  productSkeletonCard: {
    flexBasis: "47%",
    flexGrow: 1,
  },
});
