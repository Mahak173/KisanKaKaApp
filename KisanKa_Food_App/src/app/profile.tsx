import { router } from "expo-router";
import {
  ChevronRight,
  Heart,
  LogOut,
  MapPin,
  Settings,
  ShoppingBag,
  User,
} from "lucide-react-native";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();

  // If not logged in
  if (!user) {
    return (
      <View style={styles.loginContainer}>
        <User size={80} color="#3A6B35" />

        <Text style={styles.loginTitle}>You're not logged in</Text>

        <Text style={styles.loginSubtitle}>
          Login to view your profile, orders and wishlist.
        </Text>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => {
          logout();
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Header */}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      {/* User Card */}

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <User size={45} color="#fff" />
        </View>

        <Text style={styles.name}>{user.name || "User"}</Text>

        <Text style={styles.email}>{user.email}</Text>

        {user.phone && <Text style={styles.phone}>{user.phone}</Text>}
      </View>

      {/* Menu */}

      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/product/orders")}
        >
          <View style={styles.row}>
            <ShoppingBag color="#3A6B35" />
            <Text style={styles.menuText}>Order History</Text>
          </View>

          <ChevronRight color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/wishlist")}
        >
          <View style={styles.row}>
            <Heart color="red" />
            <Text style={styles.menuText}>Wishlist ({wishlist.length})</Text>
          </View>

          <ChevronRight color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/address")}
        >
          <View style={styles.row}>
            <MapPin color="#3A6B35" />
            <Text style={styles.menuText}>Saved Addresses</Text>
          </View>

          <ChevronRight color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/settings")}
        >
          <View style={styles.row}>
            <Settings color="#3A6B35" />
            <Text style={styles.menuText}>Settings</Text>
          </View>

          <ChevronRight color="#999" />
        </TouchableOpacity>
      </View>

      {/* Logout */}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut color="#fff" size={20} />

        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
  },

  profileCard: {
    backgroundColor: "#fff",
    margin: 15,
    borderRadius: 18,
    padding: 25,
    alignItems: "center",
    elevation: 4,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#3A6B35",
    justifyContent: "center",
    alignItems: "center",
  },

  name: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 15,
  },

  email: {
    color: "#666",
    marginTop: 5,
  },

  phone: {
    color: "#666",
    marginTop: 3,
  },

  menu: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    borderRadius: 18,
    overflow: "hidden",
  },

  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  menuText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: "500",
  },

  logoutButton: {
    margin: 20,
    backgroundColor: "#3A6B35",
    borderRadius: 14,
    padding: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 10,
    fontSize: 16,
  },

  loginContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
    backgroundColor: "#fff",
  },

  loginTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 20,
  },

  loginSubtitle: {
    textAlign: "center",
    color: "#666",
    marginTop: 10,
    marginBottom: 30,
    fontSize: 16,
  },

  loginButton: {
    backgroundColor: "#3A6B35",
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 12,
  },

  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
