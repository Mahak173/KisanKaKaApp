import { useRouter } from "expo-router";
import { CircleCheck } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/ui";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export default function OrderSuccessScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={[styles.iconOuter, { backgroundColor: theme.primarySoft }]}>
          <CircleCheck size={72} color={theme.primary} strokeWidth={1.5} />
        </View>

        <Text style={[styles.title, { color: theme.text }]} accessibilityRole="header">
          Order Placed!
        </Text>
        <Text style={[styles.message, { color: theme.textSecondary }]}>
          Thank you for shopping with KisanKaka. Your order has been placed successfully.
        </Text>

        <PrimaryButton
          label="View My Orders"
          onPress={() => router.replace("/orders")}
          style={styles.button}
        />
        <PrimaryButton
          label="Continue Shopping"
          variant="outline"
          onPress={() => router.replace("/")}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.five,
  },
  iconOuter: {
    width: 128,
    height: 128,
    borderRadius: 64,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.four,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
  },
  message: {
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
    marginTop: Spacing.two,
    maxWidth: 300,
  },
  button: {
    alignSelf: "stretch",
    marginTop: Spacing.three,
  },
});
