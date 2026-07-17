import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";

import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const { width } = Dimensions.get("window");

const STORE_URL = "fi8c7b-sr.myshopify.com";

const ACCESS_TOKEN = "77cd746e224f8073d6ce029ab0b79b5b";
export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  console.log("DETAIL PAGE ID:", id);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const thumbnailRef = useRef<FlatList<any>>(null);
  useEffect(() => {
    if (!product?.images?.edges?.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex =
          prev === product.images.edges.length - 1 ? 0 : prev + 1;

        // scroll thumbnails properly
        thumbnailRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });

        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [product]);
  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    try {
      const query = `
{
  products(first: 100) {
    edges {
      node {
        id
        title
        description
        vendor
        productType
        availableForSale

        images(first: 10) {
          edges {
            node {
              url
            }
          }
        }

        variants(first: 10) {
          edges {
            node {
              id
              title
              price {
                amount
              }
            }
          }
        }
      }
    }
  }
}
`;
      const response = await fetch(
        `https://${STORE_URL}/api/2025-01/graphql.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN,
          },
          body: JSON.stringify({ query }),
        },
      );

      const json = await response.json();

      console.log("PRODUCT PAGE:", json);

      const allProducts = json?.data?.products?.edges || [];

      console.log("ROUTE ID:", id);

      console.log(
        "PRODUCT IDS:",
        allProducts.map((p: any) => p.node.id),
      );
      const foundProduct = allProducts.find((p: any) => {
        const shopifyId = p.node.id.split("/").pop();
        return shopifyId === String(id);
      });
      console.log("FOUND PRODUCT:", foundProduct?.node?.title);
      console.log(JSON.stringify(foundProduct?.node?.description));
      console.log("FOUND PRODUCT:", foundProduct?.node?.title);

      if (foundProduct) {
        setProduct(foundProduct.node);

        if (foundProduct.node.variants.edges.length > 0) {
          setSelectedVariant(foundProduct.node.variants.edges[0].node);
          setSelectedSize(foundProduct.node.variants.edges[0].node.title);
        }
      } else {
        console.log("Product not found");
      }
    } catch (error) {
      console.log(error);
    }
  };
  if (!product) {
    return (
      <View style={styles.loader}>
        <Text>Loading Product...</Text>
      </View>
    );
  }
  const unitPrice = Number(selectedVariant?.price.amount || 0);

  const totalPrice = unitPrice * quantity;
  return (
    <>
      <Modal
        visible={detailsVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setDetailsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.dragHandle} />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setDetailsVisible(false)}
            >
              <Ionicons name="close-circle" size={30} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Product Details</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={{ marginBottom: 10 }}>Brand: {product.vendor}</Text>
              <Text style={{ marginBottom: 10 }}>
                Product Type: {product.productType}
              </Text>

              <Text
                style={{
                  color: product.availableForSale ? "green" : "red",
                  fontWeight: "700",
                  marginBottom: 20,
                }}
              >
                {product.availableForSale ? "In Stock" : "Out Of Stock"}
              </Text>

              <Text style={styles.description}>{product.description}</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Product</Text>

          <View style={{ width: 28 }} />
        </View>
        <Image
          source={{ uri: product.images.edges[currentIndex]?.node.url }}
          style={styles.mainImage}
        />

        <FlatList
          contentContainerStyle={{
            paddingHorizontal: 15,
            marginTop: 15,
          }}
          ref={thumbnailRef}
          data={product?.images?.edges || []}
          horizontal
          keyExtractor={(_, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => setCurrentIndex(index)}>
              <Image
                source={{ uri: item.node.url }}
                style={[
                  styles.thumbnail,
                  currentIndex === index && {
                    borderWidth: 2,
                    borderColor: "#3A6B35",
                  },
                ]}
              />
            </TouchableOpacity>
          )}
        />
        {/* CONTENT INSIDE SCROLLVIEW */}
        <View style={styles.content}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>₹{totalPrice.toFixed(2)}</Text>
          <Text style={styles.sectionTitle}>Available Sizes</Text>
          <View style={styles.variantContainer}>
            {product?.variants?.edges?.map((variant: any, index: number) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedVariant(variant.node);
                  setSelectedSize(variant.node.title);
                }}
                style={[
                  styles.variantButton,
                  selectedSize === variant.node.title && {
                    backgroundColor: "#3A6B35",
                    borderColor: "#3A6B35",
                  },
                ]}
              >
                <Text
                  style={{
                    color:
                      selectedSize === variant.node.title ? "#fff" : "#3A6B35",
                    borderColor: "#3A6B35",
                  }}
                >
                  {variant.node.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => quantity > 1 && setQuantity(quantity - 1)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#eee",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 22 }}>-</Text>
            </TouchableOpacity>

            <Text
              style={{
                marginHorizontal: 20,
                fontSize: 18,
                fontWeight: "700",
              }}
            >
              {quantity}
            </Text>

            <TouchableOpacity
              onPress={() => setQuantity(quantity + 1)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#3A6B35",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 22 }}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => {
              if (!selectedSize) {
                alert("Please select a size");
                return;
              }
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 15,
                  marginBottom: 15,
                }}
              >
                <TouchableOpacity
                  onPress={() => quantity > 1 && setQuantity(quantity - 1)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: "#eee",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 20 }}>-</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setQuantity(quantity + 1)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: "#3A6B35",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 20,
                    }}
                  >
                    +
                  </Text>
                </TouchableOpacity>
              </View>;

              addToCart({
                id: product.id,
                variantId: selectedVariant.id,
                title: product.title,
                image: product.images.edges[0].node.url,
                price: selectedVariant.price.amount,
                quantity,
                size: selectedSize,
              });

              router.push("/cart");
            }}
          >
            <Text style={styles.cartText}>Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buyButton}
            onPress={async () => {
              // User must be logged in
              if (!user) {
                router.push("/login");
                return;
              }

              // Size must be selected
              if (!selectedSize) {
                Alert.alert(
                  "Select Size",
                  "Please select a size before continuing.",
                );
                return;
              }

              // Create a temporary cart with only this product
              const buyNowItem = {
                ...product,
                size: selectedSize,
                quantity: 1,
              };

              router.push({
                pathname: "/address",
                params: {
                  buyNow: "true",
                  product: JSON.stringify(buyNowItem),
                },
              });
            }}
          >
            <Text style={styles.buyButtonText}>Buy Now</Text>
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>Product Information</Text>
          <View
            style={{
              backgroundColor: "#f8f8f8",
              padding: 15,
              borderRadius: 10,
              marginTop: 10,
            }}
          >
            <Text>Brand: {product.vendor}</Text>
            <Text>Product Type: {product.productType}</Text>

            <Text
              style={{
                color: product.availableForSale ? "green" : "red",
                fontWeight: "700",
                marginTop: 5,
              }}
            >
              {product.availableForSale ? "In Stock" : "Out Of Stock"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.seeMoreButton}
            onPress={() => setDetailsVisible(true)}
          >
            <Text style={styles.seeMoreText}>See More Details</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainImage: {
    width: width - 30,
    height: 420,
    alignSelf: "center",
    borderRadius: 25,
    marginTop: 10,
    resizeMode: "cover",
    backgroundColor: "#f5f5f5",
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 15,
    marginHorizontal: 6,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
    paddingTop: 25,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
  },

  price: {
    fontSize: 20,
    color: "#3A6B35",
    marginTop: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 65,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "#fff",
    height: "80%",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
  },
  dragHandle: {
    width: 50,
    height: 5,
    backgroundColor: "#ddd",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 15,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  cartButton: {
    backgroundColor: "#3A6B35",
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  cartText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  buyButton: {
    backgroundColor: "#000",
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  buyButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  variantContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 15,
  },
  variantButton: {
    borderWidth: 1.5,
    borderColor: "#3A6B35",
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginRight: 12,
    marginBottom: 12,
  },
  seeMoreButton: {
    height: 50,
    borderWidth: 1.5,
    borderColor: "#000",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#fff",
  },
  seeMoreText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  // all other styles...
});
