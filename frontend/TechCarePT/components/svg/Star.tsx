import { AntDesign } from "@expo/vector-icons";
import { Pressable } from "react-native";

interface StarIconProps {
  isFilled: boolean;
}

export function StarIcon({ isFilled }: StarIconProps) {
  return (
    <Pressable>
      <AntDesign name="star" size={24} color={isFilled ? "#FBBF24" : "#D1D5DB"} />
    </Pressable>
  );
}
