import { AntDesign } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { colors } from "@/styles/colors";

interface StarIconProps {
  isFilled: boolean;
}

export function StarIcon({ isFilled }: StarIconProps) {
  return (
    <Pressable>
      <AntDesign name={isFilled ? "star" : "star"} size={24} color={isFilled ? colors.rating.fill : colors.rating.empty} />
    </Pressable>
  );
}
