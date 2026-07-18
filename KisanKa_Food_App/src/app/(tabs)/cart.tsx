import { useRouter } from "expo-router";
import { ShoppingCart, Trash2 } from "lucide-react-native";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  AppImage,
  EmptyState,
  PrimaryButton,
  QuantityStepper,
  ScreenHeader,
} from "@/components/ui";
import { Radius, Shadows, Spacing } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/hooks/use-theme";
import { formatPrice } from "@/utils/format";

export default function CartScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { cart, removeFromCart, increaseQty, decreaseQty } = useCart();
  const { user } = useAuth();

  const totalPrice = cart.reduce(
    (sum: number, item: any) => sum + Number(item.price) * item.quantity,
    0,
  );

  const handleCheckout = () => {
    if (!user) {
      Alert.alert("Login Required", "Please login to continue to checkout.", [
        { text: "Cancel", style: "cancel" },
        { text: "Login", onPress: () => router.push("/login") },
      ]);
      return;
    }
    router.push("/address");
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={["top"]}>
      <ScreenHeader title="My Cart" showBack={false} />

      {cart.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          message="Add fresh, organic products to get started."
          actionLabel="Browse Products"
          onAction={() => router.push("/")}
        />
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => `${item.id}-${item.size}`}
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
                  {item.size && item.size !== "Default Title" ? (
                    <Text style={[styles.size, { color: theme.textSecondary }]}>{item.size}</Text>
                  ) : null}
                  <Text style={[styles.price, { color: theme.primary }]}>
                    {formatPrice(item.price)}
                  </Text>
                  <View style={styles.controls}>
                    <QuantityStepper
                      value={item.quantity}
                      size="small"
                      onIncrease={() => increaseQty(item.id)}
                      onDecrease={() => decreaseQty(item.id)}
                    />
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Remove ${item.title} from cart`}
                      hitSlop={8}
                      onPress={() => removeFromCart(item.id, item.size)}
                      style={({ pressed }) => pressed && { opacity: 0.6 }}>
                      <Trash2 size={20} color={theme.danger} />
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            )}
          />

          {/* Price summary + CTA */}
          <View
            style={[
              styles.footer,
              { backgroundColor: theme.surface, borderTopColor: theme.border },
            ]}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                Subtotal ({cart.length} {cart.length === 1 ? "item" : "items"})
              </Text>
              <Text style={[styles.summaryValue, { color: theme.text }]}>
                {formatPrice(totalPrice)}
              </Text>
            </View>
            <Text style={[styles.summaryNote, { color: theme.textMuted }]}>
              Taxes and delivery calculated at checkout
            </Text>
            <PrimaryButton
              label={`Proceed to Checkout • ${formatPrice(totalPrice)}`}
              onPress={handleCheckout}
            />
          </View>
        </>
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
    borderRadius: Radius.lg,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  image: {
    width: 84,
    height: 84,
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
  size: {
    fontSize: 13,
    marginTop: 2,
  },
  price: {
    fontSize: 15,
    fontWeight: "800",
    marginTop: 4,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing.two,
  },
  footer: {
    padding: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: Spacing.two,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "800",
  },
  summaryNote: {
    fontSize: 12,
    marginBottom: Spacing.one,
  },
});
