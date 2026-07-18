import { useRouter } from "expo-router";
import { MapPin, Package, UserRound } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppImage, EmptyState, ScreenHeader, Skeleton, StateView } from "@/components/ui";
import { Radius, Shadows, Spacing } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrderContext";
import { useTheme } from "@/hooks/use-theme";
import { formatPrice } from "@/utils/format";

const formatOrderDate = (createdAt: any) => {
  if (!createdAt?.seconds) return "";
  return new Date(createdAt.seconds * 1000).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function OrdersScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { orders, loadOrders } = useOrders();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const statusColor = (status: string) => {
    switch ((status || "").toLowerCase()) {
      case "delivered":
        return { bg: theme.successSoft, fg: theme.success };
      case "cancelled":
        return { bg: theme.dangerSoft, fg: theme.danger };
      case "shipped":
        return { bg: theme.accentSoft, fg: theme.accent };
      default:
        return { bg: theme.primarySoft, fg: theme.primary };
    }
  };

  const refresh = useCallback(async () => {
    if (user) {
      await loadOrders(user.uid);
    }
    // loadOrders is provided by OrderContext and is stable per provider render cycle
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  if (!user) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={["top"]}>
        <ScreenHeader title="My Orders" showBack={false} />
        <StateView
          icon={UserRound}
          title="Login to view your orders"
          message="Track deliveries and see your order history."
          actionLabel="Login"
          onAction={() => router.push("/login")}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={["top"]}>
      <ScreenHeader title="My Orders" showBack={false} />

      {loading ? (
        <View style={styles.skeletons}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} height={160} radius={Radius.lg} />
          ))}
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
          }
          renderItem={({ item }) => {
            const status = item.orderStatus || "Placed";
            const colors = statusColor(status);
            const orderDate = formatOrderDate(item.createdAt);
            const address = item.address;
            return (
              <View style={[styles.card, { backgroundColor: theme.surface }, Shadows.card]}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <Text style={[styles.orderId, { color: theme.text }]} numberOfLines={1}>
                      Order #{String(item.id).slice(0, 8).toUpperCase()}
                    </Text>
                    {orderDate ? (
                      <Text style={[styles.orderDate, { color: theme.textMuted }]}>
                        {orderDate}
                      </Text>
                    ) : null}
                  </View>
                  <View style={[styles.statusChip, { backgroundColor: colors.bg }]}>
                    <Text style={[styles.statusText, { color: colors.fg }]}>{status}</Text>
                  </View>
                </View>

                {item.products?.map((product: any, index: number) => (
                  <View key={index} style={styles.productRow}>
                    <AppImage
                      source={
                        product.image || product.images?.[0]?.url
                          ? { uri: product.image || product.images?.[0]?.url }
                          : undefined
                      }
                      style={styles.productImage}
                      accessibilityIgnoresInvertColors
                    />
                    <View style={styles.productInfo}>
                      <Text style={[styles.productTitle, { color: theme.text }]} numberOfLines={2}>
                        {product.title}
                      </Text>
                      <Text style={[styles.productMeta, { color: theme.textSecondary }]}>
                        Qty {product.quantity} • {formatPrice(product.price)}
                      </Text>
                    </View>
                  </View>
                ))}

                <View style={[styles.cardFooter, { borderTopColor: theme.border }]}>
                  <Text style={[styles.paymentStatus, { color: theme.textSecondary }]}>
                    Payment: {item.paymentStatus || "—"}
                  </Text>
                  <Text style={[styles.total, { color: theme.text }]}>
                    {formatPrice(item.total)}
                  </Text>
                </View>

                {address ? (
                  <View style={[styles.addressBlock, { backgroundColor: theme.backgroundElement }]}>
                    <MapPin size={16} color={theme.primary} style={styles.addressIcon} />
                    <View style={styles.addressText}>
                      <Text style={[styles.addressName, { color: theme.text }]}>
                        {address.fullName || address.name}
                      </Text>
                      <Text style={[styles.addressLine, { color: theme.textSecondary }]}>
                        {[address.house, address.area, address.landmark, address.address]
                          .filter(Boolean)
                          .join(", ")}
                      </Text>
                      <Text style={[styles.addressLine, { color: theme.textSecondary }]}>
                        {[address.city, address.state].filter(Boolean).join(", ")}
                        {address.pincode ? ` - ${address.pincode}` : ""}
                      </Text>
                      {address.phone ? (
                        <Text style={[styles.addressLine, { color: theme.textSecondary }]}>
                          {address.phone}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                ) : null}
              </View>
            );
          }}
          ListEmptyComponent={
            <EmptyState
              icon={Package}
              title="No Orders Yet"
              message="When you place an order, it will show up here."
              actionLabel="Start Shopping"
              onAction={() => router.push("/")}
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
  card: {
    borderRadius: Radius.lg,
    padding: Spacing.three,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.three,
    gap: Spacing.two,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  orderId: {
    fontSize: 15,
    fontWeight: "800",
  },
  orderDate: {
    fontSize: 12,
    marginTop: 2,
  },
  statusChip: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  productRow: {
    flexDirection: "row",
    gap: Spacing.three,
    marginBottom: Spacing.two,
  },
  productImage: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
  },
  productInfo: {
    flex: 1,
    justifyContent: "center",
  },
  productTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  productMeta: {
    fontSize: 13,
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.two,
    marginTop: Spacing.one,
  },
  paymentStatus: {
    fontSize: 13,
    fontWeight: "600",
  },
  total: {
    fontSize: 16,
    fontWeight: "800",
  },
  addressBlock: {
    flexDirection: "row",
    gap: Spacing.two,
    borderRadius: Radius.md,
    padding: Spacing.three,
    marginTop: Spacing.three,
  },
  addressIcon: {
    marginTop: 2,
  },
  addressText: {
    flex: 1,
  },
  addressName: {
    fontSize: 13,
    fontWeight: "700",
  },
  addressLine: {
    fontSize: 12,
    lineHeight: 18,
  },
});
