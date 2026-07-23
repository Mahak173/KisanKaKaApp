import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import * as Notifications from "expo-notifications";

import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { OrderProvider } from "../context/OrderContext";
import { WishlistProvider } from "../context/WishlistContext";

export default function RootLayout() {
  useEffect(() => {
  async function requestPermission() {
      const { status } = await Notifications.requestPermissionsAsync();

      if (status !== "granted") {
        console.log("Notification permission not granted");
      }
    }

    requestPermission();
  }, []);

  return (
    <AuthProvider>
      <WishlistProvider>
        <OrderProvider>
          <CartProvider>
            <StatusBar style="auto" />
            <Stack
              screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
              }}
            >
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="login" options={{ animation: "slide_from_bottom" }} />
              <Stack.Screen name="order-success" options={{ gestureEnabled: false }} />
            </Stack>
          </CartProvider>
        </OrderProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
