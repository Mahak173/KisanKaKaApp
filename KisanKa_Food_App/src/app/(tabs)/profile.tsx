import { useRouter } from "expo-router";
import {
  Bell,
  ChevronRight,
  Headset,
  Heart,
  LogOut,
  LucideIcon,
  MapPin,
  Settings,
  ShoppingBag,
  UserRound,
} from "lucide-react-native";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton, ScreenHeader, StateView } from "@/components/ui";
import { Radius, Shadows, Spacing, TouchTarget } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useTheme } from "@/hooks/use-theme";

type MenuRowProps = {
  icon: LucideIcon;
  label: string;
  badge?: string;
  onPress: () => void;
  showDivider: boolean;
};

function MenuRow({ icon: Icon, label, badge, onPress, showDivider }: MenuRowProps) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
        showDivider && { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: theme.border },
        pressed && { backgroundColor: theme.backgroundElement },
      ]}>
      <View style={[styles.menuIcon, { backgroundColor: theme.primarySoft }]}>
        <Icon size={18} color={theme.primary} strokeWidth={1.8} />
      </View>
      <Text style={[styles.menuText, { color: theme.text }]}>{label}</Text>
      {badge ? (
        <View style={[styles.menuBadge, { backgroundColor: theme.primarySoft }]}>
          <Text style={[styles.menuBadgeText, { color: theme.primary }]}>{badge}</Text>
        </View>
      ) : null}
      <ChevronRight size={18} color={theme.textMuted} />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();

  if (!user) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={["top"]}>
        <ScreenHeader title="My Account" showBack={false} />
        <StateView
          icon={UserRound}
          title="You're not logged in"
          message="Login to view your profile, orders and wishlist."
          actionLabel="Login"
          onAction={() => router.push("/login")}>
          <PrimaryButton
            label="Create Account"
            variant="outline"
            onPress={() => router.push("/signup")}
            style={styles.signupButton}
          />
        </StateView>
      </SafeAreaView>
    );
  }

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          logout();
          router.replace("/login");
        },
      },
    ]);
  };

  const displayName = user.displayName || user.email?.split("@")[0] || "KisanKaka Customer";

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={["top"]}>
      <ScreenHeader title="My Account" showBack={false} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* User card */}
        <View style={[styles.profileCard, { backgroundColor: theme.surface }, Shadows.card]}>
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
            <UserRound size={36} color={theme.onPrimary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
              {displayName}
            </Text>
            {user.email ? (
              <Text style={[styles.contact, { color: theme.textSecondary }]} numberOfLines={1}>
                {user.email}
              </Text>
            ) : null}
            {user.phoneNumber ? (
              <Text style={[styles.contact, { color: theme.textSecondary }]}>
                {user.phoneNumber}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Menu */}
        <View style={[styles.menu, { backgroundColor: theme.surface }, Shadows.card]}>
          <MenuRow
            icon={ShoppingBag}
            label="My Orders"
            onPress={() => router.push("/orders")}
            showDivider
          />
          <MenuRow
            icon={MapPin}
            label="Saved Addresses"
            onPress={() => router.push("/address")}
            showDivider
          />
          <MenuRow
            icon={Heart}
            label="Wishlist"
            badge={wishlist.length > 0 ? String(wishlist.length) : undefined}
            onPress={() => router.push("/wishlist")}
            showDivider
          />
          <MenuRow
            icon={Bell}
            label="Notifications"
            onPress={() => router.push("/notifications")}
            showDivider
          />
          <MenuRow
            icon={Headset}
            label="Support & Help"
            onPress={() =>
              router.push({ pathname: "/coming-soon", params: { title: "Support & Help" } })
            }
            showDivider
          />
          <MenuRow
            icon={Settings}
            label="Settings"
            onPress={() =>
              router.push({ pathname: "/coming-soon", params: { title: "Settings" } })
            }
            showDivider={false}
          />
        </View>

        <PrimaryButton
          label="Logout"
          variant="danger-outline"
          icon={<LogOut size={18} color={theme.danger} />}
          onPress={handleLogout}
          style={styles.logout}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.three,
    paddingBottom: Spacing.five,
  },
  signupButton: {
    marginTop: Spacing.two,
    minWidth: 180,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    borderRadius: Radius.lg,
    padding: Spacing.three,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "800",
  },
  contact: {
    fontSize: 13,
    marginTop: 2,
  },
  menu: {
    borderRadius: Radius.lg,
    marginTop: Spacing.three,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    minHeight: TouchTarget + 12,
  },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
  },
  menuBadge: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: "center",
  },
  menuBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  logout: {
    marginTop: Spacing.four,
  },
});
