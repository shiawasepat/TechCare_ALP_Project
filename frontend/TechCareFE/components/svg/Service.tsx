import { Image, View } from "react-native";
import { colors } from "@/styles/colors";

interface ServiceIconProps {
  service: "Home Service" | "Scheduled Service";
}

export function ServiceIcon({ service }: ServiceIconProps) {
  switch (service) {
    case "Home Service":
      return (
        <View>
          <Image source={require("@/assets/icons/home-service.png")} tintColor={colors.primary.backgroundColor} />
        </View>
      );
    case "Scheduled Service":
      return (
        <View>
          <Image source={require("@/assets/icons/calendar-clock.png")} tintColor={colors.primary.backgroundColor} />
        </View>
      );
    default:
      return null;
  }
}
