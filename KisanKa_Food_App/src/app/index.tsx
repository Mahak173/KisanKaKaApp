import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Bell,
  Home,
  Menu,
  Search,
  ShoppingCart,
  User,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SideDrawer from "../components/SideDrawer";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { getCollections, getProducts } from "../services/shopify";
const { width } = Dimensions.get("window");
const HomeScreen = () => {
  const { toggleWishlist, isFavourite } = useWishlist();
  const { cart } = useCart();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const banners = [
    require("../../assets/images/banner1.webp"),
    require("../../assets/images/banner2.webp"),
    require("../../assets/images/banner3.webp"),
    require("../../assets/images/banner4.webp"),
    require("../../assets/images/banner5.webp"),
  ];
  const [activeBanner, setActiveBanner] = useState(0);
  const bannerRef = useRef<FlatList>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex =
        activeBanner === banners.length - 1 ? 0 : activeBanner + 1;

      bannerRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      setActiveBanner(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeBanner]);
  const loadData = async () => {
    const productData = await getProducts();
    const collectionData = await getCollections();

    setProducts(productData);
    setCollections(collectionData);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SideDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          {/* Menu */}
          <TouchableOpacity onPress={() => setDrawerVisible(true)}>
            <Menu size={28} color="#000" />
          </TouchableOpacity>

          {/* Logo */}
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
          />

          {/* Right Icons */}
          <View style={styles.headerIcons}>
            <TouchableOpacity
              onPress={() => router.push("/search")}
              style={{ marginRight: 18 }}
            >
              <Search size={26} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/cart")}
              style={{ position: "relative" }}
            >
              <ShoppingCart size={28} color="#000" />

              {cart.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cart.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* BANNER */}
        <FlatList
          ref={bannerRef}
          data={banners}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.bannerContainer}>
              <Image source={item} style={styles.banner} resizeMode="stretch" />
            </View>
          )}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 10,
            marginBottom: 20,
          }}
        >
          {banners.map((_, index) => (
            <View
              key={index}
              style={{
                width: activeBanner === index ? 20 : 8,
                height: 8,
                borderRadius: 10,
                backgroundColor: activeBanner === index ? "#3A6B35" : "#ccc",
                marginHorizontal: 4,
              }}
            />
          ))}
        </View>

        {/* CATEGORIES */}
        <FlatList
          data={collections}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 25 }}
          contentContainerStyle={{ paddingHorizontal: 15 }}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => router.push(`/collection/${item.handle}`)}
            >
              <Image
                source={{
                  uri: item.image?.src || "https://via.placeholder.com/300",
                }}
                style={styles.categoryImage}
              />

              <View style={styles.overlay} />

              <Text style={styles.categoryText}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />

        {/* PRODUCTS */}
        <Text style={styles.sectionTitle}>Featured Products</Text>

        <FlatList
          data={products}
          scrollEnabled={false}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productCard}
              onPress={() => router.push(`/product/${item.id}`)}
            >
              <View>
                <Image
                  source={{
                    uri: item.images[0]?.src,
                  }}
                  style={styles.productImage}
                />

                <TouchableOpacity
                  style={styles.heartBtn}
                  onPress={() =>
                    toggleWishlist({
                      id: item.id,
                      variantId: item.variants[0]?.id,
                      title: item.title,
                      price: item.variants[0]?.price,
                      image: item.images[0]?.src,
                    })
                  }
                >
                  <Ionicons
                    name={isFavourite(item.id) ? "heart" : "heart-outline"}
                    size={24}
                    color={isFavourite(item.id) ? "red" : "#666"}
                  />
                </TouchableOpacity>
              </View>

              <Text numberOfLines={2} style={styles.productTitle}>
                {item.title}
              </Text>

              <Text style={styles.price}>₹{item.variants[0]?.price}</Text>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
      {/* BOTTOM NAV */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bottomItem}
          onPress={() => router.push("/")}
        >
          <Home size={24} color="#3A6B35" />
          <Text style={[styles.bottomText, { color: "#3A6B35" }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomItem}
          onPress={() => router.push("/notifications")}
        >
          <Bell size={24} color="#000" />
          <Text style={styles.bottomText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomItem}
          onPress={() => router.push("/profile")}
        >
          <User size={24} color="#000" />
          <Text style={styles.bottomText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },

  logo: {
    width: 55,
    height: 55,
    resizeMode: "contain",
  },

  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },

  categoryCard: {
    width: 170,
    height: 190,
    borderRadius: 25,
    overflow: "hidden",
    marginRight: 15,
  },

  categoryImage: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  categoryText: {
    position: "absolute",
    bottom: 20,
    left: 15,
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    paddingHorizontal: 15,
    marginBottom: 15,
  },

  row: {
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },

  productCard: {
    width: "48%",
    marginBottom: 25,
  },

  productImage: {
    width: "100%",
    height: 240,
    borderRadius: 25,
    backgroundColor: "#f2f2f2",
  },

  heartBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#fff",
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },

  productTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
    color: "#000",
  },

  price: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 6,
    color: "#000",
  },

  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 18,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },

  bottomItem: {
    alignItems: "center",
    justifyContent: "center",
  },

  bottomText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "600",
  },

  bannerContainer: {
    width: width,
    alignItems: "center",
    justifyContent: "center",
  },

  banner: {
    width: width - 30,
    height: 220,
    borderRadius: 20,
  },
  badge: {
    position: "absolute",
    right: -8,
    top: -8,
    backgroundColor: "red",
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },

  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});
export default HomeScreen;
