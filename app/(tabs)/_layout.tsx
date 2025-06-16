import { Tabs } from "expo-router";
import { Heart, House } from "lucide-react-native";
import React, { ReactNode } from "react";
import {
  GestureResponderEvent,
  Platform,
  StyleProp,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

type CustomTabBarButtonProps = {
  children: ReactNode;
  onPress:
    | (((
        e:
          | React.MouseEvent<HTMLAnchorElement, MouseEvent>
          | GestureResponderEvent
      ) => void) &
        ((
          e:
            | React.MouseEvent<HTMLAnchorElement, MouseEvent>
            | GestureResponderEvent
        ) => void))
    | undefined;
  style: StyleProp<ViewStyle>;
};

export function createTabBarIcon(
  routeName: string
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
            <House color={focused ? color : "gray"} size={size} />
          </View>
        );
      case "Favorites":
        return (
          <View testID="heart-icon">
            <Heart color={focused ? color : "gray"} size={size} />
          </View>
        );

      default:
        return null;
    }
  };
}

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

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: createTabBarIcon(route.name),
        tabBarButton: (props) => {
          return (
            <CustomTabBarButton onPress={props.onPress} style={props.style}>
              {props.children}
            </CustomTabBarButton>
          );
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="Favorites"
        options={{
          title: "Favorites",
        }}
      />
    </Tabs>
  );
}
