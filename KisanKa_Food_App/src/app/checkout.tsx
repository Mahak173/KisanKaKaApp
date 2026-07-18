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

  const totalPrice = cart.reduce(
    (sum: number, item: any) => sum + Number(item.price) * item.quantity,
    0,
  );

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
          onNavigationStateChange={async (navState) => {
            if (
              !redirected.current &&
              (navState.url.includes("/thank-you") ||
                navState.url.includes("/thank_you") ||
                navState.url.includes("/orders/"))
            ) {
              redirected.current = true;

              try {
                if (user) {
                  await placeOrder(
                    {
                      products: cart,
                      address: selectedAddress,
                      total: totalPrice,
                      paymentStatus: "Paid",
                      orderStatus: "Placed",
                    },
                    user.uid,
                  );
                }

                clearCart();
                router.replace("/order-success");
              } catch {
                // Payment already succeeded on Shopify — still take the user forward.
                clearCart();
                router.replace("/order-success");
              }
            }
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
