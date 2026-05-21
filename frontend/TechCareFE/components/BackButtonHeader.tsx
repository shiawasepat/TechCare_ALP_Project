import React from "react";
import { View, Text, StyleSheet, Pressable, Image, ImageSourcePropType } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

type Props = {
  title?: string;
  subtitle?: string;
  avatarSource?: ImageSourcePropType;
  onBack?: () => void;
  online?: boolean;
};

export default function BackButtonHeader({ title, subtitle, avatarSource, onBack, online }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      {onBack ? (
        <Pressable style={styles.backButton} onPress={onBack}>
          <Feather name="arrow-left" size={22} color="#2D6BFF" />
        </Pressable>
      ) : null}
      <View style={[styles.titleWrap, !onBack ? styles.titleCentered : undefined]}>
        {avatarSource ? (
          <View style={styles.avatarWrap}>
            <Image source={avatarSource} style={styles.avatar} />
          </View>
        ) : null}
        <View>
          {title ? <Text style={[styles.title, !onBack && styles.titleCenteredText]}>{title}</Text> : null}
          {typeof online === "boolean" ? (
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, online ? styles.statusOnline : styles.statusOffline]} />
              <Text style={styles.statusText}>{online ? "Online" : "Offline"}</Text>
            </View>
          ) : (
            subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingBottom: 12 },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.2,
    borderColor: "#E5E7EB",
    shadowColor: "#D1D5DB",
    shadowOpacity: 0.14,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  titleWrap: { flexDirection: "row", alignItems: "center", marginLeft: 12, flex: 1 },
  avatarWrap: { width: 36, height: 36, borderRadius: 18, overflow: "hidden", borderWidth: 1, borderColor: "#E5E7EB", marginRight: 10 },
  avatar: { width: "100%", height: "100%", backgroundColor: "#D1D5DB" },
  title: { fontSize: 16, fontWeight: "700", color: "#111827" },
  subtitle: { fontSize: 13, color: "#6B7280", fontWeight: "600", marginTop: 2 },
  statusRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  statusOnline: { backgroundColor: "#10B981" },
  statusOffline: { backgroundColor: "#9CA3AF" },
  statusText: { fontSize: 13, color: "#6B7280", fontWeight: "600" },
  titleCentered: { marginLeft: 0, flex: 1, justifyContent: "center", alignItems: "center" },
  titleCenteredText: { textAlign: "center" },
});
