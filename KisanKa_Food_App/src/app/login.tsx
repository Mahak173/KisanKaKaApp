import React, { useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import auth from "@react-native-firebase/auth";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirm, setConfirm] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function sendOTP() {
    if (!phone.startsWith("+")) {
      Alert.alert("Enter phone number with country code");
      return;
    }

    try {
      setLoading(true);

      const confirmation = await auth().signInWithPhoneNumber(phone);

      setConfirm(confirmation);

      Alert.alert("OTP Sent");
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

      Alert.alert("Login Successful");
    } catch (e: any) {
      Alert.alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phone Login</Text>

      <TextInput
        style={styles.input}
        placeholder="+919876543210"
        value={phone}
        onChangeText={setPhone}
      />

      {!confirm ? (
        <Button
          title={loading ? "Sending..." : "Send OTP"}
          onPress={sendOTP}
        />
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
          />

          <Button
            title={loading ? "Verifying..." : "Verify OTP"}
            onPress={verifyOTP}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
});