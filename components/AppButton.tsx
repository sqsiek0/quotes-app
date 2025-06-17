import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  TouchableNativeFeedback,
  TextStyle,
  ViewStyle,
} from "react-native";
import { useTheme } from "../hooks/ThemeProvider";

type AppButtonPros = {
  title: string;
  onPress?: () => void;
};

export default function AppButton({ title, onPress }: AppButtonPros) {
  const [color, typo] = useTheme();
  const buttonStyle: ViewStyle = {
    ...styles.button,
    backgroundColor: color.accent,
  };
  const textStyle: TextStyle = {
    ...typo.button,
    textAlign: "center",
  };

  if (Platform.OS === "android") {
    return (
      <TouchableNativeFeedback
        testID="app-button-pressable"
        style={buttonStyle}
        onPress={onPress}
      >
        <Text testID="app-button-title" style={textStyle} numberOfLines={1}>
          {title}
        </Text>
      </TouchableNativeFeedback>
    );
  }

  return (
    <TouchableOpacity
      testID="app-button-pressable"
      style={buttonStyle}
      onPress={onPress}
    >
      <Text testID="app-button-title" numberOfLines={1} style={textStyle}>
        {title}
      </Text>
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
});
