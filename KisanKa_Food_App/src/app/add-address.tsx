import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { addAddress, updateAddress } from "../services/addressService";
export default function AddAddressScreen() {
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const input = {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
  };
  const [fullName, setFullName] = useState((params.fullName as string) || "");
  const [phone, setPhone] = useState((params.phone as string) || "");
  const [house, setHouse] = useState((params.house as string) || "");
  const [area, setArea] = useState((params.area as string) || "");
  const [landmark, setLandmark] = useState((params.landmark as string) || "");
  const [city, setCity] = useState((params.city as string) || "");
  const [state, setState] = useState((params.state as string) || "");
  const [pincode, setPincode] = useState((params.pincode as string) || "");

  const [label, setLabel] = useState((params.label as string) || "Home");

  const [isDefault, setIsDefault] = useState(params.isDefault === "true");

  const [errors, setErrors] = useState<any>({});
  const saveAddress = async () => {
    const newErrors: any = {};

    if (fullName.trim().length < 3) newErrors.fullName = "Enter valid name";

    if (!/^[6-9]\d{9}$/.test(phone))
      newErrors.phone = "Enter valid mobile number";

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

    if (params.edit === "true") {
      await updateAddress(user.uid, params.id as string, addressData);
    } else {
      await addAddress(user.uid, addressData);
    }

    router.back();
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text style={styles.title}>
        {params.edit === "true" ? "Edit Address" : "Add Address"}
      </Text>

      <TextInput
        placeholder="Full Name *"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
      />

      {errors.fullName && <Text style={styles.error}>{errors.fullName}</Text>}

      <TextInput
        placeholder="Phone Number *"
        keyboardType="number-pad"
        maxLength={10}
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
      />

      {errors.phone && <Text style={styles.error}>{errors.phone}</Text>}

      <TextInput
        placeholder="House / Flat No."
        value={house}
        onChangeText={setHouse}
        style={input}
      />

      <TextInput
        placeholder="Area"
        value={area}
        onChangeText={setArea}
        style={input}
      />

      <TextInput
        placeholder="Landmark"
        value={landmark}
        onChangeText={setLandmark}
        style={input}
      />

      <TextInput
        placeholder="City"
        value={city}
        onChangeText={setCity}
        style={input}
      />

      <TextInput
        placeholder="State"
        value={state}
        onChangeText={setState}
        style={input}
      />

      <TextInput
        placeholder="Pincode *"
        keyboardType="number-pad"
        maxLength={6}
        value={pincode}
        onChangeText={setPincode}
        style={styles.input}
      />

      {errors.pincode && <Text style={styles.error}>{errors.pincode}</Text>}
      <Text style={styles.label}>Address Type</Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        {["Home", "Work", "Other"].map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setLabel(item)}
            style={[styles.typeButton, label === item && styles.selectedType]}
          >
            <Text
              style={{
                color: label === item ? "white" : "#3A6B35",
                fontWeight: "600",
              }}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 25,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          Make Default Address
        </Text>

        <Switch
          value={isDefault}
          onValueChange={setIsDefault}
          trackColor={{
            false: "#ccc",
            true: "#3A6B35",
          }}
        />
      </View>
      <TouchableOpacity
        onPress={saveAddress}
        disabled={
          !fullName || !phone || !house || !area || !city || !state || !pincode
        }
        style={[
          styles.saveBtn,
          {
            opacity:
              !fullName ||
              !phone ||
              !house ||
              !area ||
              !city ||
              !state ||
              !pincode
                ? 0.5
                : 1,
          },
        ]}
      >
        <Text style={styles.saveText}>Save Address</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 25,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 14,
    padding: 15,
    fontSize: 16,
    marginBottom: 5,
    backgroundColor: "#fafafa",
  },

  error: {
    color: "red",
    marginBottom: 12,
    marginLeft: 4,
  },

  label: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },

  typeButton: {
    borderWidth: 1,
    borderColor: "#3A6B35",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },

  selectedType: {
    backgroundColor: "#3A6B35",
  },

  saveBtn: {
    backgroundColor: "#3A6B35",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 40,
  },

  saveText: {
    color: "white",
    fontWeight: "700",
    fontSize: 17,
  },
});
