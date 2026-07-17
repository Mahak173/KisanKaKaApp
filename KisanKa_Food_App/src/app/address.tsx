import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { deleteAddress, getAddresses } from "../services/addressService";
import { createShopifyCheckout } from "../services/shopify";
export default function SavedAddressScreen() {
  const { user } = useAuth();
  const { cart } = useCart();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const checkoutUrl =
    "https://www.kisankaka.com/checkouts/cn/hWNDtpxdAfZKCtNPX9qhtfk2/en-in?_r=AQABOabc5sd8WMSHPErEVNWGgzRia8H87gU6UTGpTmpkFN0&preview_theme_id=189010477350";

  useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, []);

  const loadAddresses = async () => {
    const data = await getAddresses(user.uid);
    setAddresses(data);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete Address", "Are you sure?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteAddress(user.uid, id);
          loadAddresses();
        },
      },
    ]);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#f5f5f5",
      }}
    >
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: 15,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setSelectedAddress(item)}
            style={{
              backgroundColor:
                selectedAddress?.id === item.id ? "#E8F5E9" : "#fff",
              padding: 15,
              borderRadius: 12,
              marginBottom: 15,
              borderWidth: selectedAddress?.id === item.id ? 2 : 1,
              borderColor: selectedAddress?.id === item.id ? "#3A6B35" : "#ddd",
            }}
          >
            {selectedAddress?.id === item.id && (
              <Text
                style={{
                  color: "#3A6B35",
                  fontWeight: "700",
                  marginBottom: 5,
                }}
              >
                ✓ Selected Address
              </Text>
            )}

            <Text
              style={{
                fontWeight: "700",
                fontSize: 17,
              }}
            >
              {item.fullName}
            </Text>
            <Text>{item.phone}</Text>

            <Text>{item.house}</Text>

            <Text>{item.area}</Text>

            {item.landmark ? <Text>Landmark: {item.landmark}</Text> : null}

            <Text>
              {item.city}, {item.state} - {item.pincode}
            </Text>

            <View
              style={{
                flexDirection: "row",
                marginTop: 15,
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/add-address",
                    params: {
                      edit: "true",
                      id: item.id,
                      fullName: item.fullName,
                      phone: item.phone,
                      house: item.house,
                      area: item.area,
                      landmark: item.landmark,
                      city: item.city,
                      state: item.state,
                      pincode: item.pincode,
                      label: item.label,
                      isDefault: item.isDefault ? "true" : "false",
                    },
                  })
                }
                style={{
                  backgroundColor: "#3A6B35",
                  paddingHorizontal: 18,
                  paddingVertical: 8,
                  borderRadius: 8,
                  marginRight: 10,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                  }}
                >
                  Edit
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                style={{
                  backgroundColor: "red",
                  paddingHorizontal: 18,
                  paddingVertical: 8,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                  }}
                >
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />

      <View
        style={{
          padding: 15,
          backgroundColor: "#fff",
        }}
      >
        <TouchableOpacity
          onPress={() => router.push("/add-address")}
          style={{
            backgroundColor: "#3A6B35",
            padding: 16,
            borderRadius: 12,
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "700",
            }}
          >
            Add New Address
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!selectedAddress}
          onPress={async () => {
            if (!selectedAddress) {
              Alert.alert("Please select an address");
              return;
            }

            if (cart.length === 0) {
              Alert.alert("Cart is empty");
              return;
            }

            const checkoutUrl = await createShopifyCheckout(cart);

            console.log("CHECKOUT URL:", checkoutUrl);

            if (!checkoutUrl) {
              Alert.alert("Unable to create checkout");
              return;
            }
            router.push({
              pathname: "/checkout",
              params: {
                url: encodeURIComponent(checkoutUrl),
                address: JSON.stringify(selectedAddress),
              },
            });
          }}
          style={{
            backgroundColor: selectedAddress ? "#000" : "#999",
            padding: 16,
            borderRadius: 12,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "700",
              fontSize: 16,
            }}
          >
            Proceed to Checkout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
