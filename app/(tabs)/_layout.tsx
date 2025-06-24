import { Tabs } from "expo-router";
import React from "react";
import { useTheme } from "../../hooks/ThemeProvider";
import { useRouter } from "expo-router";
import AppThemeSwitcher from "../../components/AppThemeSwitcher";
import type { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { CustomTabBarButton } from "../../components/(tabs)/_layout/CustomTabBarButton";
import { createTabBarIcon } from "../../components/(tabs)/_layout/createTabBarIcon";
import { StatusBar } from "expo-status-bar";
import { useDebounce, useDebouncedCallback } from "use-debounce";

export default function TabLayout() {
  const [colors, typo, _, mode] = useTheme();
  const router = useRouter();
  const debounced = useDebouncedCallback((value: string) => {
    router.setParams({ search: value || "" });
  }, 500);

  const defaultScreenOptions = ({
    route,
  }: {
    route: { name: string };
  }): BottomTabNavigationOptions => ({
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
    headerRight: () => <AppThemeSwitcher />,
    tabBarButton: (props) => (
      <CustomTabBarButton onPress={props.onPress} style={props.style}>
        {props.children}
      </CustomTabBarButton>
    ),
  });

  const quotesScreenOptions: BottomTabNavigationOptions = {
    title: "Quotes list",
    tabBarLabel: "Quotes",
    headerTitle: "Quotes",
    headerRight: () => null,
    headerSearchBarOptions: {
      placeholder: "Search quotes",
      onChangeText: (e) => {
        debounced(e.nativeEvent.text);
      },
      onClose: () => {
        debounced("");
      },
    },
  };
  const homeScreenOptions: BottomTabNavigationOptions = {
    title: "Home",
    tabBarLabel: "Home",
    headerTitle: "Home",
    headerTitleAllowFontScaling: true,
    headerTitleStyle: {
      fontSize: typo.heading.fontSize,
    },
  };

  return (
    <>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <Tabs screenOptions={defaultScreenOptions}>
        <Tabs.Screen name="index" options={homeScreenOptions} />
        <Tabs.Screen name="Quotes" options={quotesScreenOptions} />
        <Tabs.Screen
          name="Favorites"
          options={{
            title: "Favorites",
          }}
        />
      </Tabs>
    </>
  );
}
