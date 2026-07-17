import { router } from "expo-router";
import { Trash2 } from "lucide-react-native";
import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
export default function CartScreen() {
  const { cart, removeFromCart, increaseQty, decreaseQty } = useCart();
  const { user } = useAuth();
  const totalPrice = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#f5f5f5",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 55,
          paddingBottom: 15,
          paddingHorizontal: 20,
          backgroundColor: "#fff",
          borderBottomWidth: 1,
          borderBottomColor: "#eee",
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "600",
            }}
          >
            ←
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 22,
            fontWeight: "700",
          }}
        >
          My Cart
        </Text>

        <View style={{ width: 24 }} />
      </View>
      {cart.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            Cart is Empty
          </Text>

          <Text
            style={{
              color: "#666",
              marginBottom: 20,
            }}
          >
            Add some products to continue shopping
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/")}
            style={{
              backgroundColor: "#3A6B35",
              paddingHorizontal: 25,
              paddingVertical: 12,
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              Continue Shopping
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  router.push(`/product/${item.id.split("/").pop()}`)
                }
                style={{
                  flexDirection: "row",
                  marginBottom: 15,
                  backgroundColor: "#fff",
                  padding: 12,
                  borderRadius: 12,
                  elevation: 2,
                }}
              >
                <Image
                  source={{ uri: item.image }}
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: 10,
                  }}
                />

                <View style={{ marginLeft: 15, flex: 1 }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    {item.title}
                  </Text>

                  <Text
                    style={{
                      marginTop: 6,
                      color: "#3A6B35",
                      fontWeight: "700",
                    }}
                  >
                    ₹{item.price}
                  </Text>
                  <Text
                    style={{
                      marginTop: 4,
                      color: "#666",
                      fontSize: 14,
                    }}
                  >
                    Size: {item.size}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => decreaseQty(item.id)}
                      style={{
                        padding: 8,
                        backgroundColor: "#eee",
                        borderRadius: 5,
                      }}
                    >
                      <Text>-</Text>
                    </TouchableOpacity>

                    <Text
                      style={{
                        marginHorizontal: 12,
                        fontWeight: "bold",
                      }}
                    >
                      {item.quantity}
                    </Text>

                    <TouchableOpacity
                      onPress={() => increaseQty(item.id)}
                      style={{
                        padding: 8,
                        backgroundColor: "#eee",
                        borderRadius: 5,
                      }}
                    >
                      <Text>+</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => removeFromCart(item.id, item.size)}
                      style={{
                        marginLeft: "auto",
                      }}
                    >
                      <Trash2 size={20} color="red" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />

          <View
            style={{
              paddingTop: 15,
              borderTopWidth: 1,
              borderColor: "#ddd",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 15,
              }}
            >
              Total: ₹{totalPrice}
            </Text>

            <TouchableOpacity
              onPress={() => router.push("/")}
              style={{
                backgroundColor: "#3A6B35",
                padding: 15,
                borderRadius: 10,
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "700",
                }}
              >
                Continue Shopping
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (!user) {
                  Alert.alert(
                    "Login Required",
                    "Please login to continue to checkout.",
                    [
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                      {
                        text: "Login",
                        onPress: () => router.push("/login"),
                      },
                    ],
                  );
                  return;
                }

                router.push("/address");
              }}
              style={{
                backgroundColor: "#111",
                padding: 15,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "700",
                }}
              >
                Proceed To Checkout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
