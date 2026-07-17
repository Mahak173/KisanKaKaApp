import { useEffect } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

import { useAuth } from "../../context/AuthContext";
import { useOrders } from "../../context/OrderContext";

export default function Orders() {
  const { orders, loadOrders } = useOrders();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadOrders(user.uid);
    }
  }, [user]);

  const renderOrder = ({ item }: any) => {
    return (
      <View style={styles.card}>
        <Text style={styles.status}>{item.orderStatus || "Placed"}</Text>

        <Text style={styles.payment}>Payment : {item.paymentStatus}</Text>

        <Text style={styles.total}>Total : ₹{item.total}</Text>

        {item.products?.map((product: any, index: number) => (
          <View key={index} style={styles.productRow}>
            <Image
              source={{
                uri:
                  product.image ||
                  product.images?.[0]?.url ||
                  "https://via.placeholder.com/70",
              }}
              style={styles.image}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{product.title}</Text>

              <Text>Qty : {product.quantity}</Text>

              <Text>₹{product.price}</Text>
            </View>
          </View>
        ))}

        {item.address && (
          <>
            <Text style={styles.addressTitle}>Delivery Address</Text>

            <Text>{item.address.name}</Text>

            <Text>{item.address.phone}</Text>

            <Text>{item.address.address}</Text>

            <Text>
              {item.address.city}, {item.address.state}
            </Text>

            <Text>{item.address.pincode}</Text>
          </>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No Orders Yet</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
    padding: 15,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },

  status: {
    fontSize: 18,
    fontWeight: "700",
    color: "green",
  },

  payment: {
    marginTop: 5,
    fontWeight: "600",
  },

  total: {
    marginTop: 5,
    marginBottom: 12,
    fontWeight: "700",
    fontSize: 16,
  },

  productRow: {
    flexDirection: "row",
    marginBottom: 12,
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },

  name: {
    fontWeight: "700",
    fontSize: 15,
  },

  addressTitle: {
    marginTop: 10,
    fontWeight: "700",
  },

  empty: {
    marginTop: 100,
    alignItems: "center",
  },

  emptyText: {
    fontSize: 18,
    color: "gray",
  },
});
