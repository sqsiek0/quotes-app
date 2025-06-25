import { Moon, Sun } from "lucide-react-native";
import { Pressable, Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import { useTheme } from "../hooks/useTheme";

export default function AppThemeSwitcher() {
  const [colors, _, toggleTheme, mode] = useTheme();
  const spinAnim = useRef(new Animated.Value(0)).current;
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    spinAnim.setValue(0);
    Animated.timing(spinAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [mode]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Pressable onPress={toggleTheme}>
      <Animated.View
        testID={"app-theme-switcher"}
        style={{ marginRight: 16, transform: [{ rotate: spin }] }}
      >
        {mode === "dark" ? (
          <Moon testID="theme-switcher-moon" color={colors.text} size={24} />
        ) : (
          <Sun testID="theme-switcher-sun" color={colors.text} size={24} />
        )}
      </Animated.View>
    </Pressable>
  );
}
