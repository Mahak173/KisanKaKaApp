import { signInWithPhoneNumber } from "@react-native-firebase/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton, ScreenHeader } from "@/components/ui";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { auth } from "@/firebase/firebaseConfig";

export default function Login() {
  const theme = useTheme();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirm, setConfirm] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function sendOTP() {
    if (!phone.startsWith("+")) {
      Alert.alert("Invalid Number", "Enter phone number with country code, e.g. +91.");
      return;
    }

    try {
      setLoading(true);
      const confirmation = await signInWithPhoneNumber(auth, phone);
      setConfirm(confirmation);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  }

  async function verifyOTP() {
    if (!confirm) return;

    try {
      setLoading(true);
      await confirm.confirm(otp);
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/");
      }
    } catch {
      Alert.alert("Invalid OTP", "The code you entered is incorrect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = [
    styles.input,
    { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text },
  ];

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
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
            accessibilityLabel="KisanKaka"
          />
          <Text style={[styles.title, { color: theme.text }]} accessibilityRole="header">
            Welcome back
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {confirm
              ? `Enter the OTP sent to ${phone}`
              : "Login with your phone number to continue"}
          </Text>

          {!confirm ? (
            <>
              <TextInput
                style={inputStyle}
                placeholder="Phone number with country code"
                placeholderTextColor={theme.textMuted}
                keyboardType="phone-pad"
                autoComplete="tel"
                value={phone}
                onChangeText={setPhone}
                accessibilityLabel="Phone number with country code"
              />
              <PrimaryButton label="Send OTP" onPress={sendOTP} loading={loading} />
            </>
          ) : (
            <>
              <TextInput
                style={inputStyle}
                placeholder="Enter OTP"
                placeholderTextColor={theme.textMuted}
                keyboardType="number-pad"
                autoComplete="sms-otp"
                value={otp}
                onChangeText={setOtp}
                accessibilityLabel="One time password"
              />
              <PrimaryButton label="Verify OTP" onPress={verifyOTP} loading={loading} />
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setConfirm(null);
                  setOtp("");
                }}
                style={({ pressed }) => [styles.linkWrap, pressed && { opacity: 0.6 }]}>
                <Text style={[styles.link, { color: theme.primary }]}>Change phone number</Text>
              </Pressable>
            </>
          )}

          <View style={styles.footerLinks}>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/signup")}
              style={({ pressed }) => [styles.linkWrap, pressed && { opacity: 0.6 }]}>
              <Text style={[styles.linkMuted, { color: theme.textSecondary }]}>
                New to KisanKaka?{" "}
                <Text style={[styles.link, { color: theme.primary }]}>Create Account</Text>
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/forgot-password")}
              style={({ pressed }) => [styles.linkWrap, pressed && { opacity: 0.6 }]}>
              <Text style={[styles.link, { color: theme.primary }]}>Forgot password?</Text>
            </Pressable>
          </View>
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
  logo: {
    width: 84,
    height: 84,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: Spacing.four,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
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
  linkWrap: {
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    fontSize: 14,
    fontWeight: "700",
  },
  linkMuted: {
    fontSize: 14,
  },
  footerLinks: {
    marginTop: Spacing.four,
  },
});
