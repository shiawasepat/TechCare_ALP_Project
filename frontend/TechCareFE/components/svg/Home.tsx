import { Image } from "react-native";
import { colors } from "@/styles/colors";

export function HomeIcon() {
  return <Image source={require("@/assets/icons/home-service.png")} style={{ width: 24, height: 24, tintColor: colors.primary.backgroundColor }} />;
}
