import { sendPasswordResetEmail } from "@react-native-firebase/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton, ScreenHeader } from "@/components/ui";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { auth } from "@/firebase/firebaseConfig";

export default function ForgotPassword() {
  const theme = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email.trim());

      Alert.alert(
        "Email Sent",
        "A password reset link has been sent to your email.",
        [{ text: "OK", onPress: () => router.replace("/login") }],
      );
    } catch (error: any) {
      let message = "Something went wrong.";

      switch (error.code) {
        case "auth/user-not-found":
          message = "No account found with this email.";
          break;
        case "auth/invalid-email":
          message = "Invalid email address.";
          break;
        default:
          message = error.message;
      }

      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={["top"]}>
      <ScreenHeader title="" transparent />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Text style={[styles.title, { color: theme.text }]} accessibilityRole="header">
            Forgot Password
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Enter your registered email address and we&apos;ll send you a reset link.
          </Text>

          <TextInput
            placeholder="Email Address"
            placeholderTextColor={theme.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            style={[
              styles.input,
              { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text },
            ]}
            accessibilityLabel="Email address"
          />

          <PrimaryButton label="Send Reset Link" onPress={handleResetPassword} loading={loading} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: Spacing.four,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: Spacing.two,
    marginBottom: Spacing.four,
  },
  input: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: Spacing.three,
  },
});
