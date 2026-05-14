import { Image } from "react-native";

export function DropdownIcon() {
  return <Image source={require("@/assets/icons/drop-down.png")} style={[{ width: 24, height: 24 }, { tintColor: "#fff" }]} />;
}
