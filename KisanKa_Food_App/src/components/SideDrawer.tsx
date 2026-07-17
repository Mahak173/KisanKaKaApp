import { router } from "expo-router";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { useAuth } from "../context/AuthContext";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function SideDrawer({ visible, onClose }: Props) {
  const { user, logout } = useAuth();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.drawer}>
              {/* LOGO */}
              <View style={styles.logoSection}>
                <Text style={styles.logoText}>KisanKa</Text>
              </View>

              {/* MENU ITEMS */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  router.push("/");
                  onClose();
                }}
              >
                <Text style={styles.menuText}>Home</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  router.push("/notifications");
                  onClose();
                }}
              >
                <Text style={styles.menuText}>Notifications</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  router.push("/cart");
                  onClose();
                }}
              >
                <Text style={styles.menuText}>Cart</Text>
              </TouchableOpacity>

              {/* USER SECTION */}
              {!user ? (
                <>
                  <TouchableOpacity
                    style={styles.loginBtn}
                    onPress={() => {
                      router.push("/login");
                      onClose();
                    }}
                  >
                    <Text style={styles.loginText}>Login</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.signupBtn}
                    onPress={() => {
                      router.push("/signup");
                      onClose();
                    }}
                  >
                    <Text style={styles.signupText}>Sign Up</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      router.push("/profile");
                      onClose();
                    }}
                  >
                    <Text style={styles.menuText}>Profile</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.logoutBtn}
                    onPress={() => {
                      logout();
                      router.replace("/");
                      onClose();
                    }}
                  >
                    <Text style={styles.logoutText}>Logout</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* VERSION */}
              <View style={styles.footer}>
                <Text style={styles.version}>Version 1.0</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  drawer: {
    width: "75%",
    height: "100%",
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  logoSection: {
    marginBottom: 35,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 20,
  },

  logoText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#3A6B35",
    textAlign: "center",
  },

  menuItem: {
    paddingVertical: 18,
  },

  menuText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },

  loginBtn: {
    marginTop: 25,
    backgroundColor: "#3A6B35",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  loginText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  signupBtn: {
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: "#3A6B35",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  signupText: {
    color: "#3A6B35",
    fontWeight: "700",
    fontSize: 16,
  },

  logoutBtn: {
    marginTop: 25,
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  footer: {
    marginTop: "auto",
    marginBottom: 30,
  },

  version: {
    textAlign: "center",
    color: "#888",
  },
});
