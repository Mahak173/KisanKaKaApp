import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Search } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProducts } from "../services/shopify";

export default function SearchScreen() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
    setFilteredProducts(data);
  };

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase()),
    );

    setFilteredProducts(filtered);
  }, [search, products]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
      </View>

      {/* Search Box */}
      <View style={styles.searchBox}>
        <Search size={20} color="#777" />

        <TextInput
          placeholder="Search products..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
          style={styles.input}
        />
      </View>

      {/* Products */}
      <FlatList
        data={filteredProducts}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={{
          justifyContent: "space-between",
        }}
        contentContainerStyle={{
          padding: 15,
          paddingBottom: 100,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/product/${item.id}`)}
          >
            <Image
              source={{
                uri: item.images[0]?.src,
              }}
              style={styles.image}
            />

            <Text numberOfLines={2} style={styles.title}>
              {item.title}
            </Text>

            <Text style={styles.price}>₹{item.variants[0]?.price}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search" size={55} color="#bbb" />
            <Text style={styles.emptyTitle}>No Products Found</Text>
            <Text style={styles.emptySub}>
              Try searching with another keyword.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 55,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 18,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#3A6B35",
  },

  searchContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    marginHorizontal: 15,
    paddingHorizontal: 15,
    borderRadius: 14,
    height: 52,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },

  card: {
    width: "48%",
    marginBottom: 22,
  },

  image: {
    width: "100%",
    height: 220,
    borderRadius: 18,
    backgroundColor: "#f3f3f3",
  },

  title: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
  },

  price: {
    marginTop: 5,
    color: "#3A6B35",
    fontSize: 18,
    fontWeight: "700",
  },

  empty: {
    marginTop: 120,
    alignItems: "center",
  },

  emptyTitle: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: "700",
  },

  emptySub: {
    color: "#777",
    marginTop: 10,
    fontSize: 15,
  },
});
