import { useFocusEffect, useRouter } from "expo-router";
import { MapPin, Pencil, Trash2 } from "lucide-react-native";
import { useCallback, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { EmptyState, ErrorState, PrimaryButton, ScreenHeader, Skeleton } from "@/components/ui";
import { Radius, Shadows, Spacing } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/hooks/use-theme";
import { deleteAddress, getAddresses } from "@/services/addressService";
import { createShopifyCheckout } from "@/services/shopify";

export default function SavedAddressScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { cart } = useCart();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  const loadAddresses = useCallback(async () => {
    if (!user) return;
    try {
      setError(false);
      const data = await getAddresses(user.uid);
      setAddresses(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Refresh whenever the screen regains focus (e.g. returning from add-address).
  useFocusEffect(
    useCallback(() => {
      loadAddresses();
    }, [loadAddresses]),
  );

  const handleDelete = (id: string) => {
    Alert.alert("Delete Address", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteAddress(user.uid, id);
            if (selectedAddress?.id === id) setSelectedAddress(null);
            loadAddresses();
          } catch {
            Alert.alert("Something went wrong", "Could not delete the address. Please try again.");
          }
        },
      },
    ]);
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      Alert.alert("Select Address", "Please select a delivery address to continue.");
      return;
    }
    if (cart.length === 0) {
      Alert.alert("Cart is empty", "Add products to your cart before checking out.");
      return;
    }

    setCheckingOut(true);
    const checkoutUrl = await createShopifyCheckout(cart);
    setCheckingOut(false);

    if (!checkoutUrl) {
      Alert.alert("Unable to create checkout", "Please check your connection and try again.");
      return;
    }

    router.push({
      pathname: "/checkout",
      params: {
        url: encodeURIComponent(checkoutUrl),
        address: JSON.stringify(selectedAddress),
      },
    });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={["top"]}>
      <ScreenHeader title="Delivery Address" />

      {loading ? (
        <View style={styles.skeletons}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} height={120} radius={Radius.lg} />
          ))}
        </View>
      ) : error ? (
        <ErrorState
          onRetry={() => {
            setLoading(true);
            loadAddresses();
          }}
        />
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const selected = selectedAddress?.id === item.id;
            return (
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                accessibilityLabel={`Deliver to ${item.fullName}, ${item.label}`}
                onPress={() => setSelectedAddress(item)}
                style={[
                  styles.card,
                  Shadows.card,
                  {
                    backgroundColor: selected ? theme.primarySoft : theme.surface,
                    borderColor: selected ? theme.primary : "transparent",
                  },
                ]}>
                <View style={styles.cardHeader}>
                  <View style={[styles.radio, { borderColor: theme.primary }]}>
                    {selected ? (
                      <View style={[styles.radioInner, { backgroundColor: theme.primary }]} />
                    ) : null}
                  </View>
                  <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
                    {item.fullName}
                  </Text>
                  <View style={[styles.labelChip, { backgroundColor: theme.backgroundElement }]}>
                    <Text style={[styles.labelText, { color: theme.textSecondary }]}>
                      {item.label}
                    </Text>
                  </View>
                  {item.isDefault ? (
                    <View style={[styles.labelChip, { backgroundColor: theme.accentSoft }]}>
                      <Text style={[styles.labelText, { color: theme.accent }]}>Default</Text>
                    </View>
                  ) : null}
                </View>

                <Text style={[styles.addressLine, { color: theme.textSecondary }]}>
                  {[item.house, item.area, item.landmark].filter(Boolean).join(", ")}
                </Text>
                <Text style={[styles.addressLine, { color: theme.textSecondary }]}>
                  {item.city}, {item.state} - {item.pincode}
                </Text>
                <Text style={[styles.addressLine, { color: theme.textSecondary }]}>
                  {item.phone}
                </Text>

                <View style={styles.actions}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Edit address of ${item.fullName}`}
                    hitSlop={6}
                    onPress={() =>
                      router.push({
                        pathname: "/add-address",
                        params: {
                          edit: "true",
                          id: item.id,
                          fullName: item.fullName,
                          phone: item.phone,
                          house: item.house,
                          area: item.area,
                          landmark: item.landmark,
                          city: item.city,
                          state: item.state,
                          pincode: item.pincode,
                          label: item.label,
                          isDefault: item.isDefault ? "true" : "false",
                        },
                      })
                    }
                    style={({ pressed }) => [styles.actionButton, pressed && { opacity: 0.6 }]}>
                    <Pencil size={16} color={theme.primary} />
                    <Text style={[styles.actionText, { color: theme.primary }]}>Edit</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Delete address of ${item.fullName}`}
                    hitSlop={6}
                    onPress={() => handleDelete(item.id)}
                    style={({ pressed }) => [styles.actionButton, pressed && { opacity: 0.6 }]}>
                    <Trash2 size={16} color={theme.danger} />
                    <Text style={[styles.actionText, { color: theme.danger }]}>Delete</Text>
                  </Pressable>
                </View>
              </Pressable>
            );
          }}
          ListEmptyComponent={
            <EmptyState
              icon={MapPin}
              title="No addresses saved"
              message="Add a delivery address to continue with your order."
            />
          }
        />
      )}

      {!loading && !error ? (
        <View
          style={[
            styles.footer,
            {
              backgroundColor: theme.surface,
              borderTopColor: theme.border,
              paddingBottom: Math.max(insets.bottom, Spacing.three),
            },
          ]}>
          <PrimaryButton
            label="Add New Address"
            variant="outline"
            onPress={() => router.push("/add-address")}
          />
          <PrimaryButton
            label="Proceed to Checkout"
            onPress={handleCheckout}
            loading={checkingOut}
            disabled={!selectedAddress || addresses.length === 0}
          />
        </View>
      ) : null}
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
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    padding: Spacing.three,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    flexShrink: 1,
  },
  labelChip: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
  },
  labelText: {
    fontSize: 11,
    fontWeight: "700",
  },
  addressLine: {
    fontSize: 13,
    lineHeight: 20,
    marginLeft: 28,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.four,
    marginTop: Spacing.two,
    marginLeft: 28,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    minHeight: 32,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "700",
  },
  footer: {
    padding: Spacing.three,
    gap: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
