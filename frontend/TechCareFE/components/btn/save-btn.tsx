import { colors } from "@/styles/colors";
import { Image } from "react-native";

export function SaveBtn() {
  return <Image source={require("@/assets/icons/bookmark-off.png")} style={[{ width: 24, height: 24, marginRight: 16 }, { tintColor: "#111827" }]} />;
}
