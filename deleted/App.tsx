import { StatusBar } from "expo-status-bar";
import { StyleSheet, Switch, Text, View } from "react-native";
import { ThemeProvider, useTheme } from "../hooks/ThemeProvider";
import { ExpoRoot } from "expo-router";

export default function App() {
  return <ThemeProvider>{/* <ExpoRoot /> */}</ThemeProvider>;
}

function Content() {
  const [colors, typography, toggleFunction, mode] = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[typography.heading, { textAlign: "center" }]}>
        Open up App.tsx to start working on your app!
      </Text>
      <Switch
        value={mode === "dark"}
        onValueChange={() => {
          toggleFunction();
        }}
      ></Switch>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
  },
});
