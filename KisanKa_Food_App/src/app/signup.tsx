import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "@react-native-firebase/auth";
import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
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

export default function Signup() {
  const theme = useTheme();
  const router = useRouter();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !mobile || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (mobile.length !== 10) {
      Alert.alert("Error", "Enter a valid mobile number");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      await updateProfile(userCredential.user, {
        displayName: name,
      });

      Alert.alert("Success", "Account created successfully!", [
        { text: "OK", onPress: () => router.replace("/login") },
      ]);
    } catch (error: any) {
      let message = "Something went wrong.";

      switch (error.code) {
        case "auth/email-already-in-use":
          message = "This email is already registered.";
          break;
        case "auth/invalid-email":
          message = "Please enter a valid email address.";
          break;
        case "auth/weak-password":
          message = "Password should be at least 6 characters.";
          break;
        default:
          message = error.message;
      }

      Alert.alert("Signup Failed", message);
    } finally {
      setLoading(false);
    }
  };

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
          <Text style={[styles.title, { color: theme.text }]} accessibilityRole="header">
            Create Account
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Sign up to continue shopping
          </Text>

          <TextInput
            placeholder="Full Name"
            placeholderTextColor={theme.textMuted}
            value={name}
            onChangeText={setName}
            style={inputStyle}
            accessibilityLabel="Full name"
          />

          <TextInput
            placeholder="Mobile Number"
            placeholderTextColor={theme.textMuted}
            keyboardType="phone-pad"
            maxLength={10}
            value={mobile}
            onChangeText={setMobile}
            style={inputStyle}
            accessibilityLabel="Mobile number"
          />

          <TextInput
            placeholder="Email Address"
            placeholderTextColor={theme.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            style={inputStyle}
            accessibilityLabel="Email address"
          />

          <View
            style={[
              styles.passwordContainer,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}>
            <TextInput
              placeholder="Password"
              placeholderTextColor={theme.textMuted}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              style={[styles.passwordInput, { color: theme.text }]}
              accessibilityLabel="Password"
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={showPassword ? "Hide password" : "Show password"}
              hitSlop={8}
              onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff size={20} color={theme.textMuted} />
              ) : (
                <Eye size={20} color={theme.textMuted} />
              )}
            </Pressable>
          </View>

          <View
            style={[
              styles.passwordContainer,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}>
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor={theme.textMuted}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={[styles.passwordInput, { color: theme.text }]}
              accessibilityLabel="Confirm password"
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={showConfirmPassword ? "Hide password" : "Show password"}
              hitSlop={8}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? (
                <EyeOff size={20} color={theme.textMuted} />
              ) : (
                <Eye size={20} color={theme.textMuted} />
              )}
            </Pressable>
          </View>

          <PrimaryButton
            label="Create Account"
            onPress={handleSignup}
            loading={loading}
            style={styles.submit}
          />

          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace("/login")}
            style={({ pressed }) => [styles.linkWrap, pressed && { opacity: 0.6 }]}>
            <Text style={[styles.linkMuted, { color: theme.textSecondary }]}>
              Already have an account?{" "}
              <Text style={[styles.link, { color: theme.primary }]}>Login</Text>
            </Text>
          </Pressable>
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
    marginTop: Spacing.one,
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.three,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
  },
  submit: {
    marginTop: Spacing.two,
  },
  linkWrap: {
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.three,
  },
  link: {
    fontWeight: "700",
  },
  linkMuted: {
    fontSize: 14,
  },
});
