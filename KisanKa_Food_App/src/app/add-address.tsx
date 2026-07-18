import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton, ScreenHeader } from "@/components/ui";
import { Radius, Spacing } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/hooks/use-theme";
import { addAddress, updateAddress } from "@/services/addressService";

const ADDRESS_LABELS = ["Home", "Work", "Other"] as const;

export default function AddAddressScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const isEdit = params.edit === "true";

  const [fullName, setFullName] = useState((params.fullName as string) || "");
  const [phone, setPhone] = useState((params.phone as string) || "");
  const [house, setHouse] = useState((params.house as string) || "");
  const [area, setArea] = useState((params.area as string) || "");
  const [landmark, setLandmark] = useState((params.landmark as string) || "");
  const [city, setCity] = useState((params.city as string) || "");
  const [state, setState] = useState((params.state as string) || "");
  const [pincode, setPincode] = useState((params.pincode as string) || "");
  const [label, setLabel] = useState<(typeof ADDRESS_LABELS)[number]>(
    (params.label as (typeof ADDRESS_LABELS)[number]) || "Home",
  );
  const [isDefault, setIsDefault] = useState(params.isDefault === "true");
  const [errors, setErrors] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const incomplete =
    !fullName || !phone || !house || !area || !city || !state || !pincode;

  const saveAddress = async () => {
    const newErrors: any = {};

    if (fullName.trim().length < 3) newErrors.fullName = "Enter valid name";
    if (!/^[6-9]\d{9}$/.test(phone)) newErrors.phone = "Enter valid mobile number";
    if (house.trim() === "") newErrors.house = "House number required";
    if (area.trim() === "") newErrors.area = "Area required";
    if (city.trim() === "") newErrors.city = "City required";
    if (state.trim() === "") newErrors.state = "State required";
    if (!/^\d{6}$/.test(pincode)) newErrors.pincode = "Enter valid pincode";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const addressData = {
      fullName,
      phone,
      house,
      area,
      landmark,
      city,
      state,
      pincode,
      label,
      isDefault,
    };

    try {
      setSaving(true);
      if (isEdit) {
        await updateAddress(user.uid, params.id as string, addressData);
      } else {
        await addAddress(user.uid, addressData);
      }
      router.back();
    } catch {
      Alert.alert("Something went wrong", "Could not save the address. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = [
    styles.input,
    {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      color: theme.text,
    },
  ];

  const fieldError = (key: string) =>
    errors[key] ? (
      <Text style={[styles.error, { color: theme.danger }]} accessibilityRole="alert">
        {errors[key]}
      </Text>
    ) : null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={["top"]}>
      <ScreenHeader title={isEdit ? "Edit Address" : "Add Address"} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Contact</Text>
          <TextInput
            placeholder="Full Name *"
            placeholderTextColor={theme.textMuted}
            value={fullName}
            onChangeText={setFullName}
            style={inputStyle}
            accessibilityLabel="Full name"
          />
          {fieldError("fullName")}

          <TextInput
            placeholder="Phone Number *"
            placeholderTextColor={theme.textMuted}
            keyboardType="number-pad"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
            style={inputStyle}
            accessibilityLabel="Phone number"
          />
          {fieldError("phone")}

          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Address</Text>
          <TextInput
            placeholder="House / Flat No. *"
            placeholderTextColor={theme.textMuted}
            value={house}
            onChangeText={setHouse}
            style={inputStyle}
            accessibilityLabel="House or flat number"
          />
          {fieldError("house")}

          <TextInput
            placeholder="Area *"
            placeholderTextColor={theme.textMuted}
            value={area}
            onChangeText={setArea}
            style={inputStyle}
            accessibilityLabel="Area"
          />
          {fieldError("area")}

          <TextInput
            placeholder="Landmark (optional)"
            placeholderTextColor={theme.textMuted}
            value={landmark}
            onChangeText={setLandmark}
            style={inputStyle}
            accessibilityLabel="Landmark"
          />

          <View style={styles.rowFields}>
            <View style={styles.flex}>
              <TextInput
                placeholder="City *"
                placeholderTextColor={theme.textMuted}
                value={city}
                onChangeText={setCity}
                style={inputStyle}
                accessibilityLabel="City"
              />
              {fieldError("city")}
            </View>
            <View style={styles.flex}>
              <TextInput
                placeholder="State *"
                placeholderTextColor={theme.textMuted}
                value={state}
                onChangeText={setState}
                style={inputStyle}
                accessibilityLabel="State"
              />
              {fieldError("state")}
            </View>
          </View>

          <TextInput
            placeholder="Pincode *"
            placeholderTextColor={theme.textMuted}
            keyboardType="number-pad"
            maxLength={6}
            value={pincode}
            onChangeText={setPincode}
            style={inputStyle}
            accessibilityLabel="Pincode"
          />
          {fieldError("pincode")}

          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Address Type</Text>
          <View style={styles.labelRow}>
            {ADDRESS_LABELS.map((item) => {
              const selected = label === item;
              return (
                <Pressable
                  key={item}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`Address type ${item}`}
                  onPress={() => setLabel(item)}
                  style={[
                    styles.labelChip,
                    {
                      borderColor: theme.primary,
                      backgroundColor: selected ? theme.primary : "transparent",
                    },
                  ]}>
                  <Text
                    style={[
                      styles.labelChipText,
                      { color: selected ? theme.onPrimary : theme.primary },
                    ]}>
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.defaultRow}>
            <Text style={[styles.defaultLabel, { color: theme.text }]}>Make Default Address</Text>
            <Switch
              value={isDefault}
              onValueChange={setIsDefault}
              trackColor={{ false: theme.backgroundSelected, true: theme.primary }}
              accessibilityLabel="Make default address"
            />
          </View>

          <PrimaryButton
            label={isEdit ? "Update Address" : "Save Address"}
            onPress={saveAddress}
            loading={saving}
            disabled={incomplete}
          />
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
    padding: Spacing.three,
    paddingBottom: Spacing.six,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginTop: Spacing.three,
    marginBottom: Spacing.two,
  },
  input: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: Spacing.two,
  },
  error: {
    fontSize: 12,
    marginBottom: Spacing.two,
    marginLeft: Spacing.one,
  },
  rowFields: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  labelRow: {
    flexDirection: "row",
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  labelChip: {
    borderWidth: 1.5,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two + 2,
    minHeight: 44,
    justifyContent: "center",
  },
  labelChipText: {
    fontSize: 14,
    fontWeight: "700",
  },
  defaultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.four,
  },
  defaultLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
});
