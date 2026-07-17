import { router, useLocalSearchParams } from "expo-router";
import { useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";

export default function Checkout() {
  const { url, address } = useLocalSearchParams();

  const redirected = useRef(false);

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
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        source={{ uri: checkoutUrl }}
        style={{ flex: 1 }}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        injectedJavaScriptBeforeContentLoaded={injectedJS}
        onNavigationStateChange={async (navState) => {
          console.log("CURRENT URL:", navState.url);

          if (
            !redirected.current &&
            (navState.url.includes("/thank-you") ||
              navState.url.includes("/thank_you") ||
              navState.url.includes("/orders/"))
          ) {
            console.log("SUCCESS URL DETECTED");

            redirected.current = true;

            try {
              console.log("USER:", user);
              console.log("CART:", cart);
              console.log("ADDRESS:", selectedAddress);

              if (user) {
                console.log("Calling placeOrder...");

                const orderId = await placeOrder(
                  {
                    products: cart,
                    address: selectedAddress,
                    total: totalPrice,
                    paymentStatus: "Paid",
                    orderStatus: "Placed",
                  },
                  user.uid,
                );

                console.log("Order saved successfully:", orderId);
              } else {
                console.log("User is NULL");
              }

              clearCart();

              router.replace("/order-success");
            } catch (error) {
              console.log("ORDER ERROR:", error);
            }
          }
        }}
      />
    </SafeAreaView>
  );
}
