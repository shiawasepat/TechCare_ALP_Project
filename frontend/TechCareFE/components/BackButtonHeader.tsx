import React from "react";
import { View, Text, StyleSheet, Pressable, Image, ImageSourcePropType } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

type Props = {
  title?: string;
  subtitle?: string;
  avatarSource?: ImageSourcePropType;
  onBack?: () => void;
};

export default function BackButtonHeader({ title, subtitle, avatarSource, onBack }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <Pressable style={styles.backButton} onPress={onBack}>
        <Feather name="arrow-left" size={22} color="#2D6BFF" />
      </Pressable>
      <View style={styles.titleWrap}>
        {avatarSource ? (
          <View style={styles.avatarWrap}>
            <Image source={avatarSource} style={styles.avatar} />
          </View>
        ) : null}
        <View>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingBottom: 12 },
  backButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  titleWrap: { flexDirection: "row", alignItems: "center", marginLeft: 12, flex: 1 },
  avatarWrap: { width: 36, height: 36, borderRadius: 18, overflow: "hidden", borderWidth: 1, borderColor: "#E5E7EB", marginRight: 10 },
  avatar: { width: "100%", height: "100%", backgroundColor: "#D1D5DB" },
  title: { fontSize: 16, fontWeight: "600", color: "#111827" },
  subtitle: { fontSize: 13, color: "#6B7280", fontWeight: "600", marginTop: 2 },
});
