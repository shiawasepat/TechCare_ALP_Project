import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "@/styles/colors";

const styles = StyleSheet.create({
  backIcon: {
    marginRight: 16,
    backgroundColor: colors.primary.backgroundColor,
    padding: 8,
    borderRadius: 30,
    tintColor: "#fff",
  },
});

export function BackBtn() {
  return (
    <TouchableOpacity style={styles.backIcon}>
      <Image source={require("@/assets/icons/arrow-back.png")} />
    </TouchableOpacity>
  );
}
