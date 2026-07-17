import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { OrderProvider } from "../context/OrderContext";
import { WishlistProvider } from "../context/WishlistContext";
export default function RootLayout() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <OrderProvider>
          <CartProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </CartProvider>
        </OrderProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
