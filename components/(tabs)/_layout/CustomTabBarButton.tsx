import { ReactNode } from "react";
import {
  Platform,
  StyleProp,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

type CustomTabBarButtonProps = {
  children: ReactNode;
  onPress: React.ComponentProps<typeof TouchableOpacity>["onPress"];
  style: StyleProp<ViewStyle>;
};

export function CustomTabBarButton({
  children,
  onPress,
  style,
}: CustomTabBarButtonProps) {
  if (Platform.OS === "android") {
    return (
      <TouchableNativeFeedback onPress={onPress}>
        <View style={style}>{children}</View>
      </TouchableNativeFeedback>
    );
  } else {
    return (
      <TouchableOpacity onPress={onPress} style={style}>
        {children}
      </TouchableOpacity>
    );
  }
}
