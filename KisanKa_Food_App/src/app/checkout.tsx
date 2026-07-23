import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

import { ScreenHeader } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrderContext";
import { useTheme } from "@/hooks/use-theme";
import { sendOrderPlacedNotification } from "@/services/notificationServices";

export default function Checkout() {
  const theme = useTheme();
  const router = useRouter();
  const { url, address } = useLocalSearchParams();

  const redirected = useRef(false);
  const [loading, setLoading] = useState(true);

  const { placeOrder } = useOrders();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();

  const selectedAddress = address ? JSON.parse(String(address)) : null;
  const checkoutUrl = decodeURIComponent(String(url));
const totalPrice = cart.reduce( (sum: number, item: any) => sum + Number(item.price) * item.quantity, 0, );

  const injectedJS = `
(function() {
  const style = document.createElement("style");
  style.innerHTML = \`
    footer{display:none !important;}
    .footer{display:none !important;}
    [role="contentinfo"]{display:none !important;}
    .policy-links{display:none !important;}
  \`;
  document.head.appendChild(style);
})();
true;
`;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={["top"]}>
      <ScreenHeader title="Checkout" />
      <View style={styles.webviewWrap}>
        <WebView
          source={{ uri: checkoutUrl }}
          style={styles.webview}
          javaScriptEnabled
          domStorageEnabled
          sharedCookiesEnabled
          thirdPartyCookiesEnabled
          injectedJavaScriptBeforeContentLoaded={injectedJS}
          onLoadEnd={() => setLoading(false)}
           onShouldStartLoadWithRequest={(request) => {
    const url = request.url;

    console.log("REQUEST:", url);

    if (
      !redirected.current &&
      (
        url.includes("/thank-you") ||
        url.includes("/thank_you")
      )
    ) {
      redirected.current = true;

      (async () => {
        try {
          if (user) {
            await placeOrder(
              {
                products: cart,
                address: selectedAddress,
                total: totalPrice,
                orderStatus: "Placed",
              },
              user.uid
            );
          }

          await sendOrderPlacedNotification();
          clearCart();
          router.replace("/order-success");
        } catch {
          clearCart();
          router.replace("/order-success");
        }
      })();

      return false; // Stop Shopify Thank You page
    }

    return true;
  }}
/>
        {loading ? (
          <View style={[styles.loader, { backgroundColor: theme.background }]}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  webviewWrap: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
