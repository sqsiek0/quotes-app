import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  TouchableNativeFeedback,
  TextStyle,
  ViewStyle,
  ActivityIndicator,
  View,
} from "react-native";
import { useTheme } from "../hooks/ThemeProvider";

type AppButtonPros = {
  title: string;
  onPress?: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
};

export default function AppButton({
  title,
  onPress,
  isLoading,
  isDisabled = false,
}: AppButtonPros) {
  const [color, typo] = useTheme();
  const buttonStyle: ViewStyle = {
    ...styles.button,
    backgroundColor: color.accent,
  };
  const textStyle: TextStyle = {
    ...typo.button,
    textAlign: "center",
  };

  function buttonContent() {
    if (isLoading) {
      return <ActivityIndicator color={"white"} />;
    } else {
      return (
        <Text testID="app-button-title" style={textStyle} numberOfLines={1}>
          {title}
        </Text>
      );
    }
  }

  if (Platform.OS === "android") {
    return (
      <TouchableNativeFeedback
        testID="app-button-pressable"
        onPress={onPress}
        disabled={isLoading || isDisabled}
      >
        <View style={[buttonStyle, isLoading && styles.disabled]}>
          {buttonContent()}
        </View>
      </TouchableNativeFeedback>
    );
  }

  return (
    <TouchableOpacity
      testID="app-button-pressable"
      style={[buttonStyle, isLoading && styles.disabled]}
      onPress={onPress}
      disabled={isLoading || isDisabled}
    >
      {buttonContent()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  buttonOutlined: {
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "transparent",
  },
  disabled: {
    opacity: 0.5,
  },
});
