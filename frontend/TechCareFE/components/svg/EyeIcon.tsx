// components/EyeIcon.tsx
import { Image } from "react-native";

export function EyeIcon({ show }: { show: boolean }) {
  const iconPath = show ? require("@/assets/visibility_off.svg") : require("@/assets/visibility_on.svg");

  return <Image source={iconPath} style={{ width: 24, height: 24, tintColor: "#333" }} />;
}
