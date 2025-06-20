import { Tabs } from "expo-router";
import { Heart, House, List } from "lucide-react-native";
import React, { ReactNode } from "react";
import {
  Platform,
  StyleProp,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useTheme } from "../../hooks/ThemeProvider";

type CustomTabBarButtonProps = {
  children: ReactNode;
  onPress: React.ComponentProps<typeof TouchableOpacity>["onPress"];
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

function getScreenOptions(routeName: string) {
  return {
    tabBarIcon: createTabBarIcon(routeName),
    tabBarActiveTintColor: "#6200ee",
    tabBarInactiveTintColor: "#999",
    tabBarStyle: {
      backgroundColor: "#fff",
      borderTopColor: "#ccc",
      borderTopWidth: 1,
    },
    headerTitleAlign: "left",
    headerShadowVisible: false,
    headerStyle: {
      backgroundColor: "#fff",
      borderBottomColor: "#ccc",
      borderBottomWidth: 1,
    },
    headerTintColor: "#000",
  };
}

export default function TabLayout() {
  const [colors, typo] = useTheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: createTabBarIcon(route.name),
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.secondaryText,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        headerTitleAlign: "left",
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: colors.card,
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          color: colors.text,
          fontSize: typo.heading.fontSize,
        },

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
          title: "Random quote",
          tabBarLabel: "Home",
          headerTitle: "Your Daily Quote",
          headerTitleAllowFontScaling: true,
          headerTitleStyle: {
            fontSize: typo.heading.fontSize,
          },
        }}
      />
      <Tabs.Screen
        name="Quotes"
        options={{
          title: "Quotes list",
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="Favorites"
        options={{
          title: "Favorites",
        }}
      />
    </Tabs>
  );
}
