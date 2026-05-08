// components/EyeIcon.tsx
import { Image } from "react-native";

export function EyeIcon({ show }: { show: boolean }) {
  const iconPath = show ? require("@/assets/icons/visibility-off.png") : require("@/assets/icons/visibility-on.png");

  return <Image source={iconPath} style={{ width: 24, height: 24, tintColor: "#333" }} />;
}
