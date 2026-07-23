import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function sendOrderPlacedNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Order Placed Successfully",
      body: "Thank you for shopping with Kisan Ka Ka. Your order has been placed successfully.",
    },
    trigger: null,
  });
  console.log("Notification scheduled");
}