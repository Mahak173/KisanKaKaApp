import { useRouter } from "expo-router";
import {
  Bell,
  Heart,
  House,
  LayoutGrid,
  LogOut,
  LucideIcon,
  Package,
  UserRound,
} from "lucide-react-native";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/ui";
import { Spacing, TouchTarget } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/hooks/use-theme";

interface Props {
  visible: boolean;
  onClose: () => void;
}

type DrawerItem = {
  icon: LucideIcon;
  label: string;
  route: string;
};

const MENU_ITEMS: DrawerItem[] = [
  { icon: House, label: "Home", route: "/" },
  { icon: LayoutGrid, label: "Categories", route: "/categories" },
  { icon: Package, label: "My Orders", route: "/orders" },
  { icon: Heart, label: "Wishlist", route: "/wishlist" },
  { icon: Bell, label: "Notifications", route: "/notifications" },
];

export default function SideDrawer({ visible, onClose }: Props) {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const go = (route: string) => {
    router.push(route as any);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose} accessibilityLabel="Close menu">
        <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.drawer,
                {
                  backgroundColor: theme.background,
                  paddingTop: insets.top + Spacing.four,
                  paddingBottom: insets.bottom + Spacing.three,
                },
              ]}>
              {/* Brand */}
              <View style={[styles.logoSection, { borderBottomColor: theme.border }]}>
                <Image
                  source={require("@/assets/images/logo.png")}
                  style={styles.logo}
                  accessibilityLabel="KisanKaka"
                />
                {user ? (
                  <Text style={[styles.welcome, { color: theme.textSecondary }]} numberOfLines={1}>
                    Hi, {user.displayName || user.email || "there"}
                  </Text>
                ) : null}
              </View>

              {/* Menu */}
              {MENU_ITEMS.map(({ icon: Icon, label, route }) => (
                <Pressable
                  key={route}
                  accessibilityRole="button"
                  accessibilityLabel={label}
                  onPress={() => go(route)}
                  style={({ pressed }) => [
                    styles.menuItem,
                    pressed && { backgroundColor: theme.backgroundElement },
                  ]}>
                  <Icon size={20} color={theme.primary} strokeWidth={1.8} />
                  <Text style={[styles.menuText, { color: theme.text }]}>{label}</Text>
                </Pressable>
              ))}

              {user ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Profile"
                  onPress={() => go("/profile")}
                  style={({ pressed }) => [
                    styles.menuItem,
                    pressed && { backgroundColor: theme.backgroundElement },
                  ]}>
                  <UserRound size={20} color={theme.primary} strokeWidth={1.8} />
                  <Text style={[styles.menuText, { color: theme.text }]}>Profile</Text>
                </Pressable>
              ) : null}

              {/* Auth actions */}
              <View style={styles.authSection}>
                {!user ? (
                  <>
                    <PrimaryButton label="Login" onPress={() => go("/login")} />
                    <PrimaryButton
                      label="Sign Up"
                      variant="outline"
                      onPress={() => go("/signup")}
                    />
                  </>
                ) : (
                  <PrimaryButton
                    label="Logout"
                    variant="danger-outline"
                    icon={<LogOut size={18} color={theme.danger} />}
                    onPress={() => {
                      logout();
                      router.replace("/");
                      onClose();
                    }}
                  />
                )}
              </View>

              <View style={styles.footer}>
                <Text style={[styles.version, { color: theme.textMuted }]}>Version 1.0</Text>
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
  },
  drawer: {
    width: "78%",
    height: "100%",
    paddingHorizontal: Spacing.three,
  },
  logoSection: {
    alignItems: "center",
    paddingBottom: Spacing.three,
    marginBottom: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  logo: {
    width: 64,
    height: 64,
    resizeMode: "contain",
  },
  welcome: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: Spacing.one,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    minHeight: TouchTarget + 6,
    paddingHorizontal: Spacing.two,
    borderRadius: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "600",
  },
  authSection: {
    marginTop: Spacing.four,
    gap: Spacing.two,
  },
  footer: {
    marginTop: "auto",
  },
  version: {
    textAlign: "center",
    fontSize: 12,
  },
});
