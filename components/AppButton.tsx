import React from "react";
import {
  TouchableOpacity,
  TouchableNativeFeedback,
  View,
  Text,
  StyleSheet,
  Platform,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useTheme } from "../hooks/useTheme";

type AppButtonProps = {
  title: string;
  onPress?: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function AppButton({
  title,
  onPress,
  isLoading = false,
  isDisabled = false,
  style,
}: AppButtonProps) {
  const [color, typo] = useTheme();

  const containerStyle: ViewStyle = {
    ...styles.button,
    backgroundColor: color.accent,
  };
  const textStyle: TextStyle = {
    ...typo.button,
    textAlign: "center",
  };

  function renderContent() {
    if (isLoading) {
      return <ActivityIndicator color="#fff" />;
    }
    return (
      <Text
        testID="app-button-title"
        style={textStyle}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {title}
      </Text>
    );
  }

  const disabled = isLoading;

  if (Platform.OS === "android") {
    return (
      <TouchableNativeFeedback
        testID="app-button-pressable"
        onPress={onPress}
        disabled={disabled || isDisabled}
      >
        <View style={[containerStyle, style, disabled && styles.disabled]}>
          {renderContent()}
        </View>
      </TouchableNativeFeedback>
    );
  }

  return (
    <TouchableOpacity
      testID="app-button-pressable"
      style={[containerStyle, style, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled || isDisabled}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  disabled: {
    opacity: 0.5,
  },
});
