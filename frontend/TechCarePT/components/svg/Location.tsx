import { Image } from "react-native";
import { colors } from "@/styles/colors";

export function LocationIcon() {
  return <Image source={require("@/assets/icons/location.png")} style={[{ width: 24, height: 24 }, { tintColor: colors.primary.backgroundColor }]} />;
}
