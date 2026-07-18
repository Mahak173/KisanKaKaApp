import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { FlaskConical, Heart, Leaf, PackageX, Tractor } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  AppImage,
  ErrorState,
  PrimaryButton,
  QuantityStepper,
  ScreenHeader,
  Skeleton,
  StateView,
} from "@/components/ui";
import { Radius, Shadows, Spacing } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useTheme } from "@/hooks/use-theme";
import { getProductById } from "@/services/shopify";
import { formatPrice } from "@/utils/format";

const TRUST_BADGES = [
  { icon: Leaf, label: "100% Organic" },
  { icon: FlaskConical, label: "Lab Tested" },
  { icon: Tractor, label: "Direct from Farmers" },
] as const;

export default function ProductDetails() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toggleWishlist, isFavourite } = useWishlist();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const galleryRef = useRef<FlatList>(null);

  const loadProduct = useCallback(async () => {
    try {
      setError(false);
      const found = await getProductById(String(id));
      setProduct(found);
      if (found?.variants?.edges?.length > 0) {
        setSelectedVariant(found.variants.edges[0].node);
        setSelectedSize(found.variants.edges[0].node.title);
      }
    } catch {
      setError(true);
    }
  }, [id]);

  useEffect(() => {
    loadProduct().finally(() => setLoading(false));
  }, [loadProduct]);

  const images: any[] = product?.images?.edges ?? [];
  const variants: any[] = product?.variants?.edges ?? [];
  const unitPrice = Number(selectedVariant?.price?.amount || 0);
  const totalPrice = unitPrice * quantity;
  const wishlistId = String(id);

  const buildCartItem = () => ({
    id: product.id,
    variantId: selectedVariant.id,
    title: product.title,
    image: images[0]?.node?.url,
    price: selectedVariant.price.amount,
    quantity,
    size: selectedSize,
  });

  const handleAddToCart = () => {
    if (!selectedSize) {
      Alert.alert("Select Size", "Please select a size before continuing.");
      return;
    }
    addToCart(buildCartItem());
    router.push("/cart");
  };

  const handleBuyNow = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!selectedSize) {
      Alert.alert("Select Size", "Please select a size before continuing.");
      return;
    }
    addToCart(buildCartItem());
    router.push("/address");
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={["top"]}>
        <ScreenHeader title="Product" />
        <View style={styles.skeletonBody}>
          <Skeleton height={320} radius={Radius.xl} />
          <Skeleton width="70%" height={22} style={{ marginTop: Spacing.four }} />
          <Skeleton width="30%" height={20} style={{ marginTop: Spacing.two }} />
          <Skeleton width="100%" height={44} style={{ marginTop: Spacing.four }} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={["top"]}>
        <ScreenHeader title="Product" />
        <ErrorState
          onRetry={() => {
            setLoading(true);
            loadProduct().finally(() => setLoading(false));
          }}
        />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={["top"]}>
        <ScreenHeader title="Product" />
        <StateView
          icon={PackageX}
          title="Product not found"
          message="This product may no longer be available."
          actionLabel="Continue Shopping"
          onAction={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  const galleryWidth = width - Spacing.three * 2;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={["top"]}>
      <ScreenHeader
        title="Product"
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              isFavourite(wishlistId) ? "Remove from wishlist" : "Add to wishlist"
            }
            hitSlop={8}
            onPress={() =>
              toggleWishlist({
                id: wishlistId,
                variantId: selectedVariant?.id,
                title: product.title,
                price: selectedVariant?.price?.amount,
                image: images[0]?.node?.url,
              })
            }
            style={({ pressed }) => [
              styles.heartButton,
              { backgroundColor: theme.surface },
              pressed && { opacity: 0.7 },
            ]}>
            <Heart
              size={20}
              color={isFavourite(wishlistId) ? theme.danger : theme.textSecondary}
              fill={isFavourite(wishlistId) ? theme.danger : "transparent"}
            />
          </Pressable>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 + insets.bottom }}>
        {/* Image gallery */}
        <View style={styles.galleryWrap}>
          <FlatList
            ref={galleryRef}
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => String(index)}
            getItemLayout={(_, index) => ({
              length: galleryWidth,
              offset: galleryWidth * index,
              index,
            })}
            onMomentumScrollEnd={(e) =>
              setCurrentIndex(
                Math.max(
                  0,
                  Math.min(
                    images.length - 1,
                    Math.round(e.nativeEvent.contentOffset.x / galleryWidth),
                  ),
                ),
              )
            }
            renderItem={({ item }) => (
              <AppImage
                source={{ uri: item.node.url }}
                style={[styles.mainImage, { width: galleryWidth }]}
                contentFit="cover"
                accessibilityLabel={product.title}
                accessibilityIgnoresInvertColors
              />
            )}
          />
          {images.length > 1 ? (
            <View style={styles.dots}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        index === currentIndex ? theme.primary : theme.backgroundSelected,
                      width: index === currentIndex ? 18 : 6,
                    },
                  ]}
                />
              ))}
            </View>
          ) : null}
        </View>

        {/* Thumbnails */}
        {images.length > 1 ? (
          <FlatList
            data={images}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => `thumb-${index}`}
            contentContainerStyle={styles.thumbRow}
            renderItem={({ item, index }) => (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Image ${index + 1} of ${images.length}`}
                onPress={() => {
                  setCurrentIndex(index);
                  galleryRef.current?.scrollToOffset({
                    offset: index * galleryWidth,
                    animated: true,
                  });
                }}>
                <AppImage
                  source={{ uri: item.node.url }}
                  style={[
                    styles.thumbnail,
                    currentIndex === index && { borderWidth: 2, borderColor: theme.primary },
                  ]}
                  accessibilityIgnoresInvertColors
                />
              </Pressable>
            )}
          />
        ) : null}

        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.text }]} accessibilityRole="header">
            {product.title}
          </Text>

          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: theme.text }]}>{formatPrice(unitPrice)}</Text>
            {selectedSize && selectedSize !== "Default Title" ? (
              <Text style={[styles.priceUnit, { color: theme.textSecondary }]}>
                / {selectedSize}
              </Text>
            ) : null}
          </View>

          <View
            style={[
              styles.stockBadge,
              {
                backgroundColor: product.availableForSale ? theme.successSoft : theme.dangerSoft,
              },
            ]}>
            <Text
              style={[
                styles.stockText,
                { color: product.availableForSale ? theme.success : theme.danger },
              ]}>
              {product.availableForSale ? "In Stock" : "Out of Stock"}
            </Text>
          </View>

          {/* Variant selection */}
          {variants.length > 0 && variants[0].node.title !== "Default Title" ? (
            <>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Select Weight</Text>
              <View style={styles.variantRow}>
                {variants.map((variant: any) => {
                  const selected = selectedSize === variant.node.title;
                  return (
                    <Pressable
                      key={variant.node.id}
                      accessibilityRole="button"
                      accessibilityLabel={`Size ${variant.node.title}`}
                      accessibilityState={{ selected }}
                      onPress={() => {
                        setSelectedVariant(variant.node);
                        setSelectedSize(variant.node.title);
                      }}
                      style={[
                        styles.variantChip,
                        {
                          borderColor: theme.primary,
                          backgroundColor: selected ? theme.primary : "transparent",
                        },
                      ]}>
                      <Text
                        style={[
                          styles.variantText,
                          { color: selected ? theme.onPrimary : theme.primary },
                        ]}>
                        {variant.node.title}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          ) : null}

          {/* Quantity */}
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Quantity</Text>
          <QuantityStepper
            value={quantity}
            onIncrease={() => setQuantity(quantity + 1)}
            onDecrease={() => quantity > 1 && setQuantity(quantity - 1)}
          />

          {/* Trust badges */}
          <View style={[styles.trustRow, { borderColor: theme.border }]}>
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <View key={label} style={styles.trustItem}>
                <View style={[styles.trustIcon, { backgroundColor: theme.primarySoft }]}>
                  <Icon size={18} color={theme.primary} strokeWidth={1.8} />
                </View>
                <Text style={[styles.trustLabel, { color: theme.textSecondary }]}>{label}</Text>
              </View>
            ))}
          </View>

          {/* Description */}
          {product.description ? (
            <>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>About this product</Text>
              <Text style={[styles.description, { color: theme.textSecondary }]}>
                {product.description}
              </Text>
            </>
          ) : null}

          {/* Product information */}
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Product Information</Text>
          <View style={[styles.infoCard, { backgroundColor: theme.surface }, Shadows.card]}>
            {product.vendor ? (
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Brand</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>{product.vendor}</Text>
              </View>
            ) : null}
            {product.productType ? (
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Type</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>{product.productType}</Text>
              </View>
            ) : null}
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Availability</Text>
              <Text
                style={[
                  styles.infoValue,
                  { color: product.availableForSale ? theme.success : theme.danger },
                ]}>
                {product.availableForSale ? "In Stock" : "Out of Stock"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky CTA bar */}
      <View
        style={[
          styles.ctaBar,
          Shadows.raised,
          {
            backgroundColor: theme.surface,
            borderTopColor: theme.border,
            paddingBottom: Math.max(insets.bottom, Spacing.three),
          },
        ]}>
        <PrimaryButton
          label={`Add to Cart • ${formatPrice(totalPrice)}`}
          onPress={handleAddToCart}
          style={styles.ctaButton}
        />
        <PrimaryButton
          label="Buy Now"
          variant="outline"
          onPress={handleBuyNow}
          style={styles.ctaButtonSecondary}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  skeletonBody: {
    padding: Spacing.three,
  },
  heartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  galleryWrap: {
    paddingHorizontal: Spacing.three,
  },
  mainImage: {
    aspectRatio: 1,
    borderRadius: Radius.xl,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: Spacing.two,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  thumbRow: {
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: Radius.md,
  },
  content: {
    padding: Spacing.three,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 28,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: Spacing.one,
    marginTop: Spacing.two,
  },
  price: {
    fontSize: 22,
    fontWeight: "800",
  },
  priceUnit: {
    fontSize: 14,
    fontWeight: "600",
  },
  stockBadge: {
    alignSelf: "flex-start",
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    marginTop: Spacing.two,
  },
  stockText: {
    fontSize: 12,
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: Spacing.four,
    marginBottom: Spacing.two,
  },
  variantRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  variantChip: {
    borderWidth: 1.5,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two + 2,
    minHeight: 44,
    justifyContent: "center",
  },
  variantText: {
    fontSize: 14,
    fontWeight: "700",
  },
  trustRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: Spacing.three,
    marginTop: Spacing.four,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  trustItem: {
    alignItems: "center",
    flex: 1,
    gap: Spacing.one,
  },
  trustIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  trustLabel: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  infoCard: {
    borderRadius: Radius.lg,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.three,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    flexShrink: 1,
    textAlign: "right",
  },
  ctaBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    gap: Spacing.two,
    padding: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  ctaButton: {
    flex: 3,
  },
  ctaButtonSecondary: {
    flex: 2,
  },
});
