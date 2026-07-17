import { router } from "expo-router";
import { Heart } from "lucide-react-native";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { useWishlist } from "../context/WishlistContext";

export default function WishlistScreen() {
  const { wishlist, toggleWishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <Heart size={60} color="#ccc" />

        <Text
          style={{
            fontSize: 22,
            fontWeight: "700",
            marginTop: 20,
          }}
        >
          Wishlist is Empty
        </Text>

        <Text
          style={{
            color: "#777",
            marginTop: 10,
          }}
        >
          Save products to see them here.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      {/* Header */}

      <View
        style={{
          paddingTop: 55,
          paddingBottom: 18,
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: "#eee",
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "700",
          }}
        >
          My Wishlist
        </Text>
      </View>

      <FlatList
        data={wishlist}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/product/${item.id}`)}
            style={{
              flexDirection: "row",
              padding: 15,
              borderBottomWidth: 1,
              borderBottomColor: "#eee",
            }}
          >
            <Image
              source={{ uri: item.image }}
              style={{
                width: 90,
                height: 90,
                borderRadius: 10,
              }}
            />

            <View
              style={{
                flex: 1,
                marginLeft: 15,
              }}
            >
              <Text
                style={{
                  fontWeight: "700",
                }}
              >
                {item.title}
              </Text>

              <Text
                style={{
                  marginTop: 8,
                  color: "#3A6B35",
                  fontWeight: "700",
                }}
              >
                ₹{item.price}
              </Text>
            </View>

            <TouchableOpacity onPress={() => toggleWishlist(item)}>
              <Heart fill="red" color="red" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
