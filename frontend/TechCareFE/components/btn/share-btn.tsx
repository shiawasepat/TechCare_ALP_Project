import { colors } from "@/styles/colors";
import { Image } from "react-native";

export function ShareBtn() {
  return <Image source={require("@/assets/icons/share.png")} style={[{ width: 24, height: 24, marginRight: 16 }, { tintColor: colors.tintIcon.tintColor }]} />;
}
