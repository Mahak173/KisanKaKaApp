import { router } from "expo-router";
import { CheckCircle } from "lucide-react-native";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OrderSuccessScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        padding: 25,
      }}
    >
      <CheckCircle size={110} color="#3A6B35" strokeWidth={1.5} />

      <Text
        style={{
          fontSize: 28,
          fontWeight: "700",
          marginTop: 25,
        }}
      >
        Order Placed!
      </Text>

      <Text
        style={{
          color: "#666",
          fontSize: 16,
          textAlign: "center",
          marginTop: 10,
          lineHeight: 24,
        }}
      >
        Thank you for shopping with KisanKaka Food.
      </Text>

      <Text
        style={{
          color: "#666",
          fontSize: 16,
          textAlign: "center",
          marginTop: 5,
        }}
      >
        Your order has been placed successfully.
      </Text>

      <TouchableOpacity
        onPress={() => router.replace("/")}
        style={{
          marginTop: 40,
          width: "100%",
          backgroundColor: "#3A6B35",
          padding: 18,
          borderRadius: 14,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontWeight: "700",
            fontSize: 17,
          }}
        >
          Continue Shopping
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/product/orders")}
        style={{
          marginTop: 15,
          width: "100%",
          borderWidth: 2,
          borderColor: "#3A6B35",
          padding: 18,
          borderRadius: 14,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#3A6B35",
            fontWeight: "700",
            fontSize: 17,
          }}
        >
          View My Orders
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
