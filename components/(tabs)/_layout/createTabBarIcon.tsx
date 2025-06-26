import { Heart, House, List } from "lucide-react-native";
import { View } from "react-native";

export function createTabBarIcon(
  routeName: string,
): (props: {
  focused: boolean;
  color: string;
  size: number;
}) => React.ReactElement | null {
  return ({ focused, color, size }) => {
    switch (routeName) {
      case "index":
        return (
          <View testID="house-icon">
            <House color={color} size={size} />
          </View>
        );
      case "Favorites":
        return (
          <View testID="heart-icon">
            <Heart color={color} size={size} />
          </View>
        );
      case "Quotes":
        return (
          <View testID="quotes-icon">
            <List color={color} size={size} />
          </View>
        );

      default:
        return null;
    }
  };
}
