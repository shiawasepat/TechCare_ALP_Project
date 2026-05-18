import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { Pressable, StyleSheet, Text, View, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/styles/colors";

export function MitraBottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isActiveRoute = (route: string) => pathname === route;

  return (
    <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <Pressable style={styles.bottomNavItem} onPress={() => router.push("/mitra/order-view" as any)}>
        <View style={styles.bottomNavActiveIconWrap}>
          <Feather name="home" size={22} color={isActiveRoute("/(tabs)/mitra/order-view") ? "#2D6BFF" : "#5B6170"} />
        </View>
        <Text style={isActiveRoute("/(tabs)/mitra/order-view") ? styles.bottomNavLabelActive : styles.bottomNavLabel}>Home</Text>
        {isActiveRoute("/(tabs)/mitra/order-view") ? <View style={styles.activeDot} /> : null}
      </Pressable>

      <Pressable style={styles.bottomNavItem} onPress={() => router.push("/mitra/mitra-chat" as any)}>
        <MaterialCommunityIcons name="chat-outline" size={22} color={isActiveRoute("/mitra/mitra-chat") ? "#2D6BFF" : "#5B6170"} />
        <Text style={isActiveRoute("/mitra/mitra-chat") ? styles.bottomNavLabelActive : styles.bottomNavLabel}>Chat</Text>
        {isActiveRoute("/mitra/mitra-chat") ? <View style={styles.activeDot} /> : null}
      </Pressable>

      {/* <Pressable style={styles.bottomNavItem} onPress={() => router.push("/mitra/history")}>
        <Feather name="clock" size={22} color={isActiveRoute("/mitra/history") ? "#2D6BFF" : "#5B6170"} />
        <Text style={isActiveRoute("/mitra/history") ? styles.bottomNavLabelActive : styles.bottomNavLabel}>History</Text>
        {isActiveRoute("/mitra/history") ? <View style={styles.activeDot} /> : null}
      </Pressable> */}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingTop: 10,
    paddingBottom: 12,
    paddingHorizontal: 26,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    shadowColor: "#C8D3E8",
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -6 },
    elevation: 10,
  },
  bottomNavItem: {
    alignItems: "center",
    justifyContent: "flex-start",
    minHeight: 48,
  },
  bottomNavActiveIconWrap: {
    marginBottom: 2,
  },
  bottomNavLabel: {
    marginTop: 3,
    fontSize: 12,
    color: "#4B5563",
  },
  bottomNavLabelActive: {
    marginTop: 3,
    fontSize: 12,
    color: colors.primary.backgroundColor,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary.backgroundColor,
    marginTop: 4,
  },
});
