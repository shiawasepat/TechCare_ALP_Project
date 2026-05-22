import { Image } from "react-native";
import { colors } from "@/styles/colors";

export function ClockIcon() {
  return <Image source={require("@/assets/icons/clock.png")} style={[{ width: 24, height: 24 }, { tintColor: colors.primary.backgroundColor }]} />;
}
