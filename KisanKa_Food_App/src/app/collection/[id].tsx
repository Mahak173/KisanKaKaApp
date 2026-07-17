import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const SHOP_URL = "fi8c7b-sr.myshopify.com";

export default function CollectionScreen() {
  const { id } = useLocalSearchParams();

  const [products, setProducts] = useState<any[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    getCollectionProducts();
  }, []);

  const getCollectionProducts = async () => {
    try {
      const response = await fetch(
        `https://${SHOP_URL}/collections/${id}/products.json`,
      );

      const data = await response.json();

      setProducts(data.products || []);

      setTitle(String(id).replace(/-/g, " "));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{title}</Text>

      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/product/${item.id}`)}
          >
            <Image
              source={{
                uri: item.images?.[0]?.src,
              }}
              style={styles.image}
            />

            <Text numberOfLines={2} style={styles.title}>
              {item.title}
            </Text>

            <Text style={styles.price}>₹{item.variants?.[0]?.price}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
  },

  heading: {
    fontSize: 28,
    fontWeight: "700",
    paddingHorizontal: 15,
    marginBottom: 20,
    textTransform: "capitalize",
  },

  row: {
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },

  card: {
    width: "48%",
    marginBottom: 20,
  },

  image: {
    width: "100%",
    height: 220,
    borderRadius: 20,
    backgroundColor: "#f2f2f2",
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
  },

  price: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 5,
  },
});
